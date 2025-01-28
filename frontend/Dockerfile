# Use Node.js as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Copy the rest of the frontend code
COPY . /app/

# Build the React application for production
RUN npm run build

# Use serve to host the built React app
RUN npm install -g serve

# Expose the React port
EXPOSE 3006

# Serve the React app on port 3006
CMD ["serve", "-s", "build", "-l", "3006"]
