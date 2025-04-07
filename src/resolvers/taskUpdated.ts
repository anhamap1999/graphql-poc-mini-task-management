import { Resolver } from "types";

export const taskUpdated: Resolver<AsyncIterableIterator<unknown>> = async (
  _,
  __,
  contextValue,
  ___
) => {
  try {
    return contextValue.pubsub.asyncIterableIterator([taskUpdated.name]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
