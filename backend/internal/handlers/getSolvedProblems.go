package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSolvedProblems(c *gin.Context) {
	user_ID, exists := c.Get("id")
	if !exists {
		log.Println("error bud: ", "not exists")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user ID not found"})
		c.Abort()
		return
	}
	user_ID_int, ok := user_ID.(int)
	if !ok {
		log.Println("error bud: ", "not ok")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user ID cannot be a non-int value"})
		c.Abort()
		return
	}

	if user_ID_int < 1 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user ID"})
		c.Abort()
		return
	}

	var jsonData []byte
	query := "SELECT problems_solved from user_stats WHERE user_id = $1"

	err := h.DB.QueryRow(query, user_ID_int).Scan(&jsonData)
	if err != nil {
		log.Println("error bud: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	var solved_problems []int
	if err := json.Unmarshal(jsonData, &solved_problems); err != nil {
		log.Println("error bud: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "retreived solved problems", "solved_problems": solved_problems})
}
