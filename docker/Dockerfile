# ============================================
# Stage 1: Node.js base for frontend assets
# ============================================
FROM node:20-alpine AS node-base

WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci

COPY web/ ./

# ============================================
# Stage 2: Build frontend assets (production)
# ============================================
FROM node-base AS assets-builder

RUN npm run build

# ============================================
# Stage 3: Development asset watcher
# ============================================
FROM node-base AS assets-dev

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Stage 4: Go builder
# ============================================
FROM golang:1.24-alpine AS go-builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=assets-builder /app/web/dist ./web/dist

RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -o mailgress ./cmd/mailgress

# ============================================
# Stage 5: Final production image
# ============================================
FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=go-builder /app/mailgress .
COPY --from=assets-builder /app/web/dist ./web/dist

RUN mkdir -p /app/data

EXPOSE 8080 2525

ENV APP_ENV=production \
    HTTP_LISTEN_ADDR=:8080 \
    SMTP_LISTEN_ADDR=:2525 \
    DB_DRIVER=sqlite \
    DB_DSN=/app/data/mailgress.db \
    STORAGE_PATH=/app/data/attachments

CMD ["./mailgress"]
