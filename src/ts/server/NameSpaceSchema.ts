export const Schema = `

directive @actions(create: Boolean!, read: Boolean!, update: Boolean!, delete: Boolean!, subscribe: Boolean!) on OBJECT
directive @autoIncrement on FIELD_DEFINITION
directive @entity on OBJECT
directive @primaryKey on FIELD_DEFINITION

type User 
    @actions(create: true, read: true, update: false, delete: true, subscribe: true)
    @entity {
    id: Int! @autoIncrement @primaryKey 
    email: String!
    name: String!
}

input UserInput {
	id: Int
	email: String!
	name: String!
}

type UserMutation {
	create(user: UserInput!) : User!
	deleteById(id: Int!): Boolean!
}

type Mutation {
	user: UserMutation!
}

input SortOrder {
	columnName: String!
	ascending: Boolean!
}

type UserQuery {
	byId(id: Int!): User
	byPage(start: Int!, total: Int!, order: [SortOrder!]!): [User!]!
	count: Int!
}

type Query {
	user: UserQuery!
}
type UserSubscription {
	created : User!
	deleted : User!
	updated : User!
}

type Subscription {
	user: UserSubscription!
}
`;