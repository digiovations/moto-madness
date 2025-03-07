FROM node:14

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 2567
CMD ["node", "server/index.js"]
