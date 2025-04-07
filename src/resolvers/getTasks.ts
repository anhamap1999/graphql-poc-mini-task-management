import { dataSource } from "datasource";
import { Task } from "entities/Task";
import { QueryPaginationOutput, Resolver } from "types";
import { decodeCursor } from "utils";

export const getTasks: Resolver<
  QueryPaginationOutput<Task>,
  {
    first: number;
    after?: string;
  }
> = async (_, args, contextValue, __) => {
  try {
    const queryBuilder = dataSource
      .getRepository(Task)
      .createQueryBuilder("task")
      .leftJoin("task.creator", "creator")
      .where("creator.id = :creatorId", { creatorId: contextValue.user.id })
      .orderBy("task.id");

    const totalCount = await queryBuilder.getCount();

    queryBuilder.limit(args.first + 1);
    if (args.after) {
      queryBuilder.andWhere("task.id > :cursor", {
        cursor: decodeCursor(args.after),
      });
    }
    const tasks = await queryBuilder.getMany();
    let hasNextPage = false;
    if (tasks.length > args.first) {
      hasNextPage = true;
      tasks.pop();
    }

    return {
      data: tasks,
      edges: tasks.map((task) => ({ cursor: task.id, node: task })),
      pageInfo: {
        hasNextPage,
        startCursor: tasks.at(0)?.id,
        endCursor: tasks.at(tasks.length - 1)?.id,
      },
      totalCount,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
