FROM node:latest
WORKDIR /project-api/

#Adding relevant folders to image
ADD dist /project-api/dist
ADD node_modules /project-api/dist/node_modules

WORKDIR /project-api/dist

CMD ["node", "server.js"]

MAINTAINER me@boubaks.com