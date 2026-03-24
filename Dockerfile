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

# Force Nginx to run only 2 workers instead of 'auto' (which spawns 100+ on Railway's large nodes causing OOM/Restarts)
RUN sed -i 's/worker_processes.*/worker_processes 2;/g' /etc/nginx/nginx.conf

# EXPOSE is not required on Railway; Railway automatically routes to $PORT
# EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]
