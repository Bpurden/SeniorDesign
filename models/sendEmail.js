const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
      name: 'gmail',
			service: 'gmail',
			auth: {
        user: 'peostrisd@gmail.com',
        pass: 'Seniordesign1'
			},
		});

		await transporter.sendMail({
			from: 'peostrisd@gmail.com',
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
