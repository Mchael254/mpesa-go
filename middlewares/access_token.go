package middlewares

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type SafaricomTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   string `json:"expires_in"`
}

func AccessTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		url := "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
		key := os.Getenv("SAFARICOM_CONSUMER_KEY")
		secret := os.Getenv("SAFARICOM_CONSUMER_SECRET")
		
		if key == "" || secret == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Missing consumer key or secret"})
			c.Abort()
			return
		}

		auth := base64.StdEncoding.EncodeToString([]byte(key + ":" + secret))
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to create request", "error": err.Error()})
			c.Abort()
			return
		}
		req.Header.Set("Authorization", "Basic "+auth)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to connect to Safaricom API", "error": err.Error()})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to read response body", "error": err.Error()})
			c.Abort()
			return
		}

		if resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message":  "Failed to get access token",
				"status":   resp.Status,
				"response": string(bodyBytes),
			})
			c.Abort()
			return
		}

		var tokenResp SafaricomTokenResponse
		if err := json.Unmarshal(bodyBytes, &tokenResp); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Failed to parse access token",
				"error":   err.Error(),
				"response": string(bodyBytes),
			})
			c.Abort()
			return
		}

		if tokenResp.AccessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Empty access token received",
				"response": string(bodyBytes),
			})
			c.Abort()
			return
		}

		c.Set("safaricom_access_token", tokenResp.AccessToken)
		c.Next()
	}
}