FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive
ENV PHANTOM_JS_VERSION 1.9.8-linux-x86_64

RUN apt-get update
RUN apt-get install -y curl bzip2 libfreetype6 libfontconfig

RUN curl -sSL https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOM_JS_VERSION.tar.bz2 | tar xjC /
RUN ln -s phantomjs-$PHANTOM_JS_VERSION /phantomjs

ADD https://raw.githubusercontent.com/ariya/phantomjs/master/examples/rasterize.js /rasterize.js
ADD bind-polyfill.js /bind-polyfill.js

RUN cat /bind-polyfill.js /rasterize.js > /bind-rasterize.js

VOLUME ["/srv"]
WORKDIR /srv

ENTRYPOINT ["/phantomjs/bin/phantomjs", "--ignore-ssl-errors=yes", "--ssl-protocol=tlsv1", "/bind-rasterize.js"]
