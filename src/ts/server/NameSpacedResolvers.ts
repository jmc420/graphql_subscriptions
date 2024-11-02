import { PubSub } from 'graphql-subscriptions';

import { User, UserInput, UserMutationCreate, UserMutationDeleteById, UserMutationResolvers, UserQueryById, UserQueryByPage, UserQueryResolvers, UserSubscriptionResolvers } from './NameSpaceModel.js';
import { IAppContext } from './AppContext.js';

const pubsub = new PubSub();

let users: User[] = [];

export function getUserMutationResolvers(appContext: IAppContext): UserMutationResolvers {

	return {
		create: async (obj, args: UserMutationCreate, context, info): Promise<User> => {
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
		deleteById: async (obj, args: UserMutationDeleteById, context, info): Promise<boolean> => {
			const find: User[] = users.filter(user => user.id == args.id);

			users = users.filter(user => user.id != args.id);

			if (find.length > 0) {
				pubsub.publish("deletedUser", find[0]);
			}
			
			return true;
		},
	};
}

export function getUserQueryResolvers(appContext: IAppContext): UserQueryResolvers {

	return {
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
	};
}

export function getUserSubscriptionResolvers(appContext: IAppContext): UserSubscriptionResolvers {

	return {
		created: {
			subscribe(obj, args, context, info): AsyncIterator<User> {
				return pubsub.asyncIterator("createdUser");
			},
			resolve: (payload: User): User => payload
		},
		deleted: {
			subscribe(obj, args, context, info): AsyncIterator<User> {
				return pubsub.asyncIterator("deletedUser");
			},
			resolve: (payload: User): User => payload
		},
		updated: {
			subscribe(obj, args, context, info): AsyncIterator<User> {
				return pubsub.asyncIterator("updatedUser");
			},
			resolve: (payload: User): User => payload
		}
	}
}

