// TODO: "Register user controller";
// TODO: "Login user controller";
// TODO: "LogOut user controller";
// TODO: "user Refresh&AccessTokenGenerate controller";
// TODO: "user password change controller";
// TODO: "update userDetails controller";
// TODO: "update Avatar controller";
// TODO: "update CoverImage controller";
// TODO: "Get current user controller";

import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { uploadToAzure, destroyFromAzure } from "../utils/Azure.Config.js";
import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";

// Creating the Access Token and the Refresh Token for the User.

const regestierUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, password, email].some((field) => field?.trim === "")
  ) {
    throw new ApiError(404, "All Crediential's are Required! - 😤");
  }

  const existedUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existedUser) {
    throw new ApiError(
      400,
      "This User is already Existed in the Database! ,so please register with other Crediential's"
    );
  }

  console.log("This is your requset -> ", req.body, req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;

  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(404, "Please provide us an Avatar!");
  }

  let coverIamgeLoaclPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverIamgeLoaclPath = req.files?.coverImage[0]?.path;
  }

  console.log("This is you coverIamge local path -> ", coverIamgeLoaclPath);

  //uploading the images on the Azure blob storage
  const avatar = await uploadToAzure(avatarLocalPath);
  const coverImage = await uploadToAzure(coverIamgeLoaclPath);

  console.log("this is your avatar instance ->", avatar);
  console.log("this is your coverImages instance ->", coverImage);

  if (!avatar) {
    throw new ApiError(
      400,
      "Something went wrong while uploadint the Avatar image on the Azure!"
    );
  }
  if (!coverImage) {
    throw new ApiError(
      400,
      "Something went wrong while uploadint the Cover image on the Azure!"
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new ApiError(400, "Something went wrong while creating the User!");
  }

  res
    .status(201)
    .json(
      new Apiresponse(201, createUser, "User is Created Successfully! - ✅")
    );
});

export { regestierUser };
