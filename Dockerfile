FROM node:16
WORKDIR /code
COPY . /code
RUN apt-get install imagemagick 
RUN cd server && npm install && cd ../web && npm install
CMD sh start.sh