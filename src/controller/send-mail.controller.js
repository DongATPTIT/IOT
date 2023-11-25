const express = require('express');
const routers = express.Router();
const nodemailer = require('nodemailer');
const { getListUser, getDataSensor } = require('../service/user.service');

	
const sendMail = (db) =>{
  	
// const  transport = nodemailer.createTransport({smtpOptions});
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: false,
    auth: {
      user: 'namnguyen105202@gmail.com',
      pass: 'qgwt sxsc gxng zlx a',
    },
    service: 'gmail',
    secure: false, // STARTTLS
  });
  
    routers.post('/send-password', async (req, res) => {  
      const query = await getDataSensor();
      const sensor = query[0];
      try {
        const email = req.body.email;
        console.log(req.body)
        await transporter.sendMail({
          to: email,
          from: 'namnguyen105202@gmail.com',
          subject: 'Thời tiết hôm nay',
          text: `Thời tiết Hà Nội: \n
                Dữ liệu từ ${sensor.device_id},\n
                Nhiệt độ: ${sensor.humidity}, \n
                Độ ẩm: ${sensor.temperature} \n
           `,
        });
    
        res.json({ success: true, message: 'Email sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending email' });
      }
    });
    return routers;
}
module.exports = sendMail;