# Use Bun official image
FROM oven/bun:1.1.20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lock ./

# Install dependencies
RUN bun install

# Copy all source files
COPY . .

# Expose the port your Bun server uses
EXPOSE 5000

# Run your TypeScript server
CMD ["bun", "run", "server.ts"]
