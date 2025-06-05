const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function enviarEmail(destinatario, kwh) {
  const credito = (kwh * 0.15).toFixed(2);

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: destinatario,
    subject: 'Créditos de energia',
    text:'Você produziu ${kwh} kWh este mês. Crédito acumulado: ${credito}€'
  });

  console.log( 'Email enviado para ${destinatario}');
}

module.exports = { enviarEmail };