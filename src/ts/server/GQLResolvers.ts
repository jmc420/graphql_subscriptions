import { PubSub } from 'graphql-subscriptions';

export default function getResolvers() {
	let messages: string[] = [];
	const pubsub = new PubSub();
	const resolver = {
		Query: {
			getMessages: async (obj, args, context, info): Promise<string[]> => {
				return messages;
			},
		},
		Mutation: {
			sendMessage: async (obj, args, context, info): Promise<boolean> => {
				const message: string = args.message;

				messages.push(message);
				console.log("Publish "+message);
				pubsub.publish("messageListener", { content: message });
				return true;
			},
		},
		Subscription: {
			messageListener: {
				resolve: (payload) => payload,
				subscribe: (obj, args, context, info) => {
					return pubsub.asyncIterator("messageListener");
				}
			},
		},
	}

	return resolver;
}
