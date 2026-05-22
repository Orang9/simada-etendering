# SIMADA e-Tendering System

Sistem Informasi Manajemen Pengadaan Daerah (SIMADA) berbasis **e-Tendering** yang dibangun menggunakan **Laravel** untuk backend API dan **React + TailwindCSS** untuk frontend dashboard.

Project ini dibuat sebagai prototype sistem pengadaan elektronik pemerintah daerah yang mendukung proses tender mulai dari pengelolaan paket pengadaan hingga penetapan pemenang tender.

---

# Features

## Authentication & Authorization

- Login multi-role
- Role-based access control
- Protected frontend routes
- Session/token authentication

![Login Page](./screenshots/login-page.png)

## Procurement Management

- Manajemen Paket Pengadaan
- Manajemen Dokumen Tender
- Status Paket (`open` / `close`)

<img src="./screenshots/login-page.png" width="800"/>

## Vendor Bidding

- Penyedia dapat melihat tender terbuka
- Submit penawaran tender
- Riwayat penawaran penyedia

## Bid Evaluation

- Evaluasi penawaran
- Penilaian teknis & harga
- Status evaluasi:
  - Evaluasi
  - Lolos
  - Tidak Lolos

## Winner Selection

- Penetapan pemenang tender
- Otomatis menutup paket pengadaan setelah pemenang ditentukan

## Dashboard & Reporting

- Dashboard analytics berdasarkan role
- Laporan:
  - Paket Pengadaan
  - Penawaran
  - Evaluasi
  - Pemenang Tender
- Export PDF
- Export Excel
- Grafik analytics

---

# Technology Stack

## Backend

- Laravel
- MySQL
- REST API

## Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Router DOM
- Recharts
- jsPDF
- xlsx

---

# System Roles

| Role       | Access                         |
| ---------- | ------------------------------ |
| Admin      | Full system access             |
| Pokja      | Tender management & evaluation |
| Penyedia   | Submit penawaran               |
| Masyarakat | Public information access      |

---

# Main Workflow

```text
Paket Pengadaan
→ Dokumen Tender
→ Penawaran Penyedia
→ Evaluasi Penawaran
→ Penetapan Pemenang
→ Laporan & Dashboard
```

---

# Backend Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

## 2. Masuk ke Folder Backend

```bash
cd backend
```

## 3. Install Dependency

```bash
composer install
```

## 4. Copy Environment File

```bash
cp .env.example .env
```

## 5. Generate Application Key

```bash
php artisan key:generate
```

## 6. Configure Database

Edit file `.env`

```env
DB_DATABASE=simada_etendering
DB_USERNAME=root
DB_PASSWORD=
```

## 7. Run Migration & Seeder

```bash
php artisan migrate:fresh --seed
```

## 8. Run Backend Server

```bash
php artisan serve
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

# Frontend Installation

## 1. Masuk ke Folder Frontend

```bash
cd frontend
```

## 2. Install Dependency

```bash
npm install
```

## 3. Run Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Seeder Accounts

| Role       | Email                  | Password |
| ---------- | ---------------------- | -------- |
| Admin      | admin@example.com      | password |
| Pokja      | pokja@example.com      | password |
| Penyedia   | penyedia1@example.com  | password |
| Masyarakat | masyarakat@example.com | password |

---

# API Overview

## Authentication

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /api/login  |
| POST   | /api/logout |

---

## Paket Pengadaan

| Method | Endpoint                        |
| ------ | ------------------------------- |
| GET    | /api/paket-pengadaan            |
| POST   | /api/admin/paket-pengadaan      |
| PUT    | /api/admin/paket-pengadaan/{id} |
| DELETE | /api/admin/paket-pengadaan/{id} |

---

## Dokumen Tender

| Method | Endpoint                                |
| ------ | --------------------------------------- |
| GET    | /api/paket-pengadaan/{id}/dokumen       |
| POST   | /api/admin/paket-pengadaan/{id}/dokumen |
| DELETE | /api/admin/dokumen/{id}                 |

---

## Penawaran

| Method | Endpoint                                   |
| ------ | ------------------------------------------ |
| GET    | /api/penawaran                             |
| POST   | /api/vendor/paket-pengadaan/{id}/penawaran |

---

## Evaluasi

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/evaluasi            |
| POST   | /api/admin/evaluasi      |
| PUT    | /api/admin/evaluasi/{id} |

---

## Pemenang Tender

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/pemenang-tender       |
| POST   | /api/admin/pemenang-tender |

---

## Reporting

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | /api/laporan/paket     |
| GET    | /api/laporan/penawaran |
| GET    | /api/laporan/evaluasi  |
| GET    | /api/laporan/pemenang  |

---

# Frontend Structure

```text
src/
├── api/
├── assets/
├── components/
├── context/
├── layouts/
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── pokja/
│   ├── public/
│   └── vendor/
├── routes/
├── utils/
├── App.jsx
└── main.jsx
```

---

# Project Structure

```text
backend/
frontend/
```

---

# Final Checklist

- [x] Authentication
- [x] Role-based Access
- [x] Paket Pengadaan Management
- [x] Dokumen Tender Management
- [x] Penawaran Penyedia
- [x] Evaluasi Penawaran
- [x] Penetapan Pemenang
- [x] Dashboard Analytics
- [x] Reporting
- [x] Export PDF
- [x] Export Excel
- [x] Responsive UI

---

# Authors

Kelompok 1

- Egbert Felica Wibianto
- Mohammad Faalih
- Nur Alika Pandoyo Putri
- Yurfa Apridelia

SIMADA e-Tendering System  
Developed for academic/project purposes.
