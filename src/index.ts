import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import http from "http";
import { typeDefs, resolvers, authDirective, roleDirective } from "./schema";
import dotenv from "dotenv";
dotenv.config();
import { dataSource } from "datasource";
import { getUser } from "utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { Context } from "types";
import { PubSub } from "graphql-subscriptions";

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
wsServer.on("connection", () => {
  console.log("connected");
});

const { authDirectiveTransformer } = authDirective(getUser);
const { roleDirectiveTransformer } = roleDirective(getUser);
let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  inheritResolversFromInterfaces: true,
});
schema = authDirectiveTransformer(schema);
schema = roleDirectiveTransformer(schema);

const server = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

const pubsub = new PubSub();
app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware<Context>(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.replace("Bearer ", "")
        : "",
      pubsub,
    }),
  })
);

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:4000/graphql`);
});
