import { Resolver } from "types";
import { encodeCursor } from "utils";

export const PageInfo_endCursor: Resolver<
  string | null | undefined,
  unknown,
  { endCursor?: string }
> = async ({ endCursor }, _, __, ___) => {
  try {
    return endCursor ? encodeCursor(endCursor) : endCursor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
