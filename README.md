# Mailgress

A self-hostable email management application that receives emails via SMTP, stores them, and triggers webhooks based on configurable rules.

## Features

- **SMTP Server**: Built-in SMTP server to receive emails directly
- **Plus-addressing**: Support for `mailbox+tag@domain.com` format
- **Webhook Integration**: Configurable webhooks with rules and HMAC signatures
- **Multi-tenant**: Admin can create mailboxes and assign owners
- **Modern UI**: React-based interface with split-view inbox

## Quick Start

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/jr-k/mailgress.git
cd mailgress

# Copy and edit environment variables
cp .env.example .env

# Start with PostgreSQL
docker-compose -f docker-compose.yml up -d

# Access the web UI
open http://localhost:8080
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `changeme`

### Using SQLite (Development)

```bash
# Build the application
go build -o mailgress ./cmd/mailgress

# Build frontend
cd web && npm install && npm run build && cd ..

# Run with SQLite
./mailgress
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost:8080` | Public URL of the application |
| `APP_ENV` | `development` | Environment (development/production) |
| `APP_KEY` | - | Secret key for encryption (32 chars) |
| `ADMIN_EMAIL` | `admin@example.com` | Admin email (created on first start) |
| `ADMIN_PASSWORD` | `changeme` | Admin password |
| `SMTP_LISTEN_ADDR` | `:2525` | SMTP server listen address |
| `HTTP_LISTEN_ADDR` | `:8080` | HTTP server listen address |
| `DB_DRIVER` | `sqlite` | Database driver (sqlite/postgres) |
| `DB_DSN` | `mailgress.db` | Database connection string |
| `STORAGE_PATH` | `./data/attachments` | Path for storing attachments |
| `MAX_EMAIL_SIZE_MB` | `25` | Maximum email size in MB |
| `MAX_ATTACHMENT_SIZE_MB` | `10` | Maximum attachment size in MB |
| `RETENTION_DAYS` | `90` | Days to keep emails (0 = forever) |
| `WEBHOOK_MAX_RETRIES` | `3` | Maximum webhook retry attempts |
| `WEBHOOK_TIMEOUT_SEC` | `30` | Webhook request timeout in seconds |

## DNS Configuration

To receive emails, configure your DNS records. Below are examples for a main domain and a subdomain.

### Example 1: Main Domain (kapside.com)

```dns
; Zone file for kapside.com
mail            IN  A     X.X.X.X
kapside.com.    IN  MX 10 mail.kapside.com.
kapside.com.    IN  TXT   "v=spf1 mx ~all"
_dmarc.kapside.com. IN TXT "v=DMARC1; p=none; rua=mailto:dmarc@kapside.com; adkim=s; aspf=s"
```

This configuration allows receiving emails at `*@kapside.com`.

### Example 2: Subdomain (hr.kapside.com)

```dns
; Zone file for kapside.com (subdomain entries)
mail.hr         IN  A     X.X.X.X
hr              IN  MX 10 mail.hr.kapside.com.
hr              IN  TXT   "v=spf1 mx ~all"
_dmarc.hr       IN  TXT   "v=DMARC1; p=none; rua=mailto:dmarc-hr@kapside.com; adkim=s; aspf=s"
```

This configuration allows receiving emails at `*@hr.kapside.com`.

### Notes

- Replace `X.X.X.X` with your server's public IP address
- Ensure port 25 (or your configured SMTP port) is accessible
- SPF and DMARC records help with email deliverability and spam prevention

## Webhook Payload

```json
{
  "event": "email.received",
  "timestamp": "2024-01-30T12:00:00Z",
  "email": {
    "id": 123,
    "mailbox_id": 1,
    "message_id": "<abc@example.com>",
    "from": "sender@example.com",
    "to": "mailbox@mail.example.com",
    "subject": "Hello World",
    "date": "2024-01-30T11:59:00Z",
    "received_at": "2024-01-30T12:00:00Z",
    "size": 1024,
    "text_body": "Email content...",
    "html_body": "<p>Email content...</p>",
    "headers": {
      "Content-Type": "text/plain"
    },
    "attachments": [
      {
        "id": 1,
        "filename": "document.pdf",
        "content_type": "application/pdf",
        "size": 12345
      }
    ]
  }
}
```

## Webhook Signature

When an HMAC secret is configured, the webhook includes a signature header:

```
X-Mailgress-Signature: t=1706616000,v1=abc123...
```

Verification (pseudocode):
```
timestamp = extract t from header
signature = extract v1 from header
expected = HMAC-SHA256(secret, timestamp + "." + payload)
valid = constant_time_compare(signature, expected) && timestamp is recent
```

## Webhook Rules

Rules support the following conditions:

| Field | Operators | Example |
|-------|-----------|---------|
| `subject` | contains, not_contains, equals, regex | "Invoice" |
| `from` | contains, not_contains, equals, regex | "@company.com" |
| `to` | contains, not_contains, equals, regex | "support+" |
| `has_attachments` | equals | "true" |
| `size` | gt, lt | "1000000" (bytes) |

Rules within the same group are AND'd. Different groups are OR'd.

## Development

```bash
# Install dependencies
go mod download
cd web && npm install && cd ..

# Generate sqlc code
sqlc generate

# Run development server
go run ./cmd/mailgress

# Build frontend (watch mode)
cd web && npm run dev
```

## Testing

```bash
# Run Go tests
go test -v ./...

# Send a test email
echo "Test email body" | swaks --to test@mail.example.com --from sender@example.com --server localhost:2525
```

## License

MIT
