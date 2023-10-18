# Tasks API Management

## Description

Manage tasks associated with authenticated and authorized users through this REST API.

## Installation

```bash
$ npm install
```

## Running the app

Copy the .env.example file to .env and fill in the values. Then run the following command to start the app.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## TCP

To use TCP, you need to fetch tcp branch and clone api-gateway repository. Follow the instructions in the README.md file of the api-gateway repository. And make the
request to port 4001 instead of 4002. (This can be changed in the .env file)

## User creation

To create a user, you need to use the following endpoint:

```bash
POST http://localhost:4002/auth/signup
```

The body of the request should be in the following format:

```json
{
  "name": "Kamil",
  "firstSurname": "Mysliwiec",
  "email": "kamil@example.com",
  "password": "Str0ngP@ssw0rd!"
}
```

Then you can login with the following endpoint:

```bash
POST http://localhost:4002/auth/login
```

The body of the request should be in the following format:

```json
{
  "email": "kamil@example.com",
  "password": "Str0ngP@ssw0rd!"
}
```

The response will contain a JWT token that you can use to authenticate yourself in the other endpoints. Use the token in the authorization header of each request as bearer token.

## Tasks

Once you login, you can create tasks associated with your user.
To create a task, you need to use the following endpoint:

```bash
POST http://localhost:4002/tasks
```

The body of the request should be in the following format:

```json
{
  "title": "Learn about NestJS",
  "description": "Learn about NestJS and create a project with it",
  "status": "OPEN"
}
```

To get all the tasks associated with your user, you need to use the following endpoint:

```bash
GET http://localhost:4002/tasks
```

To see more details about the EP's, please check the documentation.

## Documentation

The documentation for this API can be found at the following URL:

```bash
http://localhost:4002/docs
```
