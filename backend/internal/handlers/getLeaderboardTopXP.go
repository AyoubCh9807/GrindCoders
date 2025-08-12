package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Cell struct {
	Username        string `json:"username"`
	Points          int    `json:"points"`
	Problems_solved []int  `json:"problems_solved"`
}

func (h *Handler) GetLeaderboardTopXP(c *gin.Context) {

	var data []Cell

	query := `
	SELECT
	u.username,
	us.problems_solved,
	us.points
	FROM user_stats us
	JOIN users u ON us.user_id = u.id
	ORDER BY us.points DESC
	LIMIT 200
	`

	rows, err := h.DB.Query(query)
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
