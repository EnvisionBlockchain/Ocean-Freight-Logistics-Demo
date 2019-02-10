# Base Image
FROM ubuntu:18.04
# LABEL maintainer="vutsalsinghal@gmail.com"

# Update and upgrade and install node
RUN apt-get -yqq update
#RUN apt-get -yqq upgrade
RUN apt-get -yqq install build-essential curl gnupg git gcc
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -yq nodejs

# copy our application code
ADD frontend /opt/frontend
WORKDIR /opt/frontend

# fetch app specific dependencies
RUN npm install
RUN npm run build

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start"]
