package handlers

import (
	"backend/internal/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) Login(c *gin.Context) {
	var creds models.LoginCreds

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid format"})
		return
	}

	var storedHash string
	var userID int
	err := h.DB.QueryRow("SELECT id, password FROM users WHERE username = $1", creds.Username).Scan(&userID, &storedHash)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid credentials"})
		return
	}

	if !utils.CheckPassword(creds.Password, storedHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid password"})
		return
	}

	token, err := utils.GenToken(creds.Username, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "Failed to generate token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})

}
