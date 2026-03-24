const UserModel = require("../models/auth.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { setAccessCookie, setRefreshCookie, clearAuthCookies } = require("../utils/setCookie");

// controllers/auth.controller.js

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 1. Basic validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalPaswword = password.trim();
    // 🔹 2. Check if user already exists

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // 🔹 Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await UserModel.create({
      name,
      email: normalizedEmail,
      password:normalPaswword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;
    

     sendEmail(
      email,
      "Verify Your Email",
      `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      
      <h2 style="color: #333;">Verify Your Email</h2>
      
      <p style="color: #555; font-size: 14px;">
        Thanks for signing up! Please confirm your email address to activate your account.
      </p>

      <a href="${verifyLink}" 
         style="
           display: inline-block;
           margin-top: 20px;
           padding: 12px 20px;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
        Verify Email
      </a>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        This link will expire in 1 hour.
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        If you didn’t create an account, you can safely ignore this email.
      </p>

    </div>
  </div>
  `)
    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account."
    });


  } catch (error) {
    if (error.code === 11000 || error?.cause?.code === 11000) {

      const key = error.keyValue || error.cause.keyValue;
      const field = Object.keys(key)[0];

      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // mongoose validation errors
    if (error.name === "ValidationError") {

      const errors = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        success: false,
        errors
      });
    }

    console.error("Register Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔹 1. Normalize input
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // 🔹 2. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // 🔹 3. Find user (password include karna hai)
    const user = await UserModel.findOne({ email }).select("+password");

    // 🔹 4. Generic error (security)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 🔹 5. Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 🔹 6. Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    // 🔹 7. Generate JWT
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    // 🔹 9. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const user = await UserModel.findOne({ refreshToken });

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const getMe = async (req, res) => {
  try {
    // 🔹 1. Check req.user
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in request"
      });
    }

    // 🔹 2. Fetch user from DB
    const user = await UserModel.findById(req.user.id).select("-password");

    // 🔹 3. If user not found (deleted or invalid)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔹 4. Success response
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        providers: user.providers,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("GetMe Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    let { email } = req.body;

    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified"
      });
    }

    // 🔹 New token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;

    const emailSent = await sendEmail(
      email,
      "Verify Your Email",
      `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      
      <h2 style="color: #333;">Verify Your Email</h2>
      
      <p style="color: #555; font-size: 14px;">
        Thanks for signing up! Please confirm your email address to activate your account.
      </p>

      <a href="${verifyLink}" 
         style="
           display: inline-block;
           margin-top: 20px;
           padding: 12px 20px;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
        Verify Email
      </a>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        This link will expire in 1 hour.
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        If you didn’t create an account, you can safely ignore this email.
      </p>

    </div>
  </div>
  `
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email"
      });
    }
    res.json({
      success: true,
      message: "Verification email resent"
    });

  } catch (error) {
    console.error("Resend Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const refreshAccessToken = async (req, res) => {
  try {
    const incomingToken = req.cookies?.refreshToken;

    if (!incomingToken) {
      return res.status(403).json({
        success: false,
        message: "No refresh token"
      });
    }

    // 🔹 1. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(incomingToken, process.env.REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    // 🔹 2. Get user
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔥 3. TOKEN REUSE DETECTION (VERY IMPORTANT)
    if (user.refreshToken !== incomingToken) {
      // 💥 possible token theft
      user.refreshToken = null;
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Refresh token reuse detected. Please login again."
      });
    }

    // 🔥 4. Generate NEW tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // 🔹 5. Save new refresh token (old invalid)
    user.refreshToken = newRefreshToken;
    await user.save();

    // 🔹 6. Set cookies
    setAccessCookie(res, newAccessToken);
    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed"
    });

  } catch (error) {
    console.error("Refresh Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
module.exports = { registerUser, loginUser, verifyEmail, resendVerification, logoutUser, getMe, refreshAccessToken };