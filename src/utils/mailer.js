import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendTicketConfirmationEmail = async (userEmail, userName, eventTitle, reservationCode, quantity) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: userEmail,
      subject: `Confirmación de Inscripción - ${eventTitle}`,
      html: `
        <h2>¡Hola, ${userName}!</h2>
        <p>Tu inscripción al evento <strong>${eventTitle}</strong> ha sido confirmada con éxito.</p>
        <ul>
          <li><strong>Código de Reserva:</strong> ${reservationCode}</li>
          <li><strong>Cupos reservados:</strong> ${quantity}</li>
        </ul>
        <p>¡Gracias por participar!</p>
      `
    });
  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
  }
};