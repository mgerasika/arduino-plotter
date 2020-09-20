FROM node:11.15.0 as builder

FROM nginx:latest
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
COPY /heroku-website /var/www/dist