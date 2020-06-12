# Dockerfile that is typically called with something like docker build -t earthquakinator . && docker run -e PORT=8080 --publish 80:8080 earthquakinator

#Start with a node image.
FROM node:12.16.3

# Set the working directory.
WORKDIR /usr/src/app

# Copy our code over as well. Note: this implicitly copies over package.json.
COPY . .

# Get our packages installed.
RUN npm install

EXPOSE 80

# Start it up!
CMD npm start
