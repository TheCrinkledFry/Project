package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupMockDB(t *testing.T) (sqlmock.Sqlmock, func()) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)

	db = mockDB

	return mock, func() {
		db.Close()
	}
}

func TestCheckCredentials_Success(t *testing.T) {
	mock, teardown := setupMockDB(t)
	defer teardown()

	email := "alicejones@gmail.com"
	password := "pass1234"
	name := "Alice"
	role := "manager"

	rows := sqlmock.NewRows([]string{"password", "name", "role"}).
		AddRow(password, name, role)
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs(email).
		WillReturnRows(rows)

	gotName, gotRole, isValid, err := checkCredentials(email, password)
	assert.NoError(t, err)
	assert.True(t, isValid)
	assert.Equal(t, name, gotName)
	assert.Equal(t, role, gotRole)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckCredentials_WrongPassword(t *testing.T) {
	mock, teardown := setupMockDB(t)
	defer teardown()

	email := "alicejones@gmail.com"
	password := "wrongpass"
	dbPass := "pass1234"
	name := "Alice"
	role := "manager"

	rows := sqlmock.NewRows([]string{"password", "name", "role"}).
		AddRow(dbPass, name, role)
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs(email).
		WillReturnRows(rows)

	gotName, gotRole, isValid, err := checkCredentials(email, password)
	assert.NoError(t, err)   // no DB error, just bad password
	assert.False(t, isValid) // login invalid
	assert.Empty(t, gotName)
	assert.Empty(t, gotRole)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestLoginHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mock, teardown := setupMockDB(t)
	defer teardown()

	email := "alicejones@gmail.com"
	password := "pass1234"
	name := "Alice"
	role := "manager"

	rows := sqlmock.NewRows([]string{"password", "name", "role"}).
		AddRow(password, name, role)
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs(email).
		WillReturnRows(rows)

	router := gin.Default()
	router.POST("/login", loginHandler)

	loginReq := LoginRequest{Email: email, Password: password}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp LoginResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.True(t, resp.Success)
	assert.Equal(t, "Login successful!", resp.Message)
	assert.Equal(t, name, resp.Name)
	assert.Equal(t, role, resp.Role)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetProductsHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mock, teardown := setupMockDB(t)
	defer teardown()

	rows := sqlmock.NewRows([]string{"id", "name", "description", "price", "quantity", "is_active", "discontinued", "image_url"}).
		AddRow(1, "Organic Bananas", "Fresh organic bananas", 1.20, 100, true, false, "/assets/holdingEachOther.png").
		AddRow(2, "Almond Milk", "Unsweetened almond milk", 3.50, 60, true, false, "/assets/pinkGirl.jpeg")

	mock.ExpectQuery("SELECT id, name, description, price, quantity, is_active, discontinued, image_url FROM products").
		WillReturnRows(rows)

	router := gin.Default()
	router.GET("/products", getProductsHandler)

	req, _ := http.NewRequest(http.MethodGet, "/products", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var products []Product
	err := json.Unmarshal(w.Body.Bytes(), &products)
	assert.NoError(t, err)
	assert.Len(t, products, 2)
	assert.Equal(t, "Organic Bananas", products[0].Name)
	assert.Equal(t, "/assets/pinkGirl.jpeg", products[1].ImageURL)

	assert.NoError(t, mock.ExpectationsWereMet())
}
