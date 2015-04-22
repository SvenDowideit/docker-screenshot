FROM ubermuda/phantomjs

ADD https://raw.githubusercontent.com/ariya/phantomjs/master/examples/rasterize.js /rasterize.js

VOLUME ["/srv"]
WORKDIR /srv

ENTRYPOINT ["/phantomjs/bin/phantomjs", "--ignore-ssl-errors=yes", "--ssl-protocol=tlsv1", "/rasterize.js"]
