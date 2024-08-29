# graphql_subscriptions
GraphQL test subscriptions

To build:

npm i && npm run compile

To run server:

npm run server

To run client (or use Postman)

npm run client

Output from Server

Running on http://0.0.0.0:8080/api  
Publish Hello0  
onConnect 62962  
onSubscribe {  
  msg: {  
    id: 'c0b38c23-0116-4b66-aa16-213c6c53e789',  
    type: 'subscribe',  
    payload: { query: 'subscription MessageListener { messageListener }' }  
  }  
}  
Publish Hello1  
Publish Hello2  
Publish Hello3  
onClose 62962  
Publish Hello4  

Output from Client

Listening for messages  
SENT MESSAGE Hello0  
SENT MESSAGE Hello1  
SENT MESSAGE Hello2  
SENT MESSAGE Hello3  
SENT MESSAGE Hello4  
Finished. Messages sent: 5. Messages received: 0  


