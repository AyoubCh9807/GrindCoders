package utils

import (
	"log"
	"time"

	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret []byte

func HashPassword(pass string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error while hashing: " + err.Error())
		return "", err
	}
	return string(hash), nil
}

func CheckPassword(pass, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass))
	return err == nil
}

func FormatTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loding .ENV file")
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("Error: missing JWT_SECRET in .env")
	}
	jwtSecret = []byte(secret)
}

func GenToken(username string, id int) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"id":       id,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func GetToken() []byte {
	return jwtSecret
}
