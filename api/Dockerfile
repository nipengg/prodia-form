FROM node:18-alpine

# Tentukan folder kerja di dalam container
WORKDIR /app

# Hanya salin package.json dulu (biar build lebih cepat kalau kode berubah)
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua sisa kode (termasuk app.js)
COPY . .

# Buka port 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "dev"]