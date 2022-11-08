# Mini API + JWT

This simple project using Typescript + Express was made to practice a simple CRUD with a simple API.

JWT was also used to practice creating protected routes (NOTE: I didn't do the login system or something, you need to get the Token that the API generates for you and use it in your mini-frontend. If you want to "improve" the code, feel free).

## Endpoints:

```
GET http:localhost:3000/games
GET http:localhost:3000/game/1
POST http:localhost:3000/game
PUT http:localhost:3000/game/1
DELETE http:localhost:3000/game/1

POST http:localhost:3000/auth => Generate your token
```

## Commands:

```bash
yarn dev # Run the API in development mode
yarn build # Generate API build in a bundle using ESBuild
yarn start # Start your API
```
