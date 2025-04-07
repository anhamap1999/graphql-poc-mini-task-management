import { dataSource } from "datasource";
import { Resolver } from "types";
import { Task } from "entities/Task";
import { GraphQLError } from "graphql";

export const deleteTask: Resolver<string, { id: string }> = async (
  _,
  args,
  contextValue,
  __
) => {
  try {
    const task = await dataSource.getRepository(Task).findOne({
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

    await dataSource.getRepository(Task).delete(task);

    return task.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
