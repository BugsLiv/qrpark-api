import Vehicle from '../models/Vehicle.js';
import asyncHandler from '../utils/asyncHandler.js';
import { nanoid } from 'nanoid';
import { generateQrAndUpload } from '../services/qrService.js';

export const createVehicle = asyncHandler(async (req, res) => {

  req.body.owner = req.user.id; 
    // generate secure token
    const qrToken = nanoid(32);

    // generate qr image
    // const { qrImage, qrScanUrl } =
    //   await generateQrAndUpload(qrToken);
    const {
      qrImage,
      qrPublicId,
      qrScanUrl,
    } = await generateQrAndUpload(qrToken);
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user.id,
      qrToken,
      qrImage,
      qrPublicId,
    });
      // const vehicle = await Vehicle.create({
      //   ...req.body,
      //   owner: req.user.id,
      //   qrToken,
      //   qrImage,
      // });
    
      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
    
        data: {
          vehicle,
          qrScanUrl,
        },
      });
  // const vehicle = await Vehicle.create(req.body);
  // res.status(201).json({
  //   success: true,
  //   message: 'Vehicle created successfully',
  //   data: vehicle,
  // });
});

export const getVehicles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = {};

  if (req.user.role !== 'admin') {
    filter.owner = req.user.id;
  }

  const total = await Vehicle.countDocuments(filter);


  let query = Vehicle.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

 
  if (req.user.role === 'admin') {
    query = query.populate('owner', 'name email');
  }

  const vehicles = await query;

  res.status(200).json({
    message: 'Vehicles fetched successfully',
    data: vehicles,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
// export const getVehicles = asyncHandler(async (req, res) => {
//   let query;
//   if (req.user.role === 'admin') {
//     query = Vehicle.find({}).populate('owner', 'name email');
//   } else {
//     query = Vehicle.find({ owner: req.user.id });
//   }
//   const vehicles = await query;
//   res.json(vehicles);
// });


export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email');
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  if (vehicle.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this vehicle');
  }
  res.status(200).json({
    message: 'Vehicles fetched successfully',
    data: vehicle,
    success: true
  });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  if (vehicle.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this vehicle');
  }
  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    message: 'Vehicles Updated successfully',
    data: vehicle,
    success: true
  });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  if (vehicle.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this vehicle');
  }
  await vehicle.deleteOne();
  res.json({ message: 'Vehicle removed' });
});