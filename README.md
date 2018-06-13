# Dev Environment Setup

After cloning:
1. Start Redis and RabbitMQ services using the docker-compose.yml file ```docker-compose up -d```. (Redis can be accessed by using redis-cli, whereas RabbitMQ can be accessed in the browser from http://localhost:15672)
1. Install the dependencies ```yarn``` or ```npm install```
1. Add the following line in /etc/hosts : ```127.0.0.1 che0.localhost che1.localhost```
1. Start the server using the command: ```yarn start``` or ```npm start```

Creating a new server
1. Generate a JWT token by running ```node generateToken.js <gitlab-dev-username> server:all```, and copy it.
1. Make a POST Request to the server using URL: http://localhost:3000/agent-api/server , with header "Authorization" set to "Bearer <generated-token>". The response will contain the URL of the newly created Eclipse Che Server. However, this will take a while to download the images for the first time. Please look at the logs for the Swagger API URL, to ensure that the server was created successfully
1. Connect to the server using the URL returned in the previous step. This will redirect to gitlab-dev.stackroute.in for authentication. After this, eclipse che opens.

Cleanup:
1. Stop and remove containers (assuming only project related containers are running) using command ```docker stop $(docker ps -aq)```. and ```docker rm $(docker rm $(docker ps -aq)```
1. down and up docker-compose services
1. Delete the /data directory, where Eclipse Che server configurations are created ```sudo rm -rf /data```.
