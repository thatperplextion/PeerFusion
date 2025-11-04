FROM node:18-slim

# Install Postgres client to allow health checks/wait scripts
RUN apt-get update && apt-get install -y postgresql-client curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Make wait script executable
RUN chmod +x ./wait-for-db.sh || true

EXPOSE 5050

CMD ["sh", "-c", "./wait-for-db.sh && npm run dev"]
