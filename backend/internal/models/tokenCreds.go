package models

type TokenCreds struct {
	Password string `json:"password"`
	Username string `json:"username"`
	Id       int    `json:"id"`
}
