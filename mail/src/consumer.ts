import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });

    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Mail Service consumer started, listening for otp emails");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      debug: false, // set true if you need SMTP wire logs
    });

    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (verifyError:any) {
      console.error("❌ SMTP verification failed:", verifyError && verifyError.message ? verifyError.message : verifyError);
      console.error("🔧 Please check your Gmail credentials and ensure you're using an App Password (and that it's for the same account).");
      return;
    }

    channel.consume(queueName, async (msg) => {
      if (!msg) return;
      try {
        const { to, subject, body } = JSON.parse(msg.content.toString());

        const mailOptions = {
          from: process.env.SMTP_USER,
          to,
          subject,
          text: body,
          html: `<div><h3>Your OTP</h3><p>${body}</p></div>`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP mail sent to ${to}. MessageId: ${result.messageId}`);
        channel.ack(msg);
      } catch (err:any) {
        console.error("❌ Failed to send OTP:", err && err.message ? err.message : err);
        // Do not ack so message can be retried or move to DLQ depending on topology
      }
    }, { noAck: false });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await channel.close();
      await connection.close();
      transporter.close();
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Failed to start rabbitmq consumer:", error);
  }
};
