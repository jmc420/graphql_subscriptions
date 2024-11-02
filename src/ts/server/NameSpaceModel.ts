// types

export class User {
	id: number;
	email: string;
	name: string;
}

// input types

export class SortOrder {
	columnName: string;
	ascending: boolean;
}

export class UserInput {
	id?: number;
	email: string;
	name: string;
}

// Mutation Entity types

export type UserMutation = {
	create: User;
	deleteById: boolean;
}

export type Mutation = {
	user: UserMutation;
}

// Query Entity types

export type UserQuery = {
	byId?: User;
	byPage: User[];
	count: number;
}

export type Query = {
	user: UserQuery;
}

// Subscription Entity types

export type UserSubscription = {
	created: User;
	deleted: User;
	updated: User;
}

export type Subscription = {
	user: UserSubscription;
}

// Resolver Argument types

export type UserMutationCreate = {
	user: UserInput;
}

export type UserMutationDeleteById = {
	id: number;
}

export type UserQueryById = {
	id: number;
}

export type UserQueryByPage = {
	start: number;
	total: number;
	order: SortOrder[];
}

export type UserMutationResolvers = {
	create(obj, args: UserMutationCreate, context, info): Promise<User>;
	deleteById(obj, args: UserMutationDeleteById, context, info): Promise<boolean>;
}

export type UserQueryResolvers = {
	byId(obj, args: UserQueryById, context, info): Promise<User>;
	byPage(obj, args: UserQueryByPage, context, info): Promise<User[]>;
	count(obj, args, context, info): Promise<number>;
}

export type UserSubscriptionResolvers = {
	created: {
		subscribe(obj, args, context, info): AsyncIterator<User>;
		resolve(payload: User): User;
	};
	deleted: {
		subscribe(obj, args, context, info): AsyncIterator<User>;
		resolve(payload: User): User;
	};
	updated: {
		subscribe(obj, args, context, info): AsyncIterator<User>;
		resolve(payload: User): User;
	};
}

export type Resolvers = {
	Mutation: {
		user(obj, args, context, info): UserMutationResolvers;
	};
	UserMutation: UserMutationResolvers;
	Query: {
		user(obj, args, context, info): UserQueryResolvers;
	};
	UserQuery: UserQueryResolvers;
	Subscription: {
		user(obj, args, context, info): UserSubscriptionResolvers;
	};
	UserSubscription: UserSubscriptionResolvers;
}
