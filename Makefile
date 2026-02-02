.PHONY: dev dev-d dev-down dev-rebuild prod prod-d prod-down \
        logs logs-app logs-assets build clean test generate \
        install-tools local local-go local-assets

# ============================================
# Development Commands (Docker)
# ============================================

# Start development environment (Go with Air + Vite HMR)
dev:
	docker compose up --build

# Start development in background
dev-d:
	docker compose up --build -d

# Stop development environment
dev-down:
	docker compose down

# Rebuild dev containers (no cache)
dev-rebuild:
	docker compose build --no-cache
	docker compose up

# View all logs
logs:
	docker compose logs -f

# View Go app logs only
logs-app:
	docker compose logs -f app

# View Vite/assets logs only
logs-assets:
	docker compose logs -f assets

# ============================================
# Production Commands (Docker)
# ============================================

# Build production image
build:
	docker build -t mailgress .

# Start production environment
prod:
	docker compose -f docker-compose.prod.yml up --build

# Start production in background
prod-d:
	docker compose -f docker-compose.prod.yml up --build -d

# Stop production environment
prod-down:
	docker compose -f docker-compose.prod.yml down

# Restart production (rebuild)
prod-restart:
	docker compose -f docker-compose.prod.yml down
	docker compose -f docker-compose.prod.yml up --build -d

# ============================================
# Local Development (without Docker)
# ============================================

# Install development tools locally
install-tools:
	go install github.com/air-verse/air@latest
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	cd web && npm install

# Run both Go (Air) and Vite concurrently
local:
	@echo "Starting Go backend with Air and Vite dev server..."
	@command -v concurrently >/dev/null 2>&1 || { echo "Installing concurrently..."; npm install -g concurrently; }
	concurrently --names "GO,VITE" --prefix-colors "green,blue" \
		"air -c .air.toml" \
		"cd web && npm run dev"

# Run Go backend with Air only
local-go:
	APP_ENV=development air -c .air.toml

# Run Vite dev server only
local-assets:
	cd web && npm run dev

# ============================================
# Utility Commands
# ============================================

# Run tests in container
test:
	docker compose run --rm app go test -v ./...

# Run tests locally
test-local:
	go test -v ./...

# Generate sqlc code in container
generate:
	docker compose run --rm app sqlc generate

# Generate sqlc code locally
generate-local:
	sqlc generate

# Build frontend assets for production
build-assets:
	cd web && npm run build

# Clean up everything
clean:
	docker compose down -v --rmi local
	docker compose -f docker-compose.prod.yml down -v --rmi local 2>/dev/null || true
	rm -rf web/dist/ tmp/

# Shell into running app container
shell:
	docker compose exec app sh

# Shell into running assets container
shell-assets:
	docker compose exec assets sh
