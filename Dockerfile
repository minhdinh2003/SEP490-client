# Build stage
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --verbose

# Copy the rest of the application code
COPY . .

RUN rm -rf .next

# Build the Next.js application
RUN npm run build --verbose

# Production stage
FROM node:alpine AS production

# Set the working directory
WORKDIR /app

# Copy built application from the build stage
COPY --from=build /app ./

# Install production dependencies only
RUN npm install --production --legacy-peer-deps --verbose

# Expose the port on which the app will run
EXPOSE 80

# Start the Next.js application
CMD ["npm", "start"]
