const Mailjet = require("node-mailjet");

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY,
  apiSecret: process.env.MJ_APIKEY_SECRET,
});

const from = {
  email: "atele699@gmail.com",
  name: "Android Tele",
};

const getMailTemplate = (mailType, mailBodyLinks) => {
  const { token } = mailBodyLinks;
  const mailTemplates = {
    accountVerification: {
      subject: "Verify Your Email",
      body: `
      <h3>Email Verification Required</h3>
      <p>You have successfully created an Account.</p>
      <p>Click this <a href="http://localhost:3000/auth/signup/verify/${token}">Verify</a> to verify your account.</p>
      `,
    },
    accountVerificationSuccessfull: {
      subject: "Email verification successfull",
      body: `
      <h3>Email Verification Successfully</h3>
      <p>Enjoy our services.</p>
      `,
    },
    passwordReset: {
      subject: "Reset Password",
      body: `
    <h3>You requested a Password Reset</h3>
    <p>Click the link below to reset your password.</p>
    <p><a href="http://localhost:3000/auth/resetPassword/${token}">Reset Password</a></p>`,
    },
    passwordResetSuccessfull: {
      subject: "Password Reset Successfully",
      body: `<h3>Your password reset is successfull.</h3>`,
    },
  };
  return mailTemplates[mailType];
};

const sendMail = async (toEmail, toName, mailType, mailBodyLinks) => {
  try {
    const { subject, body } = getMailTemplate(mailType, mailBodyLinks);
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: `${from.email}`,
            Name: `${from.name}`,
          },
          To: [
            {
              Email: `${toEmail}`,
              Name: `${toName}`,
            },
          ],
          Subject: `${subject}`,
          HTMLPart: `${body}`,
        },
      ],
    });
    console.log(request.response.status);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { mailjet, sendMail };
