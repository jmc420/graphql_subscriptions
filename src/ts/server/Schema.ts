export const Schema = `

type Mutation {
    sendMessage(message: String!): Boolean!
}

type Query {
    getMessages: [String!]!
}

type Subscription {
    messageListener: String!
}
`;