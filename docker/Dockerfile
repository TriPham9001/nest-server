###################
# BASE IMAGE
###################

FROM node:18-alpine As base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 g++ make

###################
# DEVELOPMENT
###################

FROM base As development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

###################
# BUILD
###################

FROM base As build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

###################
# PRODUCTION
###################

FROM base As production
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY docker/nginx/nginx.conf /etc/nginx/http.d/default.conf

RUN npm install --global pm2

EXPOSE 80

# Start the server using the production build
CMD ["pm2-runtime", "dist/main.js"]

