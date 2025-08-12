package models

type UserStats struct {
	User_id             int   `json:"user_id"`
	Total_submissions   int   `json:"total_submissions"`
	Correct_submissions int   `json:"correct_submissions"`
	Problems_solved     []int `json:"problems_solved"`
	Points              int   `json:"points"`
}
