import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { User, UserRole } from "entities/User";
import { GraphQLSchema } from "graphql";
import { adminGetTasks } from "resolvers/adminGetTasks";
import { createTask } from "resolvers/createTask";
import { deleteTask } from "resolvers/deleteTask";
import { getTasks } from "resolvers/getTasks";
import { logIn } from "resolvers/logIn";
import { PageResultEdge_cursor } from "resolvers/PageResultEdge_cursor";
import { signUp } from "resolvers/signUp";
import { Task_creator } from "resolvers/Task_creator";
import { PageInfo_startCursor } from "resolvers/PageInfo_startCursor";
import { taskUpdated } from "resolvers/taskUpdated";
import { updateTask } from "resolvers/updateTask";
import { Context, Resolver } from "types";
import { PageInfo_endCursor } from "resolvers/PageInfo_endCursor";

const authDescription = `Required 'Authorization' header with 'Bearer' access token.`;
const roleDescription = (role: UserRole) => `Required '${role}' role.`;
export const typeDefs = `#graphql
    input UserInput {
      username: String!
      password: String!
    }
    enum Role {
      USER
      ADMIN
    }
    type User {
        id: ID!
        username: String!
        password: String!
        role: Role!
    }
    type SignedInUserOutput {
        username: String!
        role: Role!
        accessToken: String!
    }
    type UserOutput {
        id: ID!
        username: String!
        role: Role!
    }

    input TaskInput {
        name: String!
    }
    type Task {
        id: ID!
        name: String!
        createdAt: String!
        creator: UserOutput!
    }
    type TaskOutput {
        id: ID!
        name: String!
        createdAt: String!
    }

    type PageInfo {
        startCursor: String
        endCursor: String
        hasNextPage: Boolean!
    }

    interface PageResultEdge {
        cursor: String!
    }

    type TasksEdge implements PageResultEdge {
        cursor: String!
        node: TaskOutput!
    }
    type QueryTasksOutput {
        totalCount: Int!
        pageInfo: PageInfo!
        edges: [TasksEdge]
        data: [TaskOutput]
    }

    type AdminGetTasksEdge implements PageResultEdge {
        cursor: String!
        node: Task!
    }
    type AdminQueryTasksOutput {
        totalCount: Int!
        pageInfo: PageInfo!
        edges: [AdminGetTasksEdge]
        data: [Task]
    }

    directive @auth on FIELD_DEFINITION | OBJECT
    directive @role(role: Role) on FIELD_DEFINITION | OBJECT

    type Query {
        "${authDescription}"
        getTasks(first: Int = 10, after: String): QueryTasksOutput! @auth
        """
        ${authDescription}
        ${roleDescription(UserRole.ADMIN)}
        """
        adminGetTasks(first: Int = 10, after: String): AdminQueryTasksOutput! @auth @role(role: ADMIN)
    }

    type Mutation {
        signUp(input: UserInput!): SignedInUserOutput!
        logIn(input: UserInput!): SignedInUserOutput!

        "${authDescription}"
        createTask(input: TaskInput!): TaskOutput! @auth
        "${authDescription}"
        updateTask(id: ID!, input: TaskInput!): TaskOutput! @auth
        "${authDescription}"
        deleteTask(id: ID!): ID! @auth
    }

    type Subscription {
        taskUpdated: TaskOutput!
    }
`;

export const resolvers = {
  Query: {
    getTasks,
    adminGetTasks,
  },
  Task: {
    creator: Task_creator,
  },
  Mutation: {
    signUp,
    logIn,
    createTask,
    updateTask,
    deleteTask,
  },
  Subscription: {
    taskUpdated: {
      subscribe: taskUpdated,
    },
  },
  PageInfo: {
    startCursor: PageInfo_startCursor,
    endCursor: PageInfo_endCursor,
  },
  PageResultEdge: {
    cursor: PageResultEdge_cursor,
  },
};

const authDirectiveName = "auth";
export const authDirective = (getUserFn: (token: string) => Promise<User>) => {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(
            schema,
            type,
            authDirectiveName
          )?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, authDirectiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { resolve } = fieldConfig;
            const authResolver: Resolver<unknown, Context> = async (
              parent,
              args,
              context,
              info
            ) => {
              const user = await getUserFn(context.token);
              if (!user) {
                throw new Error("Unauthorized.");
              }
              context.user = user;
              return resolve(parent, args, context, info);
            };
            fieldConfig.resolve = authResolver;
            return fieldConfig;
          }
        },
      }),
  };
};

const roleDirectiveName = "role";
export const roleDirective = (getUserFn: (token: string) => Promise<User>) => {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    roleDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const roleDirective = getDirective(
            schema,
            type,
            roleDirectiveName
          )?.[0];
          if (roleDirective) {
            typeDirectiveArgumentMaps[type.name] = roleDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const roleDirective =
            getDirective(schema, fieldConfig, roleDirectiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (roleDirective) {
            const { role } = roleDirective;
            const { resolve } = fieldConfig;
            const roleResolver: Resolver<unknown, Context> = async (
              parent,
              args,
              context,
              info
            ) => {
              const user = await getUserFn(context.token);
              if (!user) {
                throw new Error("Unauthorized.");
              }
              if (user.role !== role) {
                throw new Error("Forbidden.");
              }
              context.user = user;
              return resolve(parent, args, context, info);
            };
            fieldConfig.resolve = roleResolver;
            return fieldConfig;
          }
        },
      }),
  };
};
