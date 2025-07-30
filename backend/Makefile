BINARY_NAME=app

.PHONY: run

run:
	go mod tidy
	go fmt ./...
	go vet ./...
	go test ./...
	go build -o $(BINARY_NAME) .
	./$(BINARY_NAME)

