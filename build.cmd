docker build -t docker-sb .
set port=8083
set app=docker-sb-%port%
docker stop %app%
docker rm %app%
docker run --env PORT=80 -d -p %port%:80 --name %app% docker-sb