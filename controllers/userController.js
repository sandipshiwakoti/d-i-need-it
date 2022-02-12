const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedRequestError } = require("../errors");
const NotFoundError = require("../errors/not-found");
const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user");

const comparePassword = async (password, documentPassword) => {
  return await bcrypt.compare(password, documentPassword);
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const updateUser = asyncWrapper(async (req, res, next) => {
  const { fullname, mobile, email } = req.body;
  const userId = req.user.userId;

  if (!email || !fullname || !mobile) {
    return next(
      new BadRequestError("Fields cannot be empty", StatusCodes.BAD_REQUEST)
    );
  }

  const user = await User.findOne({ _id: userId });
  console.log(user);

  if (!user) {
    return next(
      new UnauthorizedRequestError(
        "Access unauthorized!",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  await User.findOneAndUpdate(
    { _id: userId },
    {
      fullname,
      mobile,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Account updated successfully!" });
});

const updatePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const userId = req.user.userId;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return next(
      new UnauthorizedRequestError(
        "Access unauthorized!",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const isPasswordCorrect = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    return next(
      new NotFoundError("Incorrect password provided!", StatusCodes.NOT_FOUND)
    );
  }

  const encryptedPassword = await encryptPassword(newPassword);
  await User.updateOne(
    { _id: userId },
    { password: encryptedPassword },
    {
      runValidators: true,
      omitUndefined: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Password changed successfully!" });
});

module.exports = { updateUser, updatePassword };
