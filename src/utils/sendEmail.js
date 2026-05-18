import nodemailer from 'nodemailer';
console.log('HOST:', process.env.EMAIL_HOST);
console.log('PORT:', process.env.EMAIL_PORT);
console.log('USER:', process.env.EMAIL_USER);

export const sendOtpEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        //   service: 'gmail', // or your SMTP provider
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
          },
        });
        
  await transporter.sendMail({
    from: `"QR Park" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Your Login OTP',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>QR Park Login</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:8px;color:#00796b">${otp}</h1>
        <p>This code expires in <strong>3 minutes</strong>.</p>
      </div>
    `,
  });
};