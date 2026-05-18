import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Please add Registration Number'],
      trim: true,
      unique: true,

    },
    model: {
      type: String,
      required: [true, 'Please add model'],
    },
    vehicleMake: {
      type: String,
      required: [true, 'Please add Vehicle Make'],
    },
    vehicleType: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,   
    },
    vehicleColor: {
      type: String,
      required: [true, 'Please add Vehicle Color'],
    },
    year: {
      type: Number,
      min: 1886,
      max: new Date().getFullYear() + 1,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    qrImage: {
      type: String,
      default: null,
    },

    isQrActive: {
      type: Boolean,
      default: true,
    },
    qrPublicId: {
      type: String,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;