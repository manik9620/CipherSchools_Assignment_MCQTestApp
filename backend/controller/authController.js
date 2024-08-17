const UserModel = require("../model/userModel");
const jwt=require("jsonwebtoken")

const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

const generateJWTToken = (obj) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now()/1000)+(60*60*24*7), // Date.now returns time in miliseconds from 1 Jan 1970 
      data: obj,
    },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({
        status: "fail",
        message: "Please provide name, email and password",
        data: [],
      });
      return;
    }

    const user = await getUserByEmail(email);
    if (user) {
      res.status(400).json({
        status: "fail",
        message: "User already exists",
        data: [],
      });
    }

    const newuser = await UserModel.create({ name, email, password });

    res.status(201);
    res.json({
      status: "success",
      message: "User created",
      data: {
        user: {
          _id: newuser._id,
          name:newuser.name,
          email: newuser.email,
        //   isEmailVerified: newuser.isEmailVerified,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      data: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: "fail",
        message: "Enter valid Email and password",
        data: [],
      });
      return ;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "User not found",
        data: [],
      });
      return ;
    }

    const isCorrect = await user.verifyPassword(password, user.password);
    if (!isCorrect) {
      res.status(400).json({
        status: "fail",
        message: "Invalid password",
        data: [],
      });
      return ;
    }
    res.status(200);
    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          email: user.email,
          _id: user._id,
          name: user.name,
        },
        token: generateJWTToken({
          _id: user._id,
          name:user.name,
          email: user.email,
        }),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      data: error,
    });
  }
};

module.exports = {
  signup,
  login,
};