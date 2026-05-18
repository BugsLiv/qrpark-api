// controllers/messageController.js

import Message from '../models/Message.js';
import Vehicle from '../models/Vehicle.js';
import asyncHandler from '../utils/asyncHandler.js';

export const sendMessageToVehicleOwner = asyncHandler(
  async (req, res) => {
    const { vehicleId, receiverId, message, senderName } =
      req.body;

    if (!message) {
      res.status(400);
      throw new Error('Message is required');
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }

    const newMessage = await Message.create({
      sender: req.user?._id || null,
      receiver: vehicle.owner,
      vehicle: vehicleId,
      message,
      senderName: senderName || 'Anonymous',
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  }
);

export const getMyMessages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  
    const limit = parseInt(req.query.limit) || 10;
  
    const skip = (page - 1) * limit;
  
    const filter = {
      receiver: req.user.id,
    };
  
    const total = await Message.countDocuments(filter);
  
    const messages = await Message.find(filter)
      .populate(
        'vehicle',
        'registrationNumber vehicleMake model licensePlate'
      )
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
  
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });