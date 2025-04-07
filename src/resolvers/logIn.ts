import { dataSource } from "datasource";
import { User, UserRole } from "entities/User";
import { Resolver } from "types";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { generateToken } from "utils";

export const logIn: Resolver<
  { username: string; role: UserRole; accessToken: string },
  { input: { username: string; password: string } }
> = async (_, args, __, ___) => {
  try {
    console.log(args)
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { username: args.input.username } });
    if (user) {
      const comparedResult = await bcrypt.compare(
        args.input.password,
        user.password
      );

      if (comparedResult) {
        const accessToken = await generateToken(
          user,
          process.env.JWT_SECRET_KEY,
          parseInt(process.env.JWT_TOKEN_LIFE_IN_SECONDS)
        );
        return {
          username: user.username,
          role: user.role,
          accessToken,
        };
      }
    }

    throw new GraphQLError("Username or password is incorrect.");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
