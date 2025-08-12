package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PointsStruct struct {
	Points int `json:"points"`
}

func (h *Handler) IncrementPoints(c *gin.Context) {
	var body PointsStruct
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Println("error: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot increment points with a non-int value"})
		c.Abort()
		return
	}
	if body.Points < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot increment points with a negative value"})
		c.Abort()
		return
	}
	user_ID, exists := c.Get("id")
	if !exists {
		log.Println("error: ", "couldnt find user id")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find user ID"})
		c.Abort()
		return
	}
	user_ID_int, ok := user_ID.(int)
	if !ok {
		log.Println("error: ", "user id not int")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user ID must be int"})
		c.Abort()
		return
	}
	query := "UPDATE user_stats SET points = points + $1 WHERE user_id = $2"
	_, err := h.DB.Exec(query, body.Points, user_ID_int)
	if err != nil {
		log.Println("error: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": "points incremented successfully"})
}
