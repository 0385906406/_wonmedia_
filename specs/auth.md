# Auth System — WonMedia CMS

## Roles

| Role | Quyền |
|------|-------|
| `superadmin` | Toàn quyền hệ thống |
| `admin` | Quản lý nội dung, user thường |
| `user` | Xem, tương tác cơ bản |

## Super Admin mặc định

| Field | Giá trị |
|-------|---------|
| Email | `admin@wonmedia.com` |
| Password | `Admin@123456` |
| Role | `superadmin` |

> **Lưu ý bảo mật:** Đổi password ngay sau lần đăng nhập đầu tiên.

## API Endpoints

### POST /api/auth/login
Request:
```json
{ "email": "string", "password": "string" }
```
Response (200):
```json
{ "success": true, "user": { "id", "name", "email", "role" } }
```
Set cookie: `token` (HttpOnly, SameSite=Lax, 7 days)

### POST /api/auth/register
Request:
```json
{ "name": "string", "email": "string", "password": "string" }
```
Response (201):
```json
{ "message": "Registered successfully", "userId": "..." }
```

### POST /api/auth/logout
Response (200): Xóa cookie `token`

## JWT

- Algorithm: HS256
- Expiry: 7 ngày
- Payload: `{ id, email, role }`
- Secret: `JWT_SECRET` env var

## Proxy (middleware)

File: `proxy.ts` (root)

- Admin routes (`/admin/*`): Require valid JWT → redirect `/auth/login` nếu không có
- Auth routes (`/auth/*`): Redirect `/admin` nếu đã đăng nhập
- Client routes: Detect locale → redirect `/${locale}/...`

## Seed Script

```bash
npx tsx scripts/seed-superadmin.ts
```

Tạo super admin nếu chưa tồn tại (idempotent).
