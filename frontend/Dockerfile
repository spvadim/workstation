# set the base image
# n/b: for production, node is only used for building 
# the static Html and javascript files
# as react creates static html and js files after build
# these are what will be served by nginx
# use alias build to be easier to refer this container elsewhere
# e.g inside nginx container
FROM node:14.17.1-alpine3.13 AS build
# set working directory
# this is the working folder in the container
# from which the app will be running from
WORKDIR /app
# copy everything to /app directory
# as opposed to on dev, in prod everything is copied to docker
COPY package.json package-lock.json /app/
RUN npm install
COPY ./ /app
RUN npm run build

FROM nginx:alpine
# copy the build folder from react to the root of nginx (www)
COPY --from=build /app/build /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router 
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d/
# --------- /only for those using react router ----------

# move keypair and snippets for https correct working
COPY nginx/snippets/ /etc/nginx/snippets/
COPY nginx/ssl/dhparam.pem /etc/nginx/dhparam.pem
COPY nginx/ssl/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY nginx/ssl/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt

# expose ports 80 (http), 443 (https) to the outer world
EXPOSE 80
EXPOSE 443

# start nginx 
CMD ["nginx", "-g", "daemon off;"]
