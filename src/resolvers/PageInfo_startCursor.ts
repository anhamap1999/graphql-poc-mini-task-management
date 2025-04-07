import { Resolver } from "types";
import { encodeCursor } from "utils";

export const PageInfo_startCursor: Resolver<
  string | null | undefined,
  unknown,
  { startCursor?: string }
> = async ({ startCursor }, _, __, ___) => {
  try {
    return startCursor ? encodeCursor(startCursor) : startCursor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
