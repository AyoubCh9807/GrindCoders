package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IncrementCorrectSubmissions(c *gin.Context) {
	user_ID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "user id not found"})
		c.Abort()
		return
	}
	user_ID_int, ok := user_ID.(int)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid user id format"})
		c.Abort()
		return
	}
	query := "UPDATE user_stats SET correct_submissions = correct_submissions + 1 WHERE user_id = $1"
	if _, err := h.DB.Exec(query, user_ID_int); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"Success": "Incremented correct submissions"})

}
