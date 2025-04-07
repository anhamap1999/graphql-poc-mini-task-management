import { dataSource } from "datasource";
import { Resolver } from "types";
import { Task } from "entities/Task";
import { GraphQLError } from "graphql";
import { taskUpdated } from "./taskUpdated";

export const updateTask: Resolver<
  Task,
  { id: string; input: { name: string } }
> = async (_, args, contextValue, __) => {
  try {
    let task = await dataSource.getRepository(Task).findOne({
      where: { id: args.id },
      relations: {
        creator: true,
      },
    });

    if (!task) {
      throw new GraphQLError("Not found task.");
    }
    if (task.creator.id !== contextValue.user.id) {
      throw new GraphQLError("Forbidden.");
    }

    task = { ...task, ...args.input };
    const result = await dataSource.getRepository(Task).save(task);

    contextValue.pubsub.publish(taskUpdated.name, {
      taskUpdated: result,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
