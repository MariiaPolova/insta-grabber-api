# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your API runs on
EXPOSE 3001

# Set environment variables (optional, can also be passed at runtime)
ENV NODE_ENV=production

# Command to run your application
CMD ["npm", "start"]