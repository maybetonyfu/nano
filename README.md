# Sponex Market API

## Run server
```bash
go run bin/server/main.go
```

## Required Environment Variables
If you are testing the gpt package, an OpenAI api key is required. There are several ways to include the variable
### Directly through command line
```bash
OPENAI_API_KEY=abc123 go run bin/server/main.go
```