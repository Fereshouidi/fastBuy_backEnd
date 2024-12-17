
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();


router.post('/send/activationToken', async(req, res) => {
  const {email, username, companyEmail, companyPassword, activeLanguage, activationToken} = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: companyEmail,
      pass: companyPassword,
    },
});
  
  try {
    const activationLink = `https://fast-buy-back-end.vercel.app/api/account/verification?token=${activationToken}`; 

    const mailOptions_english = {
        from: companyEmail,
        to: email,
        subject: 'Account Activation',
        html: `
          <h1>Hello, ${username}</h1>
          <p>Click the link below to activate your account:</p>
          <a href="${activationLink}">${activationLink}</a>
        `,
    };
    const mailOptions_arabic = {
      from: companyEmail,
      to: email,
      subject: 'تفعيل الحساب',
      html: `
        <h1>مرحباً، ${username}</h1>
        <p>اضغط على الرابط أدناه لتفعيل حسابك:</p>
        <a href="${activationLink}">${activationLink}</a>
      `,
    };

    if (activeLanguage === 'english') {
      await transporter.sendMail(mailOptions_english);
    } else if (activeLanguage === 'arabic') {
      await transporter.sendMail(mailOptions_arabic);
    }


    console.log(email, username, companyEmail, companyPassword, activeLanguage, activationToken);


    res.status(200).json({message: 'Activation email sent successfully!'});

  } catch (err) {
    res.status(500).json({message: 'Error sending activation email:', err})
    console.log(err);
    
  }
})

module.exports = router;