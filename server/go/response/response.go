package response

import (
	"encoding/json"
	"net/http"
)

type Wrapper struct {
	Data  interface{} `json:"data"`
	Error *string     `json:"error"`
}

func Wrap(data interface{}) Wrapper {
	return Wrapper{Data: data, Error: nil}
}

func Send(w http.ResponseWriter, statusCode int, data interface{}, errMsg string) {
	var errPtr *string
	if errMsg != "" {
		errPtr = &errMsg
	}

	response := Wrapper{
		Data:  data,
		Error: errPtr,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
