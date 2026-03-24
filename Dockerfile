# Stage 1: Build the Vite app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration as a template so envsubst runs on it
COPY nginx.conf /etc/nginx/templates/default.conf.template

# EXPOSE $PORT locally, but on Railway this dynamically exposes the Railway port
EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
