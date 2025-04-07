import { Resolver } from "types";
import { encodeCursor } from "utils";

export const PageResultEdge_cursor: Resolver<
  string | null | undefined,
  unknown,
  { cursor: string }
> = async ({ cursor }, _, __, ___) => {
  try {
    return encodeCursor(cursor);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
