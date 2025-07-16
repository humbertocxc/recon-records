FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist

COPY package*.json ./
RUN npm install --production --frozen-lockfile

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
