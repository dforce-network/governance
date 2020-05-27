FROM node:10 AS build-env

# Set up dependencies
ENV PACKAGES make git libc-dev bash gcc linux-headers eudev-dev

# Set working directory for the build
WORKDIR /work/src

# Add source files
COPY . .

# Install minimum necessary dependencies, build Cosmos SDK, remove packages
#RUN npm i umi -g && npm i --registry=https://registry.npm.taobao.org && \
#  npm run build

RUN yarn config set registry https://registry.npm.taobao.org/ && \
  yarn && \
  yarn build

# Final image
FROM nginx:1.16-alpine


RUN echo -e 'server {\n\
    listen       80;\n\
    server_name  localhost;\n\
\n\
    #charset koi8-r;\n\
    #access_log  /var/log/nginx/host.access.log  main;\n\
    root   /usr/share/nginx/html;\n\
\n\
    location / {\n\
        index  index.html index.htm;\n\
        try_files $uri /index.html;\n\
    }\n\
    location /en {\n\
        alias /usr/share/nginx/html;\n\
        index index_en.html;\n\
        try_files $uri /index_en.html;\n\
    }\n\
    #error_page  404              /404.html;\n\
\n\
    location ~ \.(gif|jpg|png|js|css)$ {\n\
       error_page 404 /index.html; \n\
    }\n\
\n\
    location /assets {\n\
       error_page 404 /index.html; \n\
    }\n\
\n\
    location /static {\n\
       error_page 404 /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Copy over binaries from the build-env
COPY --from=build-env /work/src/dist/ /usr/share/nginx/html/
