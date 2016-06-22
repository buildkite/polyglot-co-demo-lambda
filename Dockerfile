FROM node:6

WORKDIR /src

ADD package.json /src/package.json
ADD functions/fetchWeather/package.json /src/functions/fetchWeather/package.json

RUN npm install
RUN for dir in functions/*; do cd "$dir" && npm install && cd ..; done

ADD . /src

CMD ["npm", "run", "test"]
