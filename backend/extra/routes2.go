package main

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Products routes
	r.GET("/products", GetProducts)
	r.GET("/products/:id", GetProductByID)

	// TODO: Add routes for accounts, orders, discounts, etc.

	return r
}
