# Optimized Dockerfile for AegisAI Backend
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install ONLY production dependencies for high performance
RUN npm ci --only=production --omit=dev

# Copy the server source code
COPY server.mjs ./
COPY .env ./

# Expose the internal AegisAI service port
EXPOSE 3001

# Start the AWS-native AI engine
CMD ["node", "server.mjs"]
