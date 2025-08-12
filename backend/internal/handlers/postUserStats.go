package handlers

import (
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) PostUserStats(c *gin.Context) {

	var userStats models.ExposedUserStats
	user_ID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "user ID not found"})
		c.Abort()
		return
	}
	user_ID_int, ok := user_ID.(int)

	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Could not retreive user ID"})
		c.Abort()
		return
	}

	if user_ID_int < 1 {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "user id not found within context"})
		c.Abort()
		return
	}
	var JSONsolved_problems []byte
	err := h.DB.QueryRow("SELECT total_submissions, correct_submissions, problems_solved, points FROM user_stats WHERE user_id = $1", user_ID_int).Scan(&userStats.Total_submissions, &userStats.Correct_submissions, &JSONsolved_problems, &userStats.Points)
	if err != nil {
		log.Println("DB error: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"DB Query Error": err.Error(),
			"user_id":        user_ID_int,
		})
		c.Abort()
		return
	}

	newerr := json.Unmarshal(JSONsolved_problems, &userStats.Problems_solved)
	if newerr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": newerr.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"Success": "User stats acquired", "user_stats": userStats})

}
