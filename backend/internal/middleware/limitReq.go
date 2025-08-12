package middleware

import (
	"github.com/gin-gonic/gin"

	limiter "github.com/ulule/limiter/v3"
	ginmiddleware "github.com/ulule/limiter/v3/drivers/middleware/gin"
	memory "github.com/ulule/limiter/v3/drivers/store/memory"
)

func LimitReqMiddleware() gin.HandlerFunc {
	rate, err := limiter.NewRateFromFormatted("45-M")
	if err != nil {
		panic(err)
	}

	store := memory.NewStore()
	lim := limiter.New(store, rate)

	return ginmiddleware.NewMiddleware(lim)
}
