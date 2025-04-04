import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});

const sendEmail = async (to, subject,html) => {
  try {
      const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use 587 instead of 465
      secure: true, // false for STARTTLS (recommended)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const mailOptions = {
      from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
      to,
      subject,
      html
    };
  
    await transporter.sendMail(mailOptions);
    return true;
  } catch(error){
      return res.status(500).json({message : "error sending mail"});
  }
}

export default sendEmail;
