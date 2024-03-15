const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const { promisify } = require('util');
const fs = require('fs');

// Function to read the HTML template file
const readHTMLTemplate = async (templatePath) => {
  try {
    const readFileAsync = promisify(fs.readFile);
    const templateContent = await readFileAsync(templatePath, 'utf8');
    return templateContent;
  } catch (error) {
    console.error(`Error reading HTML template at path ${templatePath}: ${error.message}`);
    throw new Error(`Error reading HTML template at path ${templatePath}: ${error.message}`);
  }
};

module.exports = async (email, subject, url) => {
  try {

    // Read the HTML template file
    const templatePath = './verifyEmailTemplate.html';
    const htmlTemplate = await readHTMLTemplate(templatePath);

    // Compile the template using Handlebars
    const compiledTemplate = handlebars.compile(htmlTemplate);

    const htmlContent = compiledTemplate({
      user: { name: User.name, email: User.email },
      url,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })
    
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlContent,
    })
    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};