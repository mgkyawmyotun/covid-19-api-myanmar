require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (token, email) => {
  const msg = {
    to: email,
    from: "k.7m8t6@gmail.com",
    subject: "Forget Password ",

    html: `<h1>Forget Password Token</h1>
    <br>
    <h3>Token will expire in 2 minute</h3>
    <h1>${token}<h1>`,
  };
  sgMail.send(msg).catch(console.log);
};
