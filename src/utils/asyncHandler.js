const AsyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
};

export { AsyncHandler };

// const AsyncHandler = () => {}. It is a high order function.
// const AsyncHandler = (fn) => {}. So it will get a function in parameter.
// const AsyncHandler = (fn) => async () => {}. As well as it will return a function.

/*
const AsyncHandler = (fn) => async (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};
*/
