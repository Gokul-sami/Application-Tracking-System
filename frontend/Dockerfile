# Use Node 22 (latest supported by Vite)
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]
