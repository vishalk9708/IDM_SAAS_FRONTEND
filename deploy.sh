#!/bin/bash
docker container rm -f $2 # Remove container
docker image rm $2
docker build -t $2 .
docker run -d -p $1:3000 --name=$2 --restart=always $2
docker container logs -f $2