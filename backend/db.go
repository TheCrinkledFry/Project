package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() error {
	// Data source name format: username:password@protocol(address)/dbname?param=value
	dsn := "root:Jfyetdhfyd@tcp(127.0.0.1:3306)/backend?parseTime=true"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to open DB: %w", err)
	}

	// Test connection
	err = db.Ping()
	if err != nil {
		return fmt.Errorf("failed to ping DB: %w", err)
	}

	DB = db
	log.Println("Database connected")
	return nil
}

// CloseDB cleanly closes the database connection pool
func CloseDB() {
	if DB != nil {
		err := DB.Close()
		if err != nil {
			log.Printf("Error closing DB: %v", err)
		} else {
			log.Println("Database connection closed")
		}
	}
}
