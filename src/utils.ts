import { dataSource } from "datasource";
import { User } from "entities/User";
import jwt from "jsonwebtoken";

export const generateToken = (
  user: User,
  secretKey: string,
  tokenLifeInSeconds: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { id, username } = user;

    jwt.sign(
      { data: { id, username } },
      secretKey,
      { algorithm: "HS256", expiresIn: tokenLifeInSeconds },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (
  token: string,
  secretKey: string
): Promise<Omit<User, "password">> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded.data);
    });
  });
};

export const getUser = async (token: string) => {
  const decodedUser = await verifyToken(token, process.env.JWT_SECRET_KEY);
  const user = await dataSource
    .getRepository(User)
    .findOne({ where: { id: decodedUser.id } });

  return user;
};

export const encodeCursor = (value: string) =>
  Buffer.from(String(value)).toString("base64");

export const decodeCursor = (value: string) =>
  Buffer.from(value, "base64").toString("utf-8");
