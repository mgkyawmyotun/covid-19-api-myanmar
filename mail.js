const sgMail = require("@sendgrid/mail");

exports.sendMessage = (username, message) => {
  const msg = {
    to: "kyawmyotun472001@gmail.com",
    from: "k.7m8t6@gmail.com",
    subject: "User Message ",

    html: `
    <h1>Username - ${username}</h1>
    <br>
    <p>${message}</p>
  `,
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg).catch(console.log);
};
exports.sendForgetToken = (token, email) => {
  const msg = {
    to: email,
    from: "k.7m8t6@gmail.com",
    subject: "Forget Password ",

    html: `<h1>Forget Password Token</h1>
    <br>
    <h3>Token will expire in 2 minute</h3>
    <h1>${token}<h1>`,
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg).catch(console.log);
};
