import { User } from "entities/User";
import { PubSub } from "graphql-subscriptions";

export interface Context {
  token?: string;
  user?: User;
  pubsub?: PubSub;
}

export type Resolver<Result, Args = unknown, Parent = unknown> = (
  parent: Parent,
  args: Args,
  context: Context,
  info
) => Promise<Result>;

export interface QueryPaginationOutput<T> {
  totalCount: number;
  pageInfo: {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
  };
  edges: {
    node: T;
    cursor: string;
  }[];
  data: T[];
}
