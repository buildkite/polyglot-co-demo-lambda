FROM node:6

RUN curl -Lf -o /usr/bin/apex https://github.com/apex/apex/releases/download/v0.10.2/apex_linux_amd64 \
    && chmod +x /usr/bin/apex

WORKDIR /app

ADD package.json /app/package.json
ADD functions/fetchWeather/package.json /app/functions/fetchWeather/package.json

RUN npm install
RUN for dir in functions/*; do cd "$dir" && npm install && cd ..; done

ADD . /app

CMD ["npm", "run", "test"]
