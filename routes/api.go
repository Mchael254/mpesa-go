package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/Mchael254/mpesa-go/middlewares"
	"github.com/Mchael254/mpesa-go/controllers"
)


// RegisterMpesaRoutes sets up routes for Mpesa endpoints
func RegisterMpesaRoutes(rg *gin.RouterGroup) {
	// Routes that require Access Token Middleware
	rg.POST("/stkPush", middlewares.AccessTokenMiddleware(), controllers.InitiateSTKPush)

	// rg.POST("/confirmPayment/:CheckoutRequestID", middlewares.AccessTokenMiddleware(), controllers.ConfirmPayment)

	// Callback route does NOT need token middleware
	rg.POST("/stkPushCallback/:Order_ID", controllers.StkPushCallback)
}
