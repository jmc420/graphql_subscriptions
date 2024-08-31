import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import http from 'http';
import log from 'loglevel';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

import getResolvers from './GQLResolvers.js';
import { Schema } from './GQLSchema.js';

export const API = '/api'
const HOST = '0.0.0.0';

export default async function apolloServer(port: number): Promise<http.Server> {
	const debug: boolean = process.argv.join().indexOf("-debug") >= 0;

	if (debug) {
		log.setLevel(log.levels.DEBUG);
	}

	return new Promise(async (resolve, reject) => {
		const resolvers = getResolvers();
		const schema: GraphQLSchema = makeExecutableSchema({ typeDefs: Schema, resolvers });
		const app: Application = express();
		const apollo = new ApolloServer({ typeDefs: schema, resolvers: resolvers });

		await apollo.start();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(expressMiddleware(apollo, { context: async ({ req }) => ({ request: req }) }));

		const httpServer: http.Server = app.listen(port, HOST, () => {
			const wsServer = new WebSocketServer({
				server: httpServer,
				path: API,
			});

			useServer({
				schema: schema,
				context: (ctx) => ({
					request: ctx.extra.request
				}),
				onConnect: ctx => {
					console.log("onConnect " + ctx.extra.request.socket.remotePort);

					return true;
				},
				onClose: (ctx) => {
					console.log('onClose', ctx.extra.request.socket.remotePort)
				},
				onNext: (ctx, msg, args, result) => {
					console.debug('onNext', { msg, result });
				},
				onSubscribe: (ctx, msg) => {
					console.log('onSubscribe', { msg });
				}
			}, wsServer);

			log.info("Running Apollo Server on http://" + HOST + ":" + port);

			function shutdown() {
				httpServer.close(() => {
					process.exit(0);
				})
			}

			process.on('SIGTERM', function () {
				log.info('Shutting down on SIGTERM');
				shutdown();
			})

			process.on('SIGINT', function () {
				log.info('Shutting down on SIGINT');
				shutdown();
			})

			resolve(httpServer);

		}).on("error", (e) => {
			reject(e);
		});
	})
}
