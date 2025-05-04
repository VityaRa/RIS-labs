package response

import (
	"encoding/json"
	"net/http"
)

type Wrapper struct {
	Data interface{} `json:"data"`
}

func Wrap(data interface{}) Wrapper {
	return Wrapper{Data: data}
}

func Send(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(Wrap(data))
}