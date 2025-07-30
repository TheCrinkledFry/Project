// package main
//
// import (
// 	"log"
// )
//
// func main() {
// 	if err := InitDB(); err != nil {
// 		log.Fatalf("DB initialization failed: %v", err)
// 	}
//
// 	r := SetupRouter()
// 	log.Println("Starting server at :8080")
// 	err := r.Run(":8080")
// 	if err != nil {
// 		log.Fatalf("Failed to start server: %v", err)
// 	}
// }

package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set up Gin router
	r := gin.Default()

	// Configure CORS options (you can customize this as needed)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                             // Allow React app's origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},                      // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                          // Allow credentials like cookies or HTTP authentication
	}))

	// Your routes
	r.POST("/api/login", loginHandler)

	// Start the server
	r.Run(":8080")
}

// loginHandler is your login handler function
func loginHandler(c *gin.Context) {
	// Your login logic here
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}
