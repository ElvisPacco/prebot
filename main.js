const { Client, LocalAuth, MessageMedia }  = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fse = require('fs-extra');
const path = require ('path');
const fs = require('fs').promises;

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

// Start your client
client.initialize();

client.on('message_create', async (message) => {
    //client.sendMessage(message.from, "Vino desde: " + message.from);
    //console.log(message.body);
    if (message.from != '51958012774@c.us') {
        if (message.body.toLowerCase().includes("ping")) {
            client.sendMessage(message.from, 'pong');
        }
        if (message.body.toLowerCase().includes("hola")) {
            client.sendMessage(message.from, '¡Hola! 👋 Soy Jorge, el asistente virtual de la Dirección de Admisión - UNJBG 🤖.');
            client.sendMessage(message.from, 'Puedo responder preguntas frecuentes sobre los exámenes Fase I, Fase II, Extraordinario y Simulacro de Examen 🤓.');
        }
        if (message.body.toLowerCase().includes("chau")) {
            message.reply('Aquí estaré para ayudarte. Hasta luego');
        }
        if (message.body.includes("vacantes")) {
            client.sendMessage(message.from, 'Cuadro de vacantes 2025:\n' + 'https://admision.unjbg.edu.pe/vacantes');
        }
        if (message.body.toLowerCase().includes("resultados") && message.body.includes("https") == false) {
            client.sendMessage(message.from, 'Aquí puedes ver los resultados de los exámenes más recientes:\n' + 'https://admision.unjbg.edu.pe/resultados');
        }
        if (message.body.toLowerCase().includes("gracias")) {
            client.sendMessage(message.from, '¡Me alegra poder ayudar!🤖. Si tienes más preguntas, no dudes en contactarme');
        }
    }
});

//Enviar mensaje a un número personalizado
client.on('message_create', async (message) => {
    if (message.body.toLowerCase().includes("gestor")) {
		client.sendMessage('51930890025' + '@c.us', 'U-9467 es tu código de verificación para cambiar tu contraseña');
        client.sendMessage(message.from, 'Se acaba de enviar el código verificador al postulante');
	}
});

//Recibir y guardar archivos
client.on('message', async (msg) => {
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        // do something with the media data here
        client.sendMessage(msg.from, 'Gracias por el archivo');
        
        const mediaPath = './media'; // Directorio donde se guardará el archivo
        await fse.ensureDir(mediaPath); // Asegurarse de que el directorio exista

        const extension = media.mimetype.split('/')[1]; // Obtener la extensión del archivo
        const fileName = `${new Date().getTime()}.${extension}`; // Generar un nombre de archivo único
        const filePath = path.join(mediaPath, fileName); // Ruta completa del archivo

        // Guardar el archivo en el sistema de archivos
        await fse.writeFile(filePath, media.data, { encoding: 'base64' });
        console.log('Media saved:', filePath);
        
    }
});

client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'imagen') {
        const media = await MessageMedia.fromUrl('https://s3.sa-east-1.amazonaws.com/unjbg.admision/banners/banner_nuevas_carreras.jpg');
        await client.sendMessage(msg.from, media);
    }
    if (msg.body.toLowerCase() === 'pdf') {
        const media = await MessageMedia.fromUrl('https://admision.unjbg.edu.pe/reglamento2025-1.pdf');
        await client.sendMessage(msg.from, media);
    }
});
//Enviar multimedia (Método largo)
client.on('message', async (msg) => {
    if (msg.body === 'Dame un sticker') {

        const filePath = './media/carreras/sticker2.webp';

        // Convertir el archivo a base64
        const base64File = await fs.readFile(filePath, { encoding: 'base64' });

        // Crear el MessageMedia
        const media = new MessageMedia('image/webp', base64File, path.basename(filePath));

        // Enviar el archivo multimedia
        await client.sendMessage(msg.from, media, {sendMediaAsSticker: true});
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Dame una imagen') {
        const filePath = './media/carreras/foto-reno.jpeg';

        // Convertir el archivo a base64
        const base64File = await fs.readFile(filePath, { encoding: 'base64' });

        // Crear el MessageMedia
        const media = new MessageMedia('image/jpeg', base64File, path.basename(filePath));

        // Enviar el archivo multimedia
        await client.sendMessage(msg.from, media);
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Dame un pdf') {

        const filePath = './media/carreras/Brochure - Enfermería.pdf';

        // Convertir el archivo a base64
        const base64File = await fs.readFile(filePath, { encoding: 'base64' });

        // Crear el MessageMedia
        const media = new MessageMedia('application/pdf', base64File, path.basename(filePath));

        // Enviar el archivo multimedia
        await client.sendMessage(msg.from, media, { caption: 'Este es un PDF' });
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Dame un video') {
        await client.sendMessage(msg.from, 'Estoy preparando el video');
        const filePath = './media/carreras/dulce-carita.mp4';

        // Convertir el archivo a base64
        const base64File = await fs.readFile(filePath, { encoding: 'base64' });

        // Crear el MessageMedia
        const media = new MessageMedia('video/mp4', base64File, path.basename(filePath));

        // Enviar el archivo multimedia
        await client.sendMessage(msg.from, media);
        //await client.sendMessage('51926230680@c.us', "Se envió un archivo a un contacto");
        console.log('Media sent successfully!');
    }
    if (msg.body === 'Dame un audio') {
        await client.sendMessage(msg.from, 'Estoy preparando una música');
        //await client.sendMessage(msg.from, 'Ahora no puedo darte un audio. Te daré un PDF');
        const filePath = './media/carreras/vuelve-a-mi-lado.mp3';

        // Convertir el archivo a base64
        const base64File = await fs.readFile(filePath, { encoding: 'base64' });

        // Crear el MessageMedia
        const media = new MessageMedia('audio/mp3', base64File, path.basename(filePath));

        // Enviar el archivo multimedia
        await client.sendMessage(msg.from, media, { sendAudioAsVoice: true });
        console.log('Media sent successfully!');
    }
});

//Envío de multimedia (método sencillo)
client.on('message', async (msg) => {
    if (msg.body === 'Sticker') {
        const filePath = './media/carreras/sticker2.webp';
        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(msg.from, media, {sendMediaAsSticker: true});
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Imagen') {
        const media = MessageMedia.fromFilePath('./media/carreras/foto-reno.jpeg');
        await client.sendMessage(msg.from, media);
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Pdf') {
        const filePath = './media/carreras/Brochure - Enfermería.pdf';
        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(msg.from, media);
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Video') {
        const filePath = './media/1717367355402.mp4';
        const media = MessageMedia.fromFilePath(filePath);
        media.mimetype = "video/mp4";
        await client.sendMessage(msg.from, media, /*{sendMediaAsDocument: true}*/);
        console.log('Media sent successfully!');
    }
    if (msg.body === 'Audio') {
        const filePath = './media/carreras/vuelve-a-mi-lado.mp3';
        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(msg.from, media, /*{ sendAudioAsVoice: true }*/);
        console.log('Media sent successfully!');
    }

    if (msg.body === 'Remoto1') {
        const filePath = 'https://s3.sa-east-1.amazonaws.com/unjbg.admision/banners/banner_nuevas_carreras.jpg';
        const media = await MessageMedia.fromUrl(filePath);
        media.mimetype = "image/jpg";
        media.filename = "NuevaImagen2.jpg";
        await client.sendMessage(msg.from, media);
        console.log('Media sent successfully! ', msg.from);
    }
    if (msg.body === 'Remoto2') {
        const filePath = 'https://admision.unjbg.edu.pe/reglamento2025-1.pdf';
        const media = await MessageMedia.fromUrl(filePath);
        media.mimetype = "application/pdf";
        media.filename = "Reglamento 2025-I.pdf";
        await client.sendMessage(msg.from, media);
    }
});

// Uso con menciones
/*client.on('message', async (msg) => {
    const mentions = await msg.getMentions();
    
    for (let user of mentions) {
        console.log(`${user.pushname} fue mencionado`);
    }
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    let user = await msg.getContact();
    await chat.sendMessage(`Hola @${user.id.user}`, {
        mentions: [user]
    });

    // OR

    let userPhone = '51930890025';
    await chat.sendMessage(`Hello @${userPhone}`, {
        mentions: [userPhone + '@c.us']
    });
});
*/

//Enviar mensaje cuando alguien me escriba (como respuesta)
client.on('message_create', async (message) => {
    const chat = await message.getChat();
    if (message.from.endsWith('@g.us') && message.body.toLowerCase() === "elvis") {
        message.reply('Acá estoy, qué fueee');
	}
    //console.log(chat.name + " || Vino desde: " + message.from + " -> " + message.body);
});