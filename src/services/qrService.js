import QRCode from 'qrcode';
import streamifier from 'streamifier';
import { getCloudinary } from '../config/cloudinary.js';

export const generateQrAndUpload = async (qrToken) => {
  const cloudinary = getCloudinary(); // 🔥 IMPORTANT

  const qrUrl = `${process.env.FRONTEND_URL}/scan/${qrToken}`;

  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 500,
    margin: 2,
  });

  const uploadResponse = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'vehicle-qrs',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(qrBuffer).pipe(stream);
  });

  return {
    qrImage: uploadResponse.secure_url,
    qrPublicId: uploadResponse.public_id,
    qrScanUrl: qrUrl,
  };
};
// import QRCode from 'qrcode';
// import streamifier from 'streamifier';

// import cloudinary from '../config/cloudinary.js';
// console.log("QR SERVICE CLOUDINARY CHECK:", {
//     cloud: process.env.CLOUDINARY_CLOUD_NAME,
//     key: process.env.CLOUDINARY_API_KEY,
//     secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
//   });
// export const generateQrAndUpload = async (qrToken) => {
//     console.log("QR SERVICE CLOUDINARY CHECK:", {
//         cloud: process.env.CLOUDINARY_CLOUD_NAME,
//         key: process.env.CLOUDINARY_API_KEY,
//         secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
//       });
//   // frontend scan url
//   const qrUrl = `${process.env.FRONTEND_URL}/scan/${qrToken}`;

//   // generate qr buffer
//   const qrBuffer = await QRCode.toBuffer(qrUrl, {
//     errorCorrectionLevel: 'H',
//     type: 'png',
//     width: 500,
//     margin: 2,
//   });

//   // upload buffer using stream
//   const uploadResponse = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'vehicle-qrs',
//         resource_type: 'image',
//       },
//       (error, result) => {
//         if (error) {
//           return reject(error);
//         }

//         resolve(result);
//       }
//     );

//     streamifier.createReadStream(qrBuffer).pipe(stream);
//   });

//   return {
//     qrImage: uploadResponse.secure_url,
//     qrPublicId: uploadResponse.public_id,
//     qrScanUrl: qrUrl,
//   };
// };


// import QRCode from 'qrcode';
// import cloudinary from '../config/cloudinary.js';

// export const generateQrAndUpload = async (qrToken) => {
//   // frontend scan page
//   const qrUrl = `${process.env.FRONTEND_URL}/scan/${qrToken}`;

//   // generate qr base64
//   const qrBase64 = await QRCode.toDataURL(qrUrl, {
//     errorCorrectionLevel: 'H',
//     margin: 2,
//     width: 500,
//   });

//   // upload to cloudinary
//   const uploadResponse = await cloudinary.uploader.upload(qrBase64, {
//     folder: 'vehicle-qrs',
//   });

//   return {
//     qrImage: uploadResponse.secure_url,
//     qrScanUrl: qrUrl,
//   };
// };