#!/bin/sh

export SCREENSHOT="docker run -it --rm --name screen -v $(pwd):/srv screenshot"

# index.md
$SCREENSHOT https://hub.docker.com/ docker/docs/sources/docker-hub/hub-images/hub.png 984px
# repos.md
$SCREENSHOT https://registry.hub.docker.com/repos/ docker/docs/sources/docker-hub/hub-images/repos.png 984px
# userguide.md
$SCREENSHOT https://registry.hub.docker.com/ docker/docs/sources/docker-hub/hub-images/dashboard.png 984px
# acounts.md
$SCREENSHOT https://hub.docker.com/account/organizations/ docker/docs/sources/docker-hub/hub-images/orgs.png 984px
$SCREENSHOT https://hub.docker.com/account/organizations/docsorg/ docker/docs/sources/docker-hub/hub-images/groups.png 984px
$SCREENSHOT https://hub.docker.com/account/organizations/ docker/docs/sources/docker-hub/hub-images/orgs.png 984px
# this isn't totally identical to what happens if the user clicks edit
$SCREENSHOT https://hub.docker.com/account/organizations/docsorg/groups/12006/ docker/docs/sources/docker-hub/hub-images/invite.png

#cropping the bottom menu off
#docker run -it --rm --name screen -v $(pwd):/srv -w /srv imagemagick /usr/bin/mogrify -gravity South  -chop  0x150 docker/docs/sources/docker-hub/hub-images/hub.png
find docker -type f  | xargs | sed 's/^/docker run  --rm -v $(pwd):\/srv -w \/srv imagemagick /g'  | sh

echo "Before png optimizaion"
find docker/ -type f | xargs ls -lah
find docker -type f  | xargs | sed 's/^/docker run  --rm -v $(pwd):\/srv -w \/srv optipng /g'  | sh
echo "After png optimizaion"
find docker/ -type f | xargs ls -lah

echo "New screenshots ready to be copied over to the docker clone"
echo
find docker -type f
echo
echo "cp -r docker/* ../docker/"
echo
