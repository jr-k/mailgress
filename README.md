# Mailgress

Receive emails on your own server and forward them wherever you need.

## What it does

**Receive**: Host your own email inbox on any domain or subdomain.

**Filter**: Create rules to sort emails by sender, subject, attachments, or size.

**Forward**: Send matching emails to your apps via webhooks.

**Manage**: Browse, search, and read your emails from a clean web interface.

## Key features

- Unlimited mailboxes on your domains
- Plus-addressing support (inbox+tag@domain.com)
- Webhook notifications with custom filters
- Signed payloads for secure integrations
- Attachment support
- Automatic retention policies
- Multi-user with role management
- Two-factor authentication

## Use cases

- Receive transactional emails in your app
- Parse incoming invoices or receipts
- Build a shared team inbox
- Automate email-triggered workflows
- Archive emails for compliance

## Getting started

Configure your DNS to point to your server, then run Mailgress with Docker.

### Docker run

```bash
docker run -d \
  --name mailgress \
  -p 8080:8080 \
  -p 2525:2525 \
  -v mailgress_data:/app/data \
  -e APP_URL=https://mailgress.example.com \
  -e WEBHOOK_SECRET=your-secret-key \
  jierka/mailgress:latest
```

### Docker Compose

```yaml
services:
  mailgress:
    image: jierka/mailgress:latest
    container_name: mailgress
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "2525:2525"
    volumes:
      - mailgress_data:/app/data
    environment:
      - APP_URL=https://mailgress.example.com
      - WEBHOOK_SECRET=your-secret-key

volumes:
  mailgress_data:
```

### Ports

- **8080**: Web interface
- **2525**: SMTP server (map to 25 if needed with `-p 25:2525`)

## License

See [LICENSE.md](LICENSE.md) file
[License](LICENSE.md)