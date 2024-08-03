import { User } from "../models/User.models.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Invalid Access Token ⚠️");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(404, error?.message || "Invalid Access Token ⚠️");
  }
});
