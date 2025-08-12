package main

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var db_USERS *sql.DB
var db_PROBLEMS *sql.DB

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("Error: no ENV file found")
	}

	DB_USERS_URL := os.Getenv("DB_USERS_URL")
	DB_PROBLEMS_URL := os.Getenv("DB_PROBLEMS_URL")

	// DB_PROBLEMS_URL = "postgresql://postgres.kckcwpvqtjpvslzjepqs:5U90HIjwHresUv38@aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require"
	// DB_PROBLEMS_URL = "postgresql://postgres.kckcwpvqtjpvslzjepqs:5U90HIjwHresUv38@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"

	if DB_USERS_URL == "" || DB_PROBLEMS_URL == "" {
		log.Println("Error: empty database url")
	}
	var err error
	db_USERS, err = sql.Open("pgx", DB_USERS_URL)

	if err != nil {
		log.Println("Error: " + err.Error())
	}

	db_PROBLEMS, err = sql.Open("pgx", DB_PROBLEMS_URL)

	if err != nil {
		log.Println("Error: " + err.Error())
	}

	h_USERS := handlers.NewHandler(db_USERS)
	h_PROBLEMS := handlers.NewHandler(db_PROBLEMS)

	if err := db_USERS.Ping(); err != nil {
		log.Println("Error: " + err.Error())
	}

	defer db_USERS.Close()

	if err := db_PROBLEMS.Ping(); err != nil {
		log.Println("Error: " + err.Error())
	}

	defer db_PROBLEMS.Close()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           time.Hour * 72,
	}))
	r.Use()
	api := r.Group("/api")

	// Rate limiters for unauthenticated routes
	registerLimiter := api.Group("/")
	registerLimiter.Use(middleware.LimitRegisterMiddleware())
	registerLimiter.POST("/register", h_USERS.Register)

	loginLimiter := api.Group("/")
	loginLimiter.Use(middleware.LimitLoginMiddleware())
	loginLimiter.POST("/login", h_USERS.Login)

	// Limiter for retreiving problems
	noauthLimiter := api.Group("/")
	noauthLimiter.Use(middleware.LimitReqMiddleware())
	noauthLimiter.GET("/problems", h_PROBLEMS.GetProblem)

	// Protected routes - JWT + rate limiter
	protected := api.Group("/")
	protected.Use(middleware.LimitReqMiddleware())
	protected.Use(middleware.JwtAuthMiddleware())
	//GET handlers
	protected.GET("/test_cases", h_PROBLEMS.GetTestCases)
	protected.GET("/get_solved_problems", h_USERS.GetSolvedProblems)
	protected.GET("/get_leaderboard_top_xp", h_USERS.GetLeaderboardTopXP)
	protected.GET("/get_leaderboard_top_solved", h_USERS.GetLeaderboardTopSolved)
	protected.GET("/get_leaderboard_you", h_USERS.GetLeaderboardYou)
	//POST handlers
	protected.POST("/user_stats", h_USERS.PostUserStats)
	protected.POST("/increment_subs", h_USERS.IncrementSubs)
	protected.POST("/increment_correct_subs", h_USERS.IncrementCorrectSubmissions)
	protected.POST("/add_to_problems_solved", h_USERS.PostToProblemsSolved)
	protected.POST("/increment_points", h_USERS.IncrementPoints)

	if err := r.Run(":8080"); err != nil {
		log.Println("Error: " + err.Error())
	}

}

// use :
// docker run --rm -v ${PWD}:/app -w /app python-runner  main.py
// to run container (you should be in >backend/services/codeExec/python)
