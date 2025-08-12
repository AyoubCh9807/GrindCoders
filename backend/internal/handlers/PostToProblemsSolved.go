package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReqBody struct {
	Problem_ID int `json:"problem_ID"`
}

func (h *Handler) PostToProblemsSolved(c *gin.Context) {
	var req ReqBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Could not find the problem ID"})
		return
	}

	user_ID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Could not find user ID"})
		return
	}

	user_ID_int, ok := user_ID.(int)
	if !ok || user_ID_int < 1 {
		c.JSON(http.StatusForbidden, gin.H{"Error": "Invalid user ID"})
		return
	}

	query := "SELECT problems_solved FROM user_stats WHERE user_id = $1"

	var solvedJson []byte
	err := h.DB.QueryRow(query, user_ID_int).Scan(&solvedJson)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"DB Error": err.Error()})
		return
	}

	var solvedProblems []int
	if len(solvedJson) > 0 {
		if err := json.Unmarshal(solvedJson, &solvedProblems); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"Error": "Failed to parse solved problems JSON"})
			return
		}
	}

	problem_ID := req.Problem_ID
	if problem_ID < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid problem ID"})
		return
	}

	for _, solved := range solvedProblems {
		if solved == problem_ID {
			c.JSON(http.StatusOK, gin.H{"Message": "Problem already marked as solved"})
			return
		}
	}

	solvedProblems = append(solvedProblems, problem_ID)

	updatedJson, err := json.Marshal(solvedProblems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "Failed to encode solved problems"})
		return
	}

	postQuery := "UPDATE user_stats SET problems_solved = $1 WHERE user_id = $2"

	_, err = h.DB.Exec(postQuery, updatedJson, user_ID_int)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"DB Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Success": "Solved problems updated"})
}
