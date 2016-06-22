FROM node:6

WORKDIR /src

RUN curl -Lf -o /usr/bin/apex https://github.com/apex/apex/releases/download/v0.10.2/apex_linux_amd64 \
    && chmod +x /usr/bin/apex

ADD package.json /src/package.json
ADD functions/fetchWeather/package.json /src/functions/fetchWeather/package.json

RUN npm install
RUN for dir in functions/*; do cd "$dir" && npm install && cd ..; done

ADD . /src

CMD ["npm", "run", "test"]
