package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IncrementSubs(c *gin.Context) {
	user_ID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "User id not found"})
		c.Abort()
		return
	}

	user_ID_int, ok := (user_ID).(int)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid user id format"})
	}

	query := "UPDATE user_stats SET total_submissions = total_submissions + 1 WHERE user_id = $1"

	if _, err := h.DB.Exec(query, user_ID_int); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"Success": "Incremented total submissions"})

}
