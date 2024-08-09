const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const generateRefreshToken = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { reset } = require("nodemon");
const sendEmail = require("./emailCtrl");

//create user
const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, mobile } = req.body;

    // Check if all required fields are provided
    if (
      !email ||
      !req.body.lastname ||
      !req.body.mobile ||
      !req.body.password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields (lastname, email, mobile, password) are required.",
      });
    }
    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid mobile number",
      });
    }

    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      // Create a new user
      const newUser = await User.create(req.body);
      res.status(201).json({
        success: true,
        message: "Registered successfully.",
      });
    } else {
      // User already exists
      res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      return res.status(400).json({
        success: false,
        message: `User with this ${duplicateField}: ${duplicateValue} already exists.`,
      });
    }

    // Handle any other errors
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
});

//login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  //check if user exist or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  //check if user exist or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("Please Refresh Token in cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("Invalid refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with the refresh token");
    }
    const accesToken = generateToken(user._id);
    res.json({
      accesToken,
    });
  });
});

//Logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

//update a user
const updatedauser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateduser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      { new: true }
    );
    res.json(updateduser);
  } catch (error) {
    throw new Error(error);
  }
});

//save user address

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateduser = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body?.address,
      },
      { new: true }
    );
    res.json(updateduser);
  } catch (error) {
    throw new Error(error);
  }
});

//get all users
const getalluser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (eroor) {
    throw new Error(eroor);
  }
});

//get a single user
const getauser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json(getaUser);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a user
const deleteauser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json(deleteaUser);
  } catch (error) {
    throw new Error(error);
  }
});

//bock a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
//unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      {
        new: true,
      }
    );
    res.json({
      message: "User unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
//update password
const updatePassword = asyncHandler(async (req, res) => {
  console.log("test");
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

//generate password reset token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found with this email" });
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `http://localhost:5173/reset-password?token=${token}`;
    const data = {
      to: email,
      text: "Hey User, Please click on the link to reset your password.",
      subject: "Password Reset Link",
      htm: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #000000;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background-color: #f9cc47;
      padding: 10px;
      text-align: center;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .header h1 {
      margin: 0;
      color: #000000;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .content a {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #f9cc47;
      color: #000000;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi,</p>
      <p>You requested a password reset for your account. Please click the button below to reset your password. This link is valid for 10 minutes.</p>
      <a href=${resetURL}>Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    await sendEmail(data);
    console.log("Reset Token:", token);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message:
        "There was a problem sending the password reset email. Please try again later.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token received from params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the hashed token and a valid expiration date
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or has expired. Please try again.",
      });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while resetting the password.",
    });
  }
});

//add to wishlist
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//user cart functionality

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    let products = [];
    const user = await User.findById(_id);

    // Check if the user already has a cart
    let existingCart = await Cart.findOne({ orderby: user._id });

    if (existingCart) {
      // Update the existing cart
      for (let item of cart) {
        let existingProduct = existingCart.products.find(
          (p) => p.product.toString() === item._id
        );
        if (existingProduct) {
          // If product exists in the cart, update the count
          existingProduct.count += item.count;
        } else {
          // If product does not exist, add it to the cart
          let product = await Product.findById(item._id).select("price");
          existingCart.products.push({
            product: item._id,
            count: item.count,
            color: item.color,
            price: product.price,
          });
        }
      }

      // Recalculate the cart total
      existingCart.cartTotal = existingCart.products.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );

      // Save the updated cart
      await existingCart.save();
    } else {
      // If no cart exists, create a new one
      products = await Promise.all(
        cart.map(async (item) => {
          let product = await Product.findById(item._id).select("price");
          return {
            product: item._id,
            count: item.count,
            color: item.color,
            price: product.price,
          };
        })
      );

      let cartTotal = products.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );

      existingCart = await new Cart({
        products,
        cartTotal,
        orderby: user._id,
      }).save();
    }

    // Populate the product details before sending the response
    await existingCart.populate("products.product");

    // Update the user's cart reference
    user.cart = existingCart._id;
    await user.save();

    res.json(existingCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    let cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    if (!cart) {
      // If no cart exists for the user, return an empty cart structure
      cart = {
        products: [],
        cartTotal: 0,
        totalAfterDiscount: 0,
        orderby: _id,
      };
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete product from Cart
const deleteProductFromCart = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  console.log(productId + " deleted");
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    // Find the cart of the user
    let existingCart = await Cart.findOne({ orderby: _id });

    if (!existingCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product to remove
    const productIndex = existingCart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    existingCart.products.splice(productIndex, 1);

    // Recalculate the cart total
    existingCart.cartTotal = existingCart.products.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Save the updated cart
    await existingCart.save();

    // Populate the product details before sending the response
    await existingCart.populate("products.product");

    res.json(existingCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//empty cart functionality
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderby: user._id });
    if (!cart) {
      throw new Error("Cart not found for this user");
    }
    user.cart = null;
    await user.save();
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCouon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon == null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

//create order

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

//Get order
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

//update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getalluser,
  getauser,
  deleteauser,
  updatedauser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  deleteProductFromCart,
  emptyCart,
  applyCouon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
