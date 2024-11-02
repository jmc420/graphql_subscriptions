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

export type Mutation = {
	create: User;
	deleteById: boolean;
}

export type Query = {
	byId?: User;
	byPage: User[];
	count: number;
}

export type Subscription = {
	createdUser: User;
	deletedUser: User;
}

// Resolver Argument types

export type MutationCreate = {
	user: UserInput;
}

export type MutationDeleteById = {
	id: number;
}

export type QueryById = {
	id: number;
}

export type QueryByPage = {
	start: number;
	total: number;
	order: SortOrder[];
}

export type Resolvers = {
	Mutation: {
		create(obj, args: MutationCreate, context, info): Promise<User>;
		deleteById(obj, args: MutationDeleteById, context, info): Promise<boolean>;
	};
	Query: {
		byId(obj, args: QueryById, context, info): Promise<User>;
		byPage(obj, args: QueryByPage, context, info): Promise<User[]>;
		count(obj, args, context, info): Promise<number>;
	};
	Subscription: {
		createdUser: {
			subscribe(obj, args, context, info): AsyncIterator<User>;
			resolve(payload: User): User;
		};
		deletedUser: {
			subscribe(obj, args, context, info): AsyncIterator<User>;
			resolve(payload: User): User;
		};
	};
}
