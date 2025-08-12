package models

import (
	"time"
)

type UnformattedProblem struct {
	Id              int       `json:"id"`
	Title           string    `json:"title"`
	Difficulty      string    `json:"difficulty"`
	CreatedAt       time.Time `json:"created_at"`
	Description     string    `json:"description"`
	Topic           string    `json:"topic"`
	Companies       string    `json:"companies"`
	Boilerplate_PY  string    `json:"boilerplate_PY"`
	Boilerplate_JS  string    `json:"boilerplate_JS"`
	Boilerplate_CPP string    `json:"boilerplate_CPP"`
}
