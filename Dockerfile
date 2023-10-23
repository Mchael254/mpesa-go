# Stage 1: Build the Angular application
FROM node:18.16.1-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy only necessary files for building
COPY angular.json ./
COPY tsconfig.json ./
COPY src ./src
# COPY e2e ./e2e
COPY tsconfig.*.json ./
# COPY tslint.json ./
COPY webpack.config.js ./

COPY setup-jest.ts ./
COPY proxy.conf.json ./

# Build the Angular application for production
RUN npm run buildn --prod


# # Stage 2: Generate Compodoc documentation
# FROM node:18.16.1-alpine AS compodoc-builder

# # Use a build argument to invalidate the cache
ARG CACHEBUST=1

# WORKDIR /app

# Copy package.json and package-lock.json for Compodoc dependencies
# COPY package*.json ./
# RUN npm install -g @compodoc/compodoc

# Copy only necessary files for Compodoc generation
# COPY src ./src
# COPY tsconfig.json ./
# COPY tsconfig.*.json ./

# Generate Compodoc documentation
# RUN npm run docs


# Stage 3: Create a lightweight Nginx image
FROM nginx:mainline-alpine3.18-slim

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app and Compodoc documentation from previous stages
COPY --from=builder /app/dist/turnquestv6-fe/ /usr/share/nginx/html/V6/
# COPY --from=compodoc-builder /app/documentation /usr/share/nginx/html/documentation

# Expose port 80 to the outside world
EXPOSE 80

# Start the Nginx web server
CMD ["nginx", "-g", "daemon off;"]
