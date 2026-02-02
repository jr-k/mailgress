.PHONY: build dev dev-down logs clean test generate

COMPOSE_FILE := docker/docker-compose.dev.yml

# Build production Docker image
build:
	docker build -f docker/Dockerfile -t mailgress .

# Start production environment in background
restart:
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up --build -d

# Start development environment
dev:
	docker compose -f $(COMPOSE_FILE) up --build

# Start development environment in background
dev-d:
	docker compose -f $(COMPOSE_FILE) up --build -d

# Stop development environment
dev-down:
	docker compose -f $(COMPOSE_FILE) down

# View logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

# View app logs only
logs-app:
	docker compose -f $(COMPOSE_FILE) logs -f app

# View assets logs only
logs-assets:
	docker compose -f $(COMPOSE_FILE) logs -f assets

# Run tests in container
test:
	docker compose -f $(COMPOSE_FILE) run --rm app go test -v ./...

# Generate sqlc code in container
generate:
	docker compose -f $(COMPOSE_FILE) run --rm app sqlc generate

# Clean up
clean:
	docker compose -f $(COMPOSE_FILE) down -v --rmi local
	rm -rf web/dist/

# Rebuild containers
rebuild:
	docker compose -f $(COMPOSE_FILE) build --no-cache
