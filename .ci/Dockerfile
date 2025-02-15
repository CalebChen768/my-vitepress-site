FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ../.vitepress/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
