import QRCode from 'qrcode';
import sharp from 'sharp';
import streamifier from 'streamifier';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQrAndUpload = async (qrToken) => {
  const cloudinary = getCloudinary();

  const qrUrl = `${process.env.FRONTEND_URL}/scan/${qrToken}`;
  const templatePath = path.join(
    __dirname,
    '../../public/templates/qr-park-template.png'
    
  );
  const qrSize = 390;

  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    errorCorrectionLevel: 'H',
    width: qrSize,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#0000',
    },
  });



  const finalImageBuffer = await sharp(templatePath)
    .composite([
      {
        input: qrBuffer,
        top: 217,
        left: 317,
      },
    ])
    .png()
    .toBuffer();

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

    streamifier.createReadStream(finalImageBuffer).pipe(stream);
  });

  return {
    qrImage: uploadResponse.secure_url,
    qrPublicId: uploadResponse.public_id,
    qrScanUrl: qrUrl,
  };
};
// import QRCode from 'qrcode';
// import streamifier from 'streamifier';
// import { getCloudinary } from '../config/cloudinary.js';

// export const generateQrAndUpload = async (qrToken) => {
//   const cloudinary = getCloudinary(); // 🔥 IMPORTANT

//   const qrUrl = `${process.env.FRONTEND_URL}/scan/${qrToken}`;

//   const qrBuffer = await QRCode.toBuffer(qrUrl, {
//     errorCorrectionLevel: 'H',
//     type: 'png',
//     width: 500,
//     margin: 2,
//   });

//   const uploadResponse = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'vehicle-qrs',
//         resource_type: 'image',
//       },
//       (error, result) => {
//         if (error) return reject(error);
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
