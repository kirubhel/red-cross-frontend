package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	// Conn string for vmms_auth database
	connStr := "postgres://ercs:Ercs@RC%23123@localhost:5432/vmms_auth?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping DB: %v", err)
	}
	fmt.Println("Successfully connected to database.")

	// Query users
	rows, err := db.Query("SELECT id, first_name, last_name, phone_number, role FROM users")
	if err != nil {
		log.Fatalf("Failed to query users: %v", err)
	}
	defer rows.Close()

	fmt.Println("\n--- Users in vmms_auth ---")
	count := 0
	for rows.Next() {
		var id, firstName, lastName, phoneNumber string
		var role int
		if err := rows.Scan(&id, &firstName, &lastName, &phoneNumber, &role); err != nil {
			log.Fatalf("Failed to scan row: %v", err)
		}
		fmt.Printf("User: %s %s | Phone: %s | Role: %d | ID: %s\n", firstName, lastName, phoneNumber, role, id)
		count++
	}
	fmt.Printf("\nTotal users in vmms_auth: %d\n", count)
}
