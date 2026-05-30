FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

WORKDIR /app/backend
RUN npm install

EXPOSE 10000

CMD ["npm", "start"]
