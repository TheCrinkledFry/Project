package main

import "time"

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	IsActive    bool    `json:"is_active"`
}

type Account struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Order struct {
	ID           int        `json:"id"`
	CustomerName string     `json:"customer_name"`
	TotalPrice   float64    `json:"total_price"`
	Status       string     `json:"status"`
	CreatedAt    time.Time  `json:"created_at"`
	ExecutedAt   *time.Time `json:"executed_at,omitempty"`
}

type OrderItem struct {
	ID              int     `json:"id"`
	OrderID         int     `json:"order_id"`
	ProductID       int     `json:"product_id"`
	Quantity        int     `json:"quantity"`
	PriceAtPurchase float64 `json:"price_at_purchase"`
}
