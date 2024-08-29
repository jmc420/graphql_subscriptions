import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import http from 'http';
import log from 'loglevel';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { createHandler } from 'graphql-http/lib/use/express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

import getResolvers from './Resolvers.js';
import { Schema } from './Schema.js';

export const API = '/api'
const HOST = '0.0.0.0';

export default async function graphQLServer(port: number): Promise<http.Server> {
	const debug: boolean = process.argv.join().indexOf("-debug") >= 0;

	if (debug) {
		log.setLevel(log.levels.DEBUG);
	}

	return new Promise((resolve, reject) => {
		const resolvers = getResolvers();
		const schema: GraphQLSchema = makeExecutableSchema({ typeDefs: Schema, resolvers });
		const app: Application = express();
		const handler = createHandler({ schema: schema, context: async (req) => { return { request: req.raw } } });

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.all(API, handler);

		const httpServer: http.Server = app.listen(port, HOST, () => {
			const wsServer = new WebSocketServer({ server: httpServer, path: API });

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

			log.info("Running on http://" + HOST + ":" + port + API);

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
