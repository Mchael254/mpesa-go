package controllers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/Mchael254/mpesa-go/utils"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true 
	},
}

var wsClients = make(map[*websocket.Conn]bool)
var wsBroadcast = make(chan map[string]interface{})

func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket Upgrade failed:", err)
		return
	}
	defer conn.Close()
	wsClients[conn] = true

	for {
		// Keep the connection open — read (but ignore) messages
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Println("WebSocket Read Error:", err)
			delete(wsClients, conn)
			break
		}
	}
}

func StartBroadcasting() {
	for {
		msg := <-wsBroadcast
		log.Printf("Broadcasting message: %+v", msg)
		for conn := range wsClients {
			if err := conn.WriteJSON(msg); err != nil {
				log.Println("WebSocket Write Error:", err)
				conn.Close()
				delete(wsClients, conn)
			}
		}
	}
}

// Structs for binding JSON requests and responses
type STKPushRequestBody struct {
	Amount  string `json:"amount" binding:"required"`
	Phone   string `json:"phone" binding:"required"`
	OrderID string `json:"Order_ID" binding:"required"`
}

type STKCallbackBody struct {
	Body struct {
		StkCallback struct {
			MerchantRequestID string `json:"MerchantRequestID"`
			CheckoutRequestID string `json:"CheckoutRequestID"`
			ResultCode        int    `json:"ResultCode"`
			ResultDesc        string `json:"ResultDesc"`
			CallbackMetadata  struct {
				Item []struct {
					Name  string      `json:"Name"`
					Value interface{} `json:"Value"`
				} `json:"Item"`
			} `json:"CallbackMetadata"`
		} `json:"stkCallback"`
	} `json:"Body"`
}

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

}

// initiateSTKPush handles the STK push request
func InitiateSTKPush(c *gin.Context) {
	var body STKPushRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Get access token from context (middleware should set this)
	accessToken, exists := c.Get("safaricom_access_token")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token missing"})
		return
	}

	timestamp := utils.GetTimeStamp()
	passwordStr := os.Getenv("BUSINESS_SHORT_CODE") + os.Getenv("PASS_KEY") + timestamp
	password := base64.StdEncoding.EncodeToString([]byte(passwordStr))

	callbackURL := os.Getenv("CALLBACK_BASE_URL")
	log.Printf("Using callback URL: %s", callbackURL)

	payload := map[string]interface{}{
		"BusinessShortCode": os.Getenv("BUSINESS_SHORT_CODE"),
		"Password":          password,
		"Timestamp":         timestamp,
		"TransactionType":   "CustomerPayBillOnline",
		"Amount":            body.Amount,
		"PartyA":            body.Phone,
		"PartyB":            os.Getenv("BUSINESS_SHORT_CODE"),
		"PhoneNumber":       body.Phone,
		"CallBackURL":       fmt.Sprintf("%s/api/stkPushCallback/%s", callbackURL, body.OrderID),
		"AccountReference":  "Venum",
		"TransactionDesc":   "Paid online",
	}

	jsonPayload, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", bytes.NewBuffer(jsonPayload))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create request", "error": err.Error()})
		return
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"message": "Error with the stk push", "error": err.Error()})
		return
	}
	defer resp.Body.Close()

	bodyResp, _ := io.ReadAll(resp.Body)
	c.Data(resp.StatusCode, "application/json", bodyResp)
}

// stkPushCallback handles the STK push callback from Safaricom
func StkPushCallback(c *gin.Context) {
	orderID := c.Param("Order_ID")

	var callbackBody STKCallbackBody
	if err := c.ShouldBindJSON(&callbackBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid callback data", "error": err.Error()})
		return
	}

	stk := callbackBody.Body.StkCallback

	// Prepare base log
	baseLog := map[string]interface{}{
		"orderId":           orderID,
		"merchantRequestId": stk.MerchantRequestID,
		"checkoutRequestId": stk.CheckoutRequestID,
		"resultCode":        stk.ResultCode,
		"resultDesc":        stk.ResultDesc,
		"phone":             nil,
		"amount":            nil,
		"receipt":           nil,
		"date":              nil,
	}

	// Handle different cases
	if stk.ResultCode == 1032 {
		fmt.Println("TRANSACTION CANCELLED - OrderID:", orderID) // More visible
		log.Println("Transaction cancelled by user:", orderID)   // Original log
		log.Printf("[CANCELLED] Order: %s | MerchantReqID: %s | CheckoutReqID: %s",
			orderID,
			stk.MerchantRequestID,
			stk.CheckoutRequestID)
		wsBroadcast <- map[string]interface{}{
			"event":   "cancelled",
			"orderId": orderID,
			"status":  "Cancelled by user",
		}
		c.JSON(http.StatusOK, gin.H{"success": false, "cancelled": true})
		return
	}

	if stk.CallbackMetadata.Item == nil {
		fmt.Println("Failed transaction no metadata:", baseLog)
		c.JSON(http.StatusOK, gin.H{"success": false, "failed": true})
		return
	}

	// Extract metadata
	var phone, amount, receipt, date string
	for _, item := range stk.CallbackMetadata.Item {
		switch item.Name {
		case "PhoneNumber":
			if v, ok := item.Value.(string); ok {
				phone = v
			} else if v, ok := item.Value.(float64); ok {
				phone = fmt.Sprintf("%.0f", v)
			}
		case "Amount":
			if v, ok := item.Value.(float64); ok {
				amount = fmt.Sprintf("%.2f", v)
			} else if v, ok := item.Value.(string); ok {
				amount = v
			}
		case "MpesaReceiptNumber":
			if v, ok := item.Value.(string); ok {
				receipt = v
			}
		case "TransactionDate":
			if v, ok := item.Value.(string); ok {
				date = v
			} else if v, ok := item.Value.(float64); ok {
				date = fmt.Sprintf("%.0f", v)
			}
		}
	}

	fullLog := baseLog
	fullLog["phone"] = phone
	fullLog["amount"] = amount
	fullLog["receipt"] = receipt
	fullLog["date"] = date

	fmt.Println("Successful Transaction Log:", fullLog)
	log.Println("Successful Transaction Log:", fullLog)
	wsBroadcast <- map[string]interface{}{
		"event":   "success",
		"orderId": orderID,
		"status":  "Payment successful",
		"details": fullLog,
	}

	// Emit success event on socket here if implemented

	c.JSON(http.StatusOK, gin.H{"success": true})
}


