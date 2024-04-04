import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const userRegister = AsyncHandler(async (req, res) => {
  // STEPS TO REGISTER A USER
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, then check avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { username, email, fullName, password } = req.body;

  if (
    [username, email, fullName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist!");
  }
  // console.log(req.files);

  // const avatarLocalFilePath = req.files?.avatar[0]?.path;
  // const coverImageLocalFilePath = req.files?.coverImage[0]?.path;  It can be undefiend because we rely on optionalchaining and do not check explicitly

  let avatarLocalFilePath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalFilePath = req.files?.avatar[0]?.path;
  } else {
    throw new ApiError(400, "Avatar file Image is required!");
  }

  let coverImageLocalFilePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalFilePath = req.files?.coverImage[0]?.path;
  }

  // console.log(
  //   `avatarLocalFilePath: ${avatarLocalFilePath} \ncoverImageLocalFilePath: ${coverImageLocalFilePath}`
  // );

  // if (!avatarLocalFilePath) {
  //   throw new ApiError(400, "Avatar file Image is required!");
  // }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file Image is required!");
  }

  let user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

export { userRegister };
