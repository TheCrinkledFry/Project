package main

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestCheckCredentials(t *testing.T) {
	// Setup sqlmock
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open mock db, %v", err)
	}
	defer mockDB.Close()

	email := "test@example.com"
	password := "password123"
	name := "TestUser"
	role := "admin"

	// Successful query expectation
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs(email).
		WillReturnRows(sqlmock.NewRows([]string{"password", "name", "role"}).AddRow(password, name, role))

	gotName, gotRole, isValid, err := checkCredentials(mockDB, email, password)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if !isValid {
		t.Errorf("expected valid credentials")
	}
	if gotName != name {
		t.Errorf("expected name %s, got %s", name, gotName)
	}
	if gotRole != role {
		t.Errorf("expected role %s, got %s", role, gotRole)
	}

	// Incorrect password
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs(email).
		WillReturnRows(sqlmock.NewRows([]string{"password", "name", "role"}).AddRow("wrongpass", name, role))

	_, _, isValid, err = checkCredentials(mockDB, email, "badpass")
	if err == nil || isValid {
		t.Errorf("expected invalid credentials error")
	}

	// No rows (user not found)
	mock.ExpectQuery("SELECT password, name, role FROM accounts WHERE email = ?").
		WithArgs("nouser@example.com").
		WillReturnError(sql.ErrNoRows)

	_, _, isValid, err = checkCredentials(mockDB, "nouser@example.com", password)
	if err == nil || isValid {
		t.Errorf("expected user not found error")
	}
}
