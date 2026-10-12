
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV DB_PATH=/app/data/taskmate.db

EXPOSE 5000

CMD ["node", "server.js"]
