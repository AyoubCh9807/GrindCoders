package handlers

import (
	"backend/internal/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetUsers(c *gin.Context) {
	rows, err := h.DB.Query("SELECT * FROM users")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}
	defer rows.Close()

	users := []models.ExposedUser{}

	for rows.Next() {
		var u models.UnformattedUser
		if err := rows.Scan(&u.Id, &u.Username, &u.Password, &u.CreatedAt); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
			return
		}

		users = append(users, models.ExposedUser{
			Id:        u.Id,
			Username:  u.Username,
			CreatedAt: utils.FormatTime(u.CreatedAt),
		})

	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
