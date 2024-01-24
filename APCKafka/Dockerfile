# build stage
FROM node:lts-alpine 

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 4000

CMD ["node","producer.js"]
