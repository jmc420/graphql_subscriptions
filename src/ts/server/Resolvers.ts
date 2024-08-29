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
				pubsub.publish("messageListener", message);
				return true;
			},
		},
		Subscription: {
			messageListener: {
				subscribe: async function* (obj, args, context, info): AsyncGenerator {
					return pubsub.asyncIterator("messageListener");
				},
			},
		},
	}

	return resolver;
}
