import { PubSub } from 'graphql-subscriptions';

import { MutationCreate, MutationDeleteById, Resolvers, User, UserInput } from './ServerModel.js';
import { IAppContext } from './AppContext.js';
import { UserQueryById, UserQueryByPage } from './NameSpaceModel.js';

let users: User[] = [];

export default function getResolvers(appContext: IAppContext): Resolvers {
	const pubsub = new PubSub();
	const resolvers: Resolvers = {
		Mutation: {
			create: async (obj, args: MutationCreate, context, info): Promise<User> => {
				const userInput: UserInput = args.user;
				const user: User = {
					id: users.length,
					email: userInput.email,
					name: userInput.name
				}

				users.push(user);
				pubsub.publish("createdUser", user);
				return user;
			},
			deleteById: async (obj, args: MutationDeleteById, context, info): Promise<boolean> => {
				const find: User[] = users.filter(user => user.id == args.id);

				users = users.filter(user => user.id != args.id);

				if (find.length > 0) {
					pubsub.publish("deletedUser", find[0]);
				}

				return true;
			}
		},
		Query: {
			count: async (obj, args, context, info): Promise<number> => {
				return users.length;
			},
			byPage: async (obj, args: UserQueryByPage, context, info): Promise<User[]> => {
				return users;
			},
			byId: async (obj, args: UserQueryById, context, info): Promise<User> => {
				const find: User[] = users.filter(user => user.id == args.id);

				if (find.length > 0) {
					return find[0];
				}
				return null;
			},
		},
		Subscription: {
			createdUser: {
				resolve: (payload) => payload,
				subscribe: (obj, args, context, info) => {
					return pubsub.asyncIterator("createdUser");
				}
			},
			deletedUser: {
				resolve: (payload) => payload,
				subscribe: (obj, args, context, info) => {
					return pubsub.asyncIterator("deletedUser");
				}
			}
		},
	}

	return resolvers;
}
