FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run knex:migrate
RUN npm run knex:seed
EXPOSE 3000
CMD ["npm", "start"]