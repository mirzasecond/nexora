# NEXORA Setup Guide

## ✅ Sebelum Mulai

Pastikan sudah install:
- Node.js 20+
- Docker
- Git

## 🚀 Quick Start (3 langkah)

### 1️⃣ Start Database
```bash
docker-compose up -d
```
Tunggu sampai PostgreSQL healthy (~30 detik)

### 2️⃣ Start Backend (Terminal 1)
```bash
cd server
npm install
npm run dev
```
Tunggu muncul: `🎮 NEXORA Server listening at http://0.0.0.0:3001`

### 3️⃣ Start Frontend (Terminal 2, folder baru)
```bash
cd client
npm install
npm run dev
```
Kunjungi: `http://localhost:5173`

---

## 🔧 Troubleshooting

### Error: `net::ERR_CONNECTION_REFUSED`

**Solusi:**

1. **Cek database running:**
```bash
docker ps | grep postgres
```
Jika tidak ada, jalankan:
```bash
docker-compose up -d
```

2. **Cek backend running:**
```bash
curl http://localhost:3001/
```
Harusnya return: `{"message":"NEXORA Server","status":"online"}`

Jika error, rebuild dan restart:
```bash
cd server
npm run build
npm run dev
```

3. **Cek API URL di client:**
File: `client/.env.local`
```
VITE_API_URL=http://localhost:3001
```

4. **Clear cache & restart:**
```bash
# Client
rm -rf client/node_modules client/dist
npm install
npm run dev

# Server
rm -rf server/dist
npm run build
npm run dev
```

### Error: Database connection failed

**Solusi:**

1. Hapus container lama:
```bash
docker-compose down -v
```

2. Start fresh:
```bash
docker-compose up -d
```

3. Tunggu healthy (check dengan):
```bash
docker logs nexora-postgres-1
```
Cari: `"message":"database system is ready to accept connections"`

---

## 📝 .env Files

### Root: `.env`
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgres://nexora:nexora_dev_password@localhost:5432/nexora
JWT_SECRET=nexora_dev_secret_key_min_32_chars_long_enough
```

### Client: `client/.env.local`
```
VITE_API_URL=http://localhost:3001
```

---

## ✅ Test Game

1. Register: Username, email, password
2. Login
3. Tekan WASD untuk jalan
4. Klik enemy untuk attack
5. Lihat XP naik di HUD

---

## 🆘 Jika Masih Error

Share output dari:
```bash
docker ps
curl http://localhost:3001/
```

