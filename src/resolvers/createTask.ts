import { dataSource } from "datasource";
import { Resolver } from "types";
import { Task } from "entities/Task";

export const createTask: Resolver<Task, { input: { name: string } }> = async (
  _,
  args,
  contextValue,
  __
) => {
  try {
    const task = await dataSource
      .getRepository(Task)
      .create({ ...args.input, creator: contextValue.user });
    const result = await dataSource.getRepository(Task).save(task);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
