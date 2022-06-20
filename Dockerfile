FROM node:16
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm start dev
EXPOSE 4000