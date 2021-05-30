const nodemailer = require("nodemailer");

const {
  EMAIL_TYPE,
  EMAIL_USER,
  EMAIL_PASS,
  FRONTEND_URI,
} = require("../config/keys");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendMail = async (to, subject, data, type) => {
  let htmlBody;
  switch (type) {
    case EMAIL_TYPE.VERIFY_USER:
      htmlBody = `<b><a href="${FRONTEND_URI}/verify/${data}">Click here to verify</a></b>`;
      break;
    case EMAIL_TYPE.RESET_PASS:
      htmlBody = `<b>New password: ${data}</b>`;
    default:
      htmlBody = data;
      break;
    //   return;
  }

  const emailContent = {
    // from: "Support@manuci.tk",
    to,
    subject,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(emailContent);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendMail,
};
