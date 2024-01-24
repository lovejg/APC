# build stage
FROM node:lts-alpine 

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3006

CMD ["node","index.js"]
