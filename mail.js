const sgMail = require("@sendgrid/mail");
const User = require("./models/User");

exports.sendMessage = async (username, email, message) => {
  const messages = [];
  const users = await User.find({});
  for (user of users) {
    messages.push({
      to: user.email,
      from: "k.7m8t6@gmail.com",
      subject: "User Message ",

      html: `
      <h3>Username - ${username}</h3>
      <h3>From Email - ${email} </h3>
      <br>
      <p>${message}</p>
    `,
    });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(messages).then(console.log).catch(console.log);
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
