package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	rows, err := DB.Query("SELECT id, name, description, price, quantity, is_active FROM products WHERE is_active = TRUE")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Quantity, &p.IsActive); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning product"})
			return
		}
		products = append(products, p)
	}

	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	var p Product

	err := DB.QueryRow("SELECT id, name, description, price, quantity, is_active FROM products WHERE id = ? AND is_active = TRUE", id).
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
