# graphql_subscriptions
GraphQL test subscriptions using resolvers and name spaced resolvers

To build:

npm i && npm run compile

To run server without namespace resolvers, npm run server

To run server with namespace resolvers, npm run namespace-server

Use Postman as client

In the version with name space resolvers Web sockets crash with the error:

Error: Subscription field must return Async Iterable. Received: undefined.



 



