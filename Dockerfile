FROM node:6

WORKDIR /src

ADD package.json /src/package.json
ADD functions/fetchWeather/package.json /src/functions/fetchWeather/package.json

RUN npm install \
	&& cd functions/fetchWeather \
	&& npm install

ADD . /src

CMD ["npm", "run", "test"]
