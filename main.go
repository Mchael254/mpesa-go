package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Mchael254/mpesa-go/routes"
	"github.com/Mchael254/mpesa-go/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Error loading .env file", err)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "5400"
	}
	log.Printf("Starting server on port: %s", port)

	// Start the WebSocket broadcasting goroutine
	go controllers.StartBroadcasting()

	// Setup Gin router
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Origin", "Content-Type"},
	}))

	// WebSocket endpoint
	r.GET("/ws", controllers.WebSocketHandler)

	// Simple welcome route
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Welcome to Venumux")
	})

	// API routes
	api := r.Group("/api")
	routes.RegisterMpesaRoutes(api)

	// Run purely on localhost
	log.Printf("🌐 Server accessible at http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start HTTP server: %v", err)
	}
}
