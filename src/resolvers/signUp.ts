import { dataSource } from "datasource";
import { User, UserRole } from "entities/User";
import { Resolver } from "types";
import bcrypt from "bcrypt";
import { generateToken } from "utils";

export const signUp: Resolver<
  { username: string; role: UserRole; accessToken: string },
  { input: { username: string; password: string } }
> = async (_, args, __, ___) => {
  try {
    args.input.password = await bcrypt.hash(args.input.password, 10);
    const user = await dataSource.getRepository(User).create(args.input);
    const result = await dataSource.getRepository(User).save(user);

    const accessToken = await generateToken(
      result,
      process.env.JWT_SECRET_KEY,
      parseInt(process.env.JWT_TOKEN_LIFE_IN_SECONDS)
    );
    return {
      username: result.username,
      role: result.role,
      accessToken,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
