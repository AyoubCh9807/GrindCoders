package models

type LeaderboardCell struct {
	Username       string `json:"username"`
	Points         string `json:"points"`
	ProblemsSolved string `json:"problems_solved"`
	TotalSubs      string `json:"total_submissions"`
}
