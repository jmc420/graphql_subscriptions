export const Schema = `

type Message {
    content: String!
}

type Mutation {
    sendMessage(message: String!): Boolean!
}

type Query {
    getMessages: [String!]!
}

type Subscription {
    messageListener: Message!
}
`;