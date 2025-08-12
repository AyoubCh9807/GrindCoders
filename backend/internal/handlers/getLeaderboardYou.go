package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetLeaderboardYou(c *gin.Context) {

	var data []Cell

	user_ID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not find user ID"})
		c.Abort()
		return
	}

	user_ID_int, ok := user_ID.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user ID cannot be a non-int value"})
		c.Abort()
		return
	}

	if user_ID_int < 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "invalid ID"})
		c.Abort()
		return
	}

	query := `
	WITH myscore AS (
		SELECT jsonb_array_length(problems_solved) AS solved
		FROM user_stats
		WHERE user_id = $1
	)
	SELECT
	u.username,
	us.problems_solved,
	us.points
	FROM user_stats us
	JOIN users u ON us.user_id = u.id, myscore
	WHERE jsonb_array_length(us.problems_solved)
	BETWEEN myscore.solved - 99 AND myscore.solved + 100 
	ORDER BY jsonb_array_length(us.problems_solved) DESC
	LIMIT 200
	`

	rows, err := h.DB.Query(query, user_ID_int)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	for rows.Next() {
		var cell Cell
		var jsonData []byte
		err := rows.Scan(&cell.Username, &jsonData, &cell.Points)
		if err != nil {
			log.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		if err := json.Unmarshal(jsonData, &cell.Problems_solved); err != nil {
			log.Println(err.Error())

			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		data = append(data, cell)
	}
	log.Println("Decoded problems_solved:", data)
	c.JSON(http.StatusOK, gin.H{
		"success": "retreived leaderboard data",
		"data":    data,
	})

}
