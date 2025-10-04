FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client and netcat for health check
RUN apk add --no-cache postgresql-client netcat-openbsd

COPY package*.json ./

RUN npm install

# Copy entrypoint script first and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy the rest of the application
COPY . .

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["npm", "run", "dev"]
