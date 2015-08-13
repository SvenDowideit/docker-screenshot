A web screenshot container based on [phantomjs](http://phantomjs.org/)'s [rasterize.js](https://raw.githubusercontent.com/ariya/phantomjs/master/examples/rasterize.js).

Based on the work of [ubermuda](https://github.com/ubermuda/docker-screenshot).

## Usage

Because phantomjs runs inside the container, you need to bind mount a volume to retrieve the screenshot.

The container is configured to write screenshots to `/srv`, so bind-mounting `$PWD` (or whatever directory you want to screenshot created in) to it seems like a good idea.

    $ docker run ubermuda/screenshot
    Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]
    paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"
    image (png/jpg output) examples: "1920px" entire page, window width 1920px
                                    "800px*600px" window, clipped to 800x600

    $ docker run -v $PWD:/srv ubermuda/screenshot http://www.google.com/ google.com.png 1920px

## Authentication

This container now supports both Basic (browser) auth and simple HTML forms auth.
To use it, add `--env-file=password.env` to your `docker run` statement, and set
the (line based) environment variables for the authentication you need:

```
# Basic Auth settings
# BASICUSER=
# BASICPASS=

# HTML auth settings
LOGINURL=https://hub.docker.com/account/login
LOGINFORM=form-login
USERINPUT=id_username
PASSINPUT=id_password

USER=docsuser
PASS=notmyrealpassword
```

## Test images from `make run`

no authentication:

![/docker.png](/docker.png)

HTML auth to Docker Hub


![/hub-orgs.png](/hub-orgs.png)
