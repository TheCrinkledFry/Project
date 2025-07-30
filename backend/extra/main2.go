package main

import (
	"log"
)

func main() {
	if err := InitDB(); err != nil {
		log.Fatalf("DB initialization failed: %v", err)
	}

	r := SetupRouter()
	log.Println("Starting server at :8080")
	err := r.Run(":8080")
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
