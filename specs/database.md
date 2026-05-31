# Database — WonMedia CMS

## Connection

- **Type**: MongoDB 8.x
- **URI**: `mongodb://localhost:27017/wonmedia` (local Docker)
- **Env var**: `MONGODB_URI` trong `.env.local`

### Docker command (khởi động MongoDB)
```bash
docker run -d -p 27017:27017 --name wonmedia-mongo --restart unless-stopped mongo:8
```

### Khởi động lại nếu container dừng
```bash
docker start wonmedia-mongo
```

## Collections

### `users`

| Field | Type | Required | Unique | Default |
|-------|------|----------|--------|---------|
| `name` | String | ✅ | | |
| `email` | String | ✅ | ✅ | |
| `password` | String (bcrypt) | ✅ | | |
| `role` | `superadmin` \| `admin` \| `user` | | | `user` |
| `createdAt` | Date | | | auto |
| `updatedAt` | Date | | | auto |

## Connection Pooling

File: `lib/mongodb.ts`

Sử dụng global cached connection để tránh tạo nhiều connection trong Next.js dev hot-reload.

## Indexes

MongoDB tự tạo index trên `_id`. Index duy nhất (unique) trên `email` được định nghĩa trong UserSchema.
