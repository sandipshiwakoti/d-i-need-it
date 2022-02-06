const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/custom-error");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
  };

  if (err.code && err.code === 11000) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "This email address is already in use.",
    });
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Something went wrong" });
};

module.exports = errorHandler;
