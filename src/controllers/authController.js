import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
export const registerUser = asyncHandler(async (req, res) => {
    console.log("REGISTER API HIT")
  const { name, email, phone,countryCode,role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    countryCode,
    role: role || 'user', 
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone:user.phone,
    countryCode:user.countryCode,
    role: user.role,
    token: generateToken(user._id),
  });
});
export const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
  console.log("Email",email)
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No account found with this email');
    }
  
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000); 
  
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  
    await sendOtpEmail(email, otp);
  
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  });
  
  export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    if (!user.otp || user.otp !== otp) {
      res.status(401);
      throw new Error('Invalid OTP');
    }
  
    if (user.otpExpiry < new Date()) {
      res.status(401);
      throw new Error('OTP has expired');
    }
  
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'User Login Successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        countryCode: user.countryCode,
        token: generateToken(user._id),
        phoneVisible: user.phoneVisible,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });
  });
// export const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select('+password');
//   if (!user || !(await user.matchPassword(password))) {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }

//  user.lastLogin = new Date();
//  await user.save(); 
//  res.status(201).json({
//     success: true,
//     message: 'User Login Successfully',

//     data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone:user.phone,
//         countryCode:user.countryCode,
//         token: generateToken(user._id),
//         phoneVisible:user.phoneVisible,
//         isActive:user.isActive,
//         lastLogin:user.lastLogin
//       }
//   });
// });

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

export const updateMe = asyncHandler(async (req, res) => {
    const { name, phone,countryCode, email, password, role } = req.body;
  
   
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = email;
    }
  
 
    if (name) user.name = name;
    if (phone) user.phone = phone; 
    if (countryCode) user.countryCode;
    if (role) {
      if (role !== user.role && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('You cannot change your own role');
      }
      user.role = role;
    }
  
    if (password) {
      user.password = password;
    }
  
    const updatedUser = await user.save();
    res.status(200).json({
        message: 'User Updated Successfully',
    success: true,
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            countryCode: updatedUser.countryCode,
            // role: updatedUser.role,
            // token: generateToken(updatedUser._id), 
          },
      
      })
  });

export const updatePhoneVisibility = asyncHandler(async (req, res) => {
    const { phoneVisible } = req.body;
  
    if (typeof phoneVisible !== 'boolean') {
      res.status(400);
      throw new Error('phoneVisible must be true or false');
    }
  
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    user.phoneVisible = phoneVisible;
  
    const updatedUser = await user.save();
  
    res.status(200).json({
      success: true,
      message: 'Phone visibility updated successfully',
      data: {
        _id: updatedUser._id,
        phoneVisible: updatedUser.phoneVisible,
      },
    });
  });