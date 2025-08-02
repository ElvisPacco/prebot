const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('../client'));

const client = new Client();
client.on('qr', qr => {
  console.log('Escanea este código QR:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp está listo');
});

client.initialize();

// Endpoint para enviar mensaje
app.get('/enviar', (req, res) => {
  const numero = req.query.numero;
  const mensaje = req.query.mensaje;

  client.sendMessage(numero + '@c.us', mensaje)
    .then(response => res.send('Mensaje enviado'))
    .catch(err => res.status(500).send('Error: ' + err));
});

app.listen(3000, () => {
  console.log('Servidor web en http://localhost:3000');
});
