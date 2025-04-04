# [User Authentication API](https://user-authentication.saxonkeegan.com)
This RESTful API manages user authentication and the retreival of authenticated user data. The project is built to be containerised with Docker and connected together using an NGINX reverse proxy.
## What does this project include?
The project is split into 3 parts:
1. [backend](./backend) - This folder includes the user authentication API
2. [frontend](./frontend) - A React front end to demonstrate how to use the API
3. [nginx](./nginx) - Reverse proxy configuration for routing the API and front end
## What was the purpose of this project?
Authenticating and managing a user accounts is central to almost all web application so I wanted to learn and understand how this is achieved from both the back end and front end perspectives.
### API
I had 2 goals I wanted to achieve with the API:
1. Use established authentication techniques - I achived this by implementing a refresh (30 day lifespan) and access token (10 minute lifespan) pattern where the refresh token is only used to issue new access tokens from the authentication endpoint. The access token is used to authenticate all endpoints that access user information.
2. Design the API to be modular - I wanted to focus on a modular approach to the architecture so I built the API using a MVC inspired design pattern. Each resource is split as follows:
   - Controller: Defines the endpoint location and method type. Contains all logic for handling the request
   - Service: Contains all reusable business logic specific to each resource
   - Model: Defines data tables specific to the resource
Although the API is built as a monilith, by making the API modular it makes it a simpler task of seperating each resource out into its own micro service.
You can find the details of the API endpoints in the [API directory](/tree/main/backend).
### Front End
I wanted to get familiar building the front end using the React framework so I added a demo application to show how the API can be used to register, maintain user login across sessions, and make changes to the logged in users data.
## Project Setup
### Prerequisites
- [Docker](https://www.docker.com/)
### Clone the repository
```sh
git clone https://github.com/SaxonK/user-authentication-api.git
cd your-dir-name
```
### Create .env file
Creates the .env file from provide example. Make sure you set the values for each variable
```sh
cp .env.example .env
```
### Build container in Docker
```sh
docker-compose up --build
```
### How to shutdown the container in Docker
```sh
docker-compose down
```
