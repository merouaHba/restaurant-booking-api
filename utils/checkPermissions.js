const CustomError = require('../errors');

const checkPermissions = (id,user) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (user.role === 'admin') return;
  if (user._id.toString() === id) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermissions;
