package models

type ExposedProblem struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Difficulty  string `json:"difficulty"`
	Topic       string `json:"topic"`
	Companies   string `json:"companies"`
}
