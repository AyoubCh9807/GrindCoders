package handlers

import (
	"backend/internal/models"
	"backend/utils"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func (h *Handler) Register(c *gin.Context) {
	var user models.LoginCreds

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid user format"})
		c.Abort()
		return
	}
	log.Println("succeeded json binding")

	hashed, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		log.Println("Error: " + err.Error())
		c.Abort()
		return
	}

	log.Println("succeeded hashing")

	var usernameExists bool
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", user.Username).Scan(&usernameExists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "DB error"})
		log.Println("Error: " + err.Error())
		c.Abort()
		return
	}
	log.Println("succeded username exist check")

	if usernameExists {
		c.JSON(http.StatusConflict, gin.H{"Error": "Username already taken"})
		c.Abort()
		return
	}
	log.Println("succeeded with unique username")

	var userID int

	err = h.DB.QueryRow(
		"INSERT INTO users (username, password) VALUES ($1, $2) returning id",
		user.Username, hashed,
	).Scan(&userID)

	log.Println("succeeded inserting data")

	if err != nil {
		log.Printf("Failed to insert user_stats for userID %d: %v\n", userID, err)

		c.JSON(http.StatusInternalServerError, gin.H{"Error": "Could not add user: " + err.Error()})

		c.Abort()
		return
	}

	log.Println("succeeded adding user")

	problemsSolved, _ := json.Marshal([]int{0})

	_, err = h.DB.Exec(
		`INSERT INTO user_stats 
	 (user_id, total_submissions, correct_submissions, problems_solved, points) 
	 VALUES ($1, $2, $3, $4::jsonb, $5)`,
		userID, 0, 0, problemsSolved, 0,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		c.Abort()
		return
	}
	log.Println("succeeded adding user stats to user")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get jwt secret from .env"})
		c.Abort()
		return
	}

	token, err := utils.GenToken(user.Username, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{"Success": "user created", "token": token})

}
