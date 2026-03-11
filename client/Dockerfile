FROM node:18-alpine

WORKDIR /app

# Copy package.json dan install
COPY package*.json ./
RUN npm install

# Copy sisa kodingan frontend
COPY . .

EXPOSE 5173

# Vite butuh --host biar bisa dibuka dari browser laptop lo
CMD ["npm", "run", "dev", "--", "--host"]