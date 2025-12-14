// const nodemailer = require("nodemailer");
// const path = require("path");

// const sendEmail = async (
//   subject,
//   send_to,
//   sent_from,
//   reply_to,
//   template,
//   name,
//   link,
//   amount,
//   status,
//   transactionId,
//   plan,
//   startDate,
//   kycStatus,
//   message,
//   userId
// ) => {
//   try {
//     // Dynamically import nodemailer-express-handlebars
//     const hbs = (await import("nodemailer-express-handlebars")).default;
//     const Handlebars = (await import("handlebars")).default;

//     // Register the `eq` helper globally
//     Handlebars.registerHelper("eq", (a, b) => a === b);

//     // Create Email Transporter
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       timeout: 30000,
//       // Add these headers
//       headers: {
//         "X-Priority": "1",
//         "X-MSMail-Priority": "High",
//         Importance: "high",
//       },
//     });

//     const handlebarOptions = {
//       viewEngine: {
//         extName: ".handlebars",
//         partialsDir: path.resolve("./views"),
//         defaultLayout: false,
//         helpers: {
//           eq: (a, b) => a === b,
//         },
//       },
//       viewPath: path.resolve("./views"),
//       extName: ".handlebars",
//     };

//     transporter.use("compile", hbs(handlebarOptions));

//     // Build email context dynamically
//     const context = {
//       name,
//       link,
//       amount,
//       status,
//       transactionId,
//       plan,
//       startDate,
//       kycStatus,
//     };

//     // Only add `message` if template is 'custom'
//     if (template === "custom" && message) {
//       context.message = message;
//     }

//     // Options for sending email
//     const options = {
//       from: `"Credible Investment Experts" <${sent_from}>`,
//       to: send_to,
//       replyTo: reply_to,
//       subject,
//       template,
//       context,
//       headers: {
//         "X-Entity-Ref-ID": userId ? userId.toString() : "system",
//         "List-Unsubscribe": `<mailto:unsubscribe@credibleinvestmentexperts.com>`,
//       },
//       priority: "high",
//     };

//     // Send Email
//     const emailResponse = await transporter.sendMail(options);
//     console.log(emailResponse);

//     return emailResponse;
//   } catch (err) {
//     console.error("Email sending error:", err);
//     throw new Error(err.message || "Something went wrong");
//   }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  name,
  link,
  amount,
  status,
  transactionId,
  plan,
  startDate,
  kycStatus,
  message,
  userId
) => {
  try {
    // Dynamically import nodemailer-express-handlebars
    const hbs = (await import("nodemailer-express-handlebars")).default;
    const Handlebars = (await import("handlebars")).default;

    // Register the `eq` helper globally
    Handlebars.registerHelper("eq", (a, b) => a === b);

    // Create Email Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      timeout: 60000, // Increased from 30000
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./views"),
        defaultLayout: false,
        helpers: {
          eq: (a, b) => a === b,
        },
      },
      viewPath: path.resolve("./views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    // Build email context dynamically
    const context = {
      name,
      link,
      amount,
      status,
      transactionId,
      plan,
      startDate,
      kycStatus,
    };

    // Only add `message` if template is 'custom'
    if (template === "custom" && message) {
      context.message = message;
    }

    // Generate plain text version based on template
    const plainText = generatePlainText(template, context);

    // Options for sending email
    const options = {
      from: `"Credible Investment Experts" <${sent_from}>`,
      to: send_to,
      replyTo: reply_to,
      subject,
      template,
      context,
      text: plainText, // CRITICAL: Add plain text version
      headers: {
        'X-Mailer': 'CredibleInvestmentExperts Mailer',
        'List-Unsubscribe': `<mailto:unsubscribe@credibleinvestmentexperts.com>`,
        'Precedence': 'bulk',
      },
    };

    // Only add userId header if provided
    if (userId) {
      options.headers['X-Entity-Ref-ID'] = userId.toString();
    }

    // Send Email
    const emailResponse = await transporter.sendMail(options);
    console.log("Email sent successfully:", emailResponse.messageId);

    return emailResponse;
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error(err.message || "Something went wrong");
  }
};

// Helper function to generate plain text versions
const generatePlainText = (template, context) => {
  const { name, link, amount, status, transactionId, plan, startDate, kycStatus, message } = context;

  switch (template) {
    case 'verifyEmail':
      return `
Hello ${name},

We sincerely appreciate you choosing CredibleInvestmentExperts as your partner on the path to financial growth and success.

To help you get started, please verify your account using the link below:

${link}

This link is valid for 1 hour.

If you did not create an account with us, please ignore this email.

Regards,
CredibleInvestmentExperts Team

---
If you have any questions, contact us at invest@credibleinvestmentexperts.com
To unsubscribe, email: unsubscribe@credibleinvestmentexperts.com
      `.trim();

    case 'resetPassword':
      return `
Hello ${name},

We received a request to reset your password for your CredibleInvestmentExperts account.

Click the link below to reset your password:

${link}

This link is valid for 1 hour.

If you did not request a password reset, please ignore this email and your password will remain unchanged.

Regards,
CredibleInvestmentExperts Team
      `.trim();

    case 'depositApproval':
      return `
Hello ${name},

Your deposit has been ${status}.

Transaction Details:
- Amount: $${amount}
- Transaction ID: ${transactionId}
- Status: ${status}

Thank you for choosing CredibleInvestmentExperts.

Regards,
CredibleInvestmentExperts Team
      `.trim();

    case 'withdrawalApproval':
      return `
Hello ${name},

Your withdrawal request has been ${status}.

Transaction Details:
- Amount: $${amount}
- Transaction ID: ${transactionId}
- Status: ${status}

Thank you for choosing CredibleInvestmentExperts.

Regards,
CredibleInvestmentExperts Team
      `.trim();

    case 'investmentApproval':
      return `
Hello ${name},

Your investment has been ${status}.

Investment Details:
- Plan: ${plan}
- Amount: $${amount}
- Start Date: ${startDate}
- Status: ${status}

Thank you for investing with CredibleInvestmentExperts.

Regards,
CredibleInvestmentExperts Team
      `.trim();

    case 'kycApproval':
      return `
Hello ${name},

Your KYC verification status has been updated to: ${kycStatus}

${kycStatus === 'Approved' 
  ? 'Congratulations! Your account has been fully verified. You can now access all features.' 
  : 'Please check your account for more details or contact support if you have questions.'}

Regards,
CredibleInvestmentExperts Team
      `.trim();

    case 'custom':
      return `
Hello ${name},

${message || ''}

Regards,
CredibleInvestmentExperts Team
      `.trim();

    default:
      return `
Hello ${name},

Thank you for being a valued member of CredibleInvestmentExperts.

${link ? `Visit: ${link}` : ''}

Regards,
CredibleInvestmentExperts Team
      `.trim();
  }
};

module.exports = sendEmail;