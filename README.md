### GET /api/users/register

**Deskripsi:**
Membuat user.

**Query Parameters:**
- `name` (string, wajib)
- `email` (string, wajib)
- `password` (string, wajib)

**Response:**
- Status: 200 OK
- Body:
  json
  {
    "_id": "67a1872aa465ae4ed2393e81",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTE4NzJhYTQ2NWFlNGVkMjM5M2U4MiIsImlhdCI6MTczODYzOTE0NiwiZXhwIjoxNzQxMjMxMTQ2fQ.sUVoapSFdsnjQxyNIFNuQiUOdS_xD0caksdIcCQoA2a"
  }

**Error:**
- 400 Bad Request: Email sudah terdaftar
- 500 Internal Server Error: Terjadi kesalahan server.


---

### **Langkah Uji Coba**
1. **Endpoint Baru**
   - Pastikan endpoint dapat diakses dengan JWT valid.
   - Uji dengan berbagai kombinasi tanggal dan rentang waktu.

2. **Validasi Data**
   - Uji kasus dengan input tidak valid (misalnya: tanggal kosong, format tidak valid, dll.).

### POST /api/users/login

**Deskripsi:**
Autentikasi pengguna dan menghasilkan token akses.

**Headers:**
- Content-Type: application/json

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
- **Status: 200 OK**
- **Body:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**Error:**
- **400 Bad Request:** Email atau password tidak boleh kosong.
- **401 Unauthorized:** Kredensial tidak valid.
- **500 Internal Server Error:** Terjadi kesalahan pada server.

---

### **Langkah Uji Coba**
1. **Login Berhasil**
   - Gunakan email dan password yang valid.
   - Pastikan mendapatkan token akses.

2. **Login Gagal**
   - Coba login dengan email atau password yang salah.
   - Pastikan mendapatkan respons dengan status 401.

3. **Validasi Data**
   - Uji kasus dengan input tidak valid (misalnya: email kosong, password kosong, format email tidak valid).



### GET /api/finances

**Deskripsi:**
Mengambil daftar semua data keuangan.

**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 200 OK
- Body:
  ```json
  [
    {
      "id": 1,
      "category": "Income",
      "amount": 5000,
      "date": "2025-01-01"
    },
    {
      "id": 2,
      "category": "Expense",
      "amount": 2000,
      "date": "2025-01-02"
    }
  ]
  ```

**Error:**
- 401 Unauthorized: Token tidak valid.
- 500 Internal Server Error: Terjadi kesalahan server.

---

### POST /api/finances

**Deskripsi:**
Menambahkan data keuangan baru.

**Headers:**
- Authorization: Bearer {token}

**Body:**
```json
{
  "category": "Income",
  "amount": 7000,
  "date": "2025-01-10"
}
```

**Response:**
- Status: 201 Created
- Body:
  ```json
  {
    "message": "Finance data created successfully",
    "data": {
      "id": 3,
      "category": "Income",
      "amount": 7000,
      "date": "2025-01-10"
    }
  }
  ```

**Error:**
- 400 Bad Request: Data tidak valid.
- 401 Unauthorized: Token tidak valid.
- 500 Internal Server Error: Terjadi kesalahan server.

---

### GET /api/finances/report

**Deskripsi:**
Menghasilkan laporan keuangan berdasarkan periode tertentu.

**Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- `startDate` (string, wajib): Tanggal mulai dalam format ISO (YYYY-MM-DD).
- `endDate` (string, wajib): Tanggal akhir dalam format ISO (YYYY-MM-DD).

**Response:**
- Status: 200 OK
- Body:
  ```json
  {
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "totalIncome": 5000,
    "totalExpense": 3000,
    "balance": 2000
  }
  ```

**Error:**
- 400 Bad Request: Format tanggal tidak valid atau tanggal mulai > tanggal akhir.
- 500 Internal Server Error: Terjadi kesalahan server.


### GET /api/finances/category-stats

**Deskripsi:**
Mendapatkan statistik keuangan berdasarkan kategori.

**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 200 OK
- Body:
  ```json
  {
    "Income": 12000,
    "Expense": 8000,
    "Savings": 4000
  }
  ```

**Error:**
- 401 Unauthorized: Token tidak valid.
- 500 Internal Server Error: Terjadi kesalahan server.

---

### GET /api/finances/monthly-stats

**Deskripsi:**
Mendapatkan statistik keuangan bulanan.

**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 200 OK
- Body:
  ```json
  {
    "January": {
      "totalIncome": 10000,
      "totalExpense": 5000,
      "balance": 5000
    },
    "February": {
      "totalIncome": 8000,
      "totalExpense": 3000,
      "balance": 5000
    }
  }
  ```

**Error:**
- 401 Unauthorized: Token tidak valid.
- 500 Internal Server Error: Terjadi kesalahan server.



### GET /api/finances/report-by-period

**Deskripsi:**
Menghasilkan laporan keuangan berdasarkan periode tertentu.

**Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- `startDate` (string, wajib): Tanggal mulai dalam format ISO (YYYY-MM-DD).
- `endDate` (string, wajib): Tanggal akhir dalam format ISO (YYYY-MM-DD).

**Response:**
- Status: 200 OK
- Body:
  json
  {
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "totalIncome": 5000,
    "totalExpense": 3000,
    "balance": 2000
  }

**Error:**
- 400 Bad Request: Format tanggal tidak valid atau tanggal mulai > tanggal akhir.
- 500 Internal Server Error: Terjadi kesalahan server.


---

### **Langkah Uji Coba**
1. **Endpoint Baru**
   - Pastikan endpoint dapat diakses dengan JWT valid.
   - Uji dengan berbagai kombinasi tanggal dan rentang waktu.

2. **Validasi Data**
   - Uji kasus dengan input tidak valid (misalnya: tanggal kosong, format tidak valid, dll.).
