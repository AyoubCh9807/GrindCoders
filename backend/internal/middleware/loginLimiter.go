package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	limiter "github.com/ulule/limiter/v3"
	memory "github.com/ulule/limiter/v3/drivers/store/memory"
)

func LimitLoginMiddleware() gin.HandlerFunc {
	rate, err := limiter.NewRateFromFormatted("10-H")
	if err != nil {
		panic(err)
	}

	store := memory.NewStore()
	lim := limiter.New(store, rate)

	return func(c *gin.Context) {

		key := c.ClientIP()
		limitCtx, err := lim.Get(c, key)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Rate limiter error"})
			c.Abort()
			return
		}

		if limitCtx.Reached {
			resetTime := time.Unix(limitCtx.Reset, 0)
			retryAfter := int(time.Until(resetTime).Seconds())
			if retryAfter < 1 {
				retryAfter = 1
			}
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":         "locked",
				"retry_seconds": int(retryAfter) + 1,
			})
			c.Abort()
			return
		}

		c.Next()

	}
}
