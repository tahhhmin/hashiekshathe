import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | undefined => {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // No token found in cookies — throw or return undefined
      throw new Error("jwt must be provided");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload | string;

    if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) {
      return decodedToken.id as string;
    }
    return undefined;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred during token verification");
    }
  }
};
