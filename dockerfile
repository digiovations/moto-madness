# Use Node.js LTS base image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install

# Copy server and client code into the container
COPY server ./server
COPY client ./client

# Expose port (Azure will pass the correct PORT env var; default to 2567)
EXPOSE 2567

CMD ["node", "server/index.js"]
