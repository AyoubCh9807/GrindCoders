package middleware

import (
	"backend/utils"
	"net/http"
	"strings"

	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = utils.GetToken()

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		jwtSecret = []byte(os.Getenv("JWT_SECRET"))
		if len(jwtSecret) == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"Error": "Invalid secret token"})
			c.Abort()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusBadRequest, gin.H{"Error": "Headers must include authorization"})
			c.Abort()
			return
		}

		parts := strings.Fields(authHeader)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid Format"})
			c.Abort()
			return
		}

		tokenStr := parts[1]

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenMalformed
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid claims"})
			c.Abort()
			return
		}

		idClaims, exists := claims["id"]
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "User ID missing in token"})
			c.Abort()
			return
		}
		var userID int
		switch v := idClaims.(type) {
		case float64:
			userID = int(v)
		case string:
			parsedID, err := strconv.Atoi(v)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid user ID format in token"})
				c.Abort()
				return
			}
			userID = parsedID
		default:
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid user ID type in token"})
			c.Abort()
			return
		}

		c.Set("username", claims["username"])
		c.Set("id", userID)
		c.Next()

	}
}
