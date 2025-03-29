FROM node:22-alpine AS build

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Install bash
RUN apk add --no-cache bash

# Copy the built files from the build stage to Nginx's serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Make sure nginx directory exists
RUN mkdir -p /etc/nginx/conf.d

# Copy a custom nginx configuration that serves the SPA correctly
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/prod/nginx.conf /etc/nginx/conf.d/

# Create a health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


