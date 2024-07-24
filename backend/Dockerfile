# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port that the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "run", "dev"]
