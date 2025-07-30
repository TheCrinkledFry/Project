package main

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetOrders retrieves all orders from the database
func GetOrders(c *gin.Context) {
	rows, err := DB.Query("SELECT id, customer_name, total_price, status, created_at, executed_at FROM orders")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	defer rows.Close()

	orders := []Order{}
	for rows.Next() {
		var o Order
		if err := rows.Scan(&o.ID, &o.CustomerName, &o.TotalPrice, &o.Status, &o.CreatedAt, &o.ExecutedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning order"})
			return
		}
		orders = append(orders, o)
	}

	// Check for errors encountered during iteration
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetProducts(c *gin.Context) {
	// Query the database for all active products
	rows, err := DB.Query("SELECT id, name, description, price, quantity, is_active FROM products WHERE is_active = TRUE")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()

	// Create an array to hold products
	products := []Product{}
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Quantity, &p.IsActive); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning product"})
			return
		}
		products = append(products, p)
	}

	// Check for errors encountered during iteration
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading products"})
		return
	}

	// Return the products as JSON
	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")

	// Validate product ID is a valid integer
	productID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var p Product
	err = DB.QueryRow("SELECT id, name, description, price, quantity, is_active FROM products WHERE id = ? AND is_active = TRUE", productID).
		Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Quantity, &p.IsActive)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product"})
		return
	}

	c.JSON(http.StatusOK, p)
}

// handlers.go login

func Login(c *gin.Context) {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Bind JSON request to loginRequest struct
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check if the account exists in the database
	var account Account
	err := DB.QueryRow("SELECT id, name, password, email FROM accounts WHERE email = ?", loginRequest.Email).Scan(&account.ID, &account.Name, &account.Password, &account.Email)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Compare the passwords (Note: Use bcrypt for real-world projects)
	if loginRequest.Password != account.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Login successful, send user details or token
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":    account.ID,
			"name":  account.Name,
			"email": account.Email,
		},
	})
}
