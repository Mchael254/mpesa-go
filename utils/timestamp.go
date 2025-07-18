package utils

import (
	"fmt"
	"time"
)

// parseDate pads single-digit numbers with a leading zero (like your TS parseDate)
func parseDate(val int) string {
	if val < 10 {
		return fmt.Sprintf("0%d", val)
	}
	return fmt.Sprintf("%d", val)
}

// GetTimeStamp with time zone set to Africa/Nairobi 
func GetTimeStamp() string {
	loc, err := time.LoadLocation("Africa/Nairobi")
	if err != nil {
		loc = time.UTC // fallback
	}
	now := time.Now().In(loc)

	year := now.Year()
	month := parseDate(int(now.Month()))
	day := parseDate(now.Day())
	hour := parseDate(now.Hour())
	minute := parseDate(now.Minute())
	second := parseDate(now.Second())

	return fmt.Sprintf("%d%s%s%s%s%s", year, month, day, hour, minute, second)
}

// PaymentStatus represents the data sent on payment status events
type PaymentStatus struct {
	OrderID string
	Message string
	Phone   string
	Amount  string
	Receipt string
	Date    string
}

// Emitter interface abstracts an event emitter or socket interface
type Emitter interface {
	Emit(event string, data interface{}) error
}

// EmitPaymentStatus emits payment status updates using the provided Emitter interface
func EmitPaymentStatus(emitter Emitter, status string, data PaymentStatus) error {
	payload := map[string]interface{}{
		"status": status,
		"orderId": data.OrderID,
	}

	if data.Message != "" {
		payload["message"] = data.Message
	}
	if data.Phone != "" {
		payload["phone"] = data.Phone
	}
	if data.Amount != "" {
		payload["amount"] = data.Amount
	}
	if data.Receipt != "" {
		payload["receipt"] = data.Receipt
	}
	if data.Date != "" {
		payload["date"] = data.Date
	}

	fmt.Printf("Emitting payment status: %s %+v\n", status, data)

	return emitter.Emit("payment_status", payload)
}
