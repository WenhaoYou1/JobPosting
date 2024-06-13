const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.find({ _id: decoded.id }).select("-password");

      if (!user) {
        return res.status(400).json({ error: "Unauthorized, Invalid Token" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized, Access Denied" });
  }
};
