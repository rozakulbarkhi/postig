# Postig

Postig adalah aplikasi web yang digunakan untuk memposting foto dan mengabadikan momen-momen indahmu. Aplikasi ini sangat mudah untuk digunakan, memiliki tampilan yang sederhana, dan _user friendly_.

## Fitur

- Posting foto dengan caption dan #tags
- Like pada postingan
- Mencari postingan berdasarkan #tags atau caption
- Pagination pada halaman feed
- Edit profil
- Update password

## Instalasi

1. Clone repository ini
2. Install dependencies dengan menjalankan perintah `npm install`
3. Buat file `.env` dan isi dengan konfigurasi yang dibutuhkan
4. Jalankan perintah `npm run dev` untuk menjalankan aplikasi

## Konfigurasi

Konfigurasi `.env` yang dibutuhkan adalah sebagai berikut:

```
VITE_APP_BASE_URL=http://localhost:3000
```

Jalankan API terlebih dahulu sebelum menjalankan aplikasi ini:
[Link API](https://github.com/rozakulbarkhi/api-postig)

## Penggunaan

Sample login user:

```json
{
  "username": "user",
  "password": "password"
}
```

| Route        | Description                       |
| ------------ | --------------------------------- |
| `/login`     | Menampilkan halaman login         |
| `/register`  | Menampilkan halaman register      |
| `/dashboard` | Menampilkan halaman feed          |
| `/user`      | Menampilkan halaman profile       |
| `/setting`   | Menampilkan halaman edit password |
| `/post`      | Menampilkan halaman post user     |
