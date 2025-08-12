package handlers

import (
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetTestCases(c *gin.Context) {

	queryID := c.Query("problem_id")

	if queryID == "" {
		log.Println("Error: problem id is empty")
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Must include problem id"})
		return
	}

	rows, err := h.DB.Query("SELECT id, input_json, expected_output_json, problem_id FROM test_cases WHERE problem_id = $1", queryID)
	if err != nil {
		log.Println("DB Query error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error while querying": err.Error()})
		return
	}
	defer rows.Close()

	test_cases := []models.TestCase{}

	for rows.Next() {

		if err := rows.Err(); err != nil {
			log.Println("DB Query error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"Error while iterating rows": err.Error()})
			return
		}

		var p models.TestCase
		var input json.RawMessage
		var output json.RawMessage

		if err := rows.Scan(&p.Id, &input, &output, &p.ProblemId); err != nil {
			log.Println("DB Iteration:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"Error while scanning rows": err.Error()})
			return
		}

		p.Input = input
		p.Output = output

		test_cases = append(test_cases, p)
	}

	c.JSON(http.StatusOK, gin.H{"test_cases": test_cases})
}
