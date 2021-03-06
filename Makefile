
SCREENSHOT=docker run -it --rm --name screen -v $(CURDIR):/srv screenshot

go: build run

build:
	docker build -t screenshot .
	docker build -t optipng -f Dockerfile.OptiPNG .
	docker build -t imagemagick -f Dockerfile.ImageMagick .

run:
	# test un-authenticated screenshot
	#docker run -it --rm --name screen -v $(CURDIR):/srv \
	#	screenshot  https://docker.com/ docker.png 984px
	# test the HTML auth on the Docker hub
	docker run -it --rm --name screen -v $(CURDIR):/srv --env-file=passwords.env \
		screenshot https://hub-beta.docker.com/organizations/ hub-orgs.png 984px

cmd:
	docker run -it --rm --name screen -v /data/src/docker-screenshot:/srv --entrypoint bash screenshot

