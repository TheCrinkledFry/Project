package main

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Disable proxy warning
	r.SetTrustedProxies(nil)

	// Define the routes for products
	r.GET("/products", GetProducts) // Get all products

	// Define the routes for orders
	r.GET("/orders", GetOrders) // Fetch all orders

	// Define the login route
	r.POST("/api/login", Login) // Login route

	return r
}

// package main
//
// import "github.com/gin-gonic/gin"
//
// func SetupRouter() *gin.Engine {
// 	r := gin.Default()
//
// 	r.SetTrustedProxies(nil) // disable proxy warning
//
// 	r.GET("/products", GetProducts)
// 	r.GET("/products/:id", GetProductByID)
//
// 	// New Orders Route
// 	r.GET("/orders", GetOrders) // This will fetch all orders
//
// 	// New Login Route
// 	r.POST("api/login", Login)
//
// 	return r
// }
//
