package models

import (
	"encoding/json"
)

type TestCase struct {
	Id        int             `json:"id"`
	Input     json.RawMessage `json:"input"`
	Output    json.RawMessage `json:"output"`
	ProblemId int             `json:"problem_id"`
}
