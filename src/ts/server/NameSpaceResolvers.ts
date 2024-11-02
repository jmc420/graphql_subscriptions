import { PubSub } from 'graphql-subscriptions';

import { Resolvers, UserMutationResolvers, UserQueryResolvers, UserSubscriptionResolvers } from './NameSpaceModel.js';
import { getUserMutationResolvers, getUserQueryResolvers, getUserSubscriptionResolvers } from './NameSpacedResolvers.js';
import { IAppContext } from './AppContext.js';

export default function getResolvers(appContext: IAppContext): Resolvers {
	const resolvers: Resolvers = {
		Mutation: {
			user: (obj, args, context, info): UserMutationResolvers => resolvers.UserMutation
		},
		UserMutation: getUserMutationResolvers(appContext),
		Query: {
			user: (obj, args, context, info): UserQueryResolvers => resolvers.UserQuery
		},
		UserQuery: getUserQueryResolvers(appContext),
		Subscription: {
			user: (obj, args, context, info): UserSubscriptionResolvers => resolvers.UserSubscription
		},
		UserSubscription: getUserSubscriptionResolvers(appContext),
	}

	return resolvers;
}
