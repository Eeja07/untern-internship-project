# 🌐 Untern Internship Project

Aplikasi **manajemen magang** berbasis web dengan arsitektur **MERN-like stack** (React di frontend dan Node.js + Express di backend dengan MySQL).  
Proyek ini mendukung pendaftaran mahasiswa & perusahaan, unggah dokumen, posting internship, dan melamar magang secara online.

---

## 📑 Daftar Isi
- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [API Endpoints](#-api-endpoints)
- [Dokumentasi Tambahan](#-dokumentasi-tambahan)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur
### 👨‍🎓 Mahasiswa
- Registrasi, login, dan verifikasi akun
- Kelola profil, upload foto profil
- Upload resume & daftar skills
- Apply internship dan cek status aplikasi

### 🏢 Perusahaan
- Registrasi & login akun perusahaan
- Kelola profil perusahaan & upload logo
- Posting internship baru
- Lihat daftar aplikasi mahasiswa

### 🔐 Autentikasi & Keamanan
- JWT (JSON Web Token) untuk login
- Verifikasi email & nomor HP
- Proteksi route dengan middleware

### 📄 Upload File
- Resume mahasiswa
- Logo perusahaan
- Foto profil user
- Dokumen internship

---

## 🛠 Teknologi
| Bagian     | Teknologi Utama |
|------------|-----------------|
| Frontend   | React 18, Vite, React Router, Redux Toolkit, Axios, Recharts, Lucide React |
| Backend    | Node.js, Express.js, Multer |
| Database   | MySQL |
| Autentikasi| JWT, middleware custom |
| Build Tool | Vite, ESLint |

---

## 📂 Struktur Proyek
```
untern-internship-project/
├── client/           # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── assets/            # gambar & ikon
│   │   └── components/        # komponen halaman (auth, dashboard, dll)
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── server/           # Backend (Node.js + Express + MySQL)
    ├── server.js
    ├── config/
    │   └── database.js
    ├── middleware/
    │   └── auth.js
    ├── routes/
    │   ├── auth.js
    │   ├── studentProfile.js
    │   ├── studentApplications.js
    │   ├── studentResume.js
    │   ├── studentSkills.js
    │   ├── studentPhoneVerification.js
    │   ├── companyProfile.js
    │   ├── companyInternships.js
    │   ├── companyApplications.js
    │   └── emailVerification.js
    ├── uploads/
    │   ├── logos/
    │   ├── profile-pictures/
    │   ├── resumes/
    │   └── internship-documents/
    ├── response.js
    ├── queryDB.txt
    ├── package.json
    └── package-lock.json
```

---

## ⚡ Instalasi
### 1. Clone repository
```bash
git clone https://github.com/Eeja07/untern-internship-project.git
cd untern-internship-project
```

### 2. Setup Backend
```bash
cd server
npm install
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

---

## 🔑 Konfigurasi
Buat file `.env` di folder `server/`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=untern_db
JWT_SECRET=your_secret_key
```

---

## ▶️ Menjalankan Aplikasi
### Backend
```bash
cd server
npm start
```
Akan berjalan di `http://localhost:5000`

### Frontend
```bash
cd client
npm run dev
```
Akan berjalan di `http://localhost:5173`

---

## 📡 API Endpoints (Ringkas)

### Auth
- `POST /api/auth/register` → Registrasi user
- `POST /api/auth/login` → Login (JWT)
- `POST /api/auth/verify-email` → Verifikasi email
- `POST /api/auth/verify-phone` → Verifikasi nomor HP

### Student
- `GET /api/student/profile`
- `PUT /api/student/profile`
- `POST /api/student/resume`
- `POST /api/student/skills`
- `GET /api/student/applications`
- `POST /api/student/applications`

### Company
- `GET /api/company/profile`
- `PUT /api/company/profile`
- `POST /api/company/internships`
- `GET /api/company/internships`
- `GET /api/company/applications`

### Upload
- Resume → `/uploads/resumes/`
- Logo → `/uploads/logos/`
- Foto profil → `/uploads/profile-pictures/`
- Dokumen internship → `/uploads/internship-documents/`

---

## 📖 Dokumentasi Tambahan
- `queryDB.txt` → berisi catatan query SQL & struktur tabel
- `response.js` → format standar JSON response
- `uploads/` → folder penyimpanan file
- `eslint.config.js` → aturan linting frontend

---

## 👥 Kontribusi
1. Fork repository
2. Buat branch `feature/nama-fitur`
3. Commit perubahan
4. Push branch
5. Ajukan Pull Request

---

## 📜 Lisensi
MIT License © 2025
