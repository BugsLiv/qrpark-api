import Vehicle from '../models/Vehicle.js';
import asyncHandler from '../utils/asyncHandler.js';

export const scanVehicleQr = asyncHandler(async (req, res) => {
  const { qrToken } = req.params;

  const vehicle = await Vehicle.findOne({
    qrToken,
    isQrActive: true,
  }).populate(
    'owner',
    'name phone countryCode phoneVisible'
  );

  if (!vehicle) {
    res.status(404);
    throw new Error('QR code not found');
  }

  const owner = {
    name: vehicle.owner.name,
  };

  if (vehicle.owner.phoneVisible) {
    owner.phone = vehicle.owner.phone;
    owner.countryCode = vehicle.owner.countryCode;
  }

  res.status(200).json({
    success: true,

    data: {
      vehicle: {
        id: vehicle._id,
        registrationNumber:
          vehicle.registrationNumber,
        model: vehicle.model,
        vehicleMake: vehicle.vehicleMake,
        vehicleType: vehicle.vehicleType,
        vehicleColor: vehicle.vehicleColor,
        licensePlate: vehicle.licensePlate,
        year: vehicle.year,
      },

      owner,
    },
  });
});