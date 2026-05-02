# SeekSmart API v1

The API lives under:

```text
/api/v1
```

This versioned contract is intended for both the web app and future mobile apps.

## Response Shape

Successful responses:

```json
{
  "ok": true,
  "data": {}
}
```

Error responses:

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Submission input is invalid.",
    "details": {}
  }
}
```

## Endpoints

### Health

```http
GET /api/v1/health
```

### List Tools

```http
GET /api/v1/tools
```

Query params:

- `q`
- `category`
- `pricing`
- `page`
- `limit`

Example:

```http
GET /api/v1/tools?q=writing&pricing=FREEMIUM
```

Response includes `tools` and a `pagination` object.

### Get Tool

```http
GET /api/v1/tools/:slug
```

### List Categories

```http
GET /api/v1/categories
```

### Submit Tool

```http
POST /api/v1/submissions
```

Request body:

```json
{
  "toolName": "Example AI",
  "websiteUrl": "https://example.com",
  "description": "A concise but useful description of the tool.",
  "category": "Writing",
  "pricingType": "FREEMIUM",
  "submitterEmail": "person@example.com"
}
```

## Mobile App Principle

Mobile apps should consume `/api/v1` only. They should not depend on database details, Prisma models, or web-only page structures.
