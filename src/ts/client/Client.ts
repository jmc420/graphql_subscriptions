import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

import { GraphQLResult, postGraphQL } from './Request.js';

const httpUrl = "http://127.0.0.1:8080/api";
const wsUrl = "ws://127.0.0.1:8080/api";
const MAX_MESSAGES = 5;
let receivedMessages = 0;
let sentMessages = 0;

async function sendMessage(url, message): Promise<GraphQLResult> {
    const gql = `mutation SendMessage { sendMessage(message: "${message}") }`;

    return await postGraphQL(url, gql, {});
}

async function sendMessages() {
    for (sentMessages = 0; sentMessages < MAX_MESSAGES; sentMessages++) {
        const message: string = "Hello" + sentMessages;

        const result: GraphQLResult = await sendMessage(httpUrl, "Hello" + sentMessages);

        if (result.error != "") {
            console.log("Cannot send message " + result.error)
        }
        else {
            console.log("SENT MESSAGE " + message)
        }
    }
}
/*
let ws1: WebSocket = new WebSocket(wsUrl);
let ws2: WebSocket = new WebSocket(wsUrl);

ws1.on('error', () => console.log("error"));

ws1.on('close', () => {
    console.log("ws1 closed");
    ws2 = new WebSocket(wsUrl);
})

ws1.on('open', async () => {
    console.log("ws1 opened")
    ws1.send('subscription MessageListener { messageListener }');
});

ws1.on('message', (data) => {
    console.log('ws1 received: %s', data);
});

ws2.on('open', async () => {
    console.log("ws2 opened")
    await sendMessages();
});

ws2.on('close', () => {
    console.log("ws2 closed");
    ws2 = new WebSocket(wsUrl);
})

ws2.on('message', (data) => {
    console.log('ws2 received: %s', data);
});
*/

const client = createClient({
    url: wsUrl,
});

const query = "subscription MessageListener { messageListener }"

client.subscribe(
    { query },
    {
      next: (data) => console.log(data),
      error: console.error,
      complete: () => console.log('finished'),
    }
  );

/*

async function messageListener(client) {
    return client.iterate({
        query: 'subscription MessageListener { messageListener }',
    });
}
    
const subscription = await messageListener(client);

(async () => {
    console.log("Listening for messages")
    try {
        for await (const event of subscription) {
            receivedMessages++;
            console.log("Received event " + event)
        }
    }
    catch (e) {
        console.log("Error " + e.message)
    }
})()
*/

await new Promise(async resolve => {
    await sendMessages();
    setTimeout(resolve, 5000)
});

console.log("Finished. Messages sent: " + sentMessages + ". Messages received: " + receivedMessages)

