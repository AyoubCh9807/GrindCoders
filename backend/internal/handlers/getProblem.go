package handlers

import (
	"backend/internal/models"
	"backend/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetProblem(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, title, difficulty, created_at, description, topic, companies, "boilerplate_PY", "boilerplate_JS", "boilerplate_CPP" FROM problems`)
	if err != nil {
		log.Println("DB Query error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error while querying": err.Error()})
		return
	}
	defer rows.Close()

	problems := []models.Problem{}

	for rows.Next() {

		if err := rows.Err(); err != nil {
			log.Println("DB Query error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"Error while iterating rows": err.Error()})
			return
		}

		var p models.UnformattedProblem

		if err := rows.Scan(&p.Id, &p.Title, &p.Difficulty, &p.CreatedAt, &p.Description, &p.Topic, &p.Companies, &p.Boilerplate_PY, &p.Boilerplate_JS, &p.Boilerplate_CPP); err != nil {
			log.Println("DB Iteration:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"Error while scanning rows": err.Error()})
			return
		}

		problems = append(problems, models.Problem{
			Id:              p.Id,
			Title:           p.Title,
			Difficulty:      p.Difficulty,
			CreatedAt:       utils.FormatTime(p.CreatedAt),
			Description:     p.Description,
			Topic:           p.Topic,
			Companies:       p.Companies,
			Boilerplate_PY:  p.Boilerplate_PY,
			Boilerplate_JS:  p.Boilerplate_JS,
			Boilerplate_CPP: p.Boilerplate_CPP,
		})
	}
	c.JSON(http.StatusOK, gin.H{"problems": problems})
}
