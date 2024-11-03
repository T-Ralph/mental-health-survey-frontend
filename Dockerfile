# Stage 1: Build the Angular app
FROM node:16 AS build-stage

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine AS production-stage

# Copy the built Angular app from the build stage to the Nginx html directory
COPY --from=build-stage /app/dist/mental-health-survey-frontend /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
