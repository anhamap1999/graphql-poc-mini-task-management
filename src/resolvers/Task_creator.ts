import { dataSource } from "datasource";
import { Task } from "entities/Task";
import { User, UserRole } from "entities/User";
import { Resolver } from "types";

export const Task_creator: Resolver<
  { username: string; role: UserRole; id: string },
  unknown,
  Task
> = async (parent, _, __, ___) => {
  try {
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { id: parent.creator.id } });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
