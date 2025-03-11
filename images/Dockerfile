FROM node:lts
# Set working directory
WORKDIR /app

# install node modules
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

EXPOSE 88
ENTRYPOINT ["npm", "start"]