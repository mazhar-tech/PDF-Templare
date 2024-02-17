export const TicketTypes = {
  DEAL: 'DEAL',
  CURLING_TRACK: 'CURLING_TRACK',
  PRODUCT: 'PRODUCT',
  CUSTOM_DEAL: 'CUSTOM_DEAL',
  CURLING: 'Curling'
}

import moment from 'moment'
import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import PDFDocument from 'pdfkit'
import * as fs from 'fs/promises'

const data = { "ticketCode": "12411212234274005408", "qrCodeUrl": null, "customerName": "Naeem Hassan", "ticketName": " Test Ticket", "variantName": "Kids 1", "duration": "-- --", "purchasedAt": "2023-11-24T21:19:24.784Z", "validFrom": "2023-11-24", "validTo": "2023-11-30", "fileName": "uploads/12411212234274005408.pdf", "unitPrice": "€ 5,00", "totalPrice": "€ 5,00", "qrCodeImagePath": "uploads/12411212234274005408.png", "type": "DEAL", "products": [{ "id": "133", "createdBy": null, "isDeleted": false, "isActive": true, "isExpired": false, "createdAt": "2023-11-24T16:27:39.405Z", "updatedAt": "2023-11-24T16:27:39.405Z", "name": "Entree schaatsbaan", "message": null, "quantity": "2", "isOptional": true, "product": { "id": "42", "createdBy": null, "isDeleted": false, "isActive": true, "isExpired": false, "createdAt": "2023-10-27T14:46:56.564Z", "updatedAt": "2023-11-20T23:09:23.000Z", "title": "Entree schaatsbaan", "position": "1", "description": "2 uur schaatsplezier! ", "overview": "De overdekte schaatsbaan is een plek waar plezier, gezelligheid en winterse magie samenkomen. Je kan zelfs onder een kleine replica van de Sint-Servaasbrug door schaatsen. Nog niet zo zeker op het ijs? Maak dan gebruik van handige hulpmiddelen en krijg het snel onder de knie.\\n\\nGedurende twee uur heb je toegang tot de schaatsbaan. De tijd start vanaf het moment dat je voor het eerst de schaatsbaan op gaat. Geen zorgen, je kan tussendoor de schaatsbaan verlaten voor een lekker drankje in ons Schaatscafé of Grand Café, gelegen aan de schaatsbaan. \\n\\nHandschoenen zijn verplicht, voor je eigen veiligheid. Vergeet niet je schaatshuur aan je winkelmandje toe te voegen! ;-) ", "images": ["https://trichter-webshop.s3.amazonaws.com/3cb0a5e6-432c-455c-ad1c-d77e43cdf1fb.jpg", "https://trichter-webshop.s3.amazonaws.com/63e222a6-ad30-4d22-bec2-e8958bb1ca86.jpg", "https://trichter-webshop.s3.amazonaws.com/7766959e-7a3e-414c-8ecd-863dfb1c50e0.jpg"], "hasComplimentaryTickets": false, "hidePrice": true, "hasTimeDuration": true, "timeDurationUnit": "uur", "timeDurationValue": "2", "availableStartDate": "2023-10-27", "availableEndDate": "2023-12-31", "availableStock": "5000", "status": "ARCHIVED", "isEnabled": false, "activeFrom": "2023-11-12", "customerTypes": [] } }, { "id": "134", "createdBy": null, "isDeleted": false, "isActive": true, "isExpired": false, "createdAt": "2023-11-24T16:27:39.406Z", "updatedAt": "2023-11-24T16:27:39.406Z", "name": "Drinks", "message": "", "quantity": "5", "isOptional": true, "product": null }] }

const genTicket = async () => {
  const staticImages = {
    backgroundImage: await fs.readFile('static/ticket-background.png'),
    partnerImage: await fs.readFile('static/partner.png'),
    logoImage: await fs.readFile('static/magish-logo.PNG'),
    Logo: await fs.readFile('static/Logo.png'),
    main: await fs.readFile('static/main.png'),
    Logo1: await fs.readFile('static/Logo1.png'),
    banner: await fs.readFile('static/banner.png')
  }

  generatePDFTicketV1(data, null, staticImages);
}

genTicket();

export async function generatePDFTicketV1(data: any, s3Service: any, staticImages: any) {
  console.log({ data: JSON.stringify(data) });
  return new Promise(async (resolve, reject) => {
    const { ticketCode, ticketName, validFrom, validTo, fileName, quantity = 1, unitPrice, totalPrice, qrCodeImagePath, type, variantName, products } = data || {}
    const doc = new PDFDocument({ size: [595, 842] })

    const stream = createWriteStream(fileName)

    doc.pipe(stream)

    doc.font('Helvetica')
    doc.roundedRect(20, 200, 250, 20)

    doc.image(staticImages?.Logo1, 0, 0, { width: 595, height: 50 })
    doc.image(staticImages?.banner, 0, 50, { width: 595, height: 160 })

    doc.image(await readFile(qrCodeImagePath), 17, 220, {
      width: 180,
      height: 168
    })

    doc.fillColor('#152955').fontSize(16).text(`Ticket Code:${ticketCode}`, 210, 227, {
      width: 335,
      height: 19
    })

    const link = 'https://www.magischmaastrichtvrijthof.nl/plan-je-bezoek'

    doc.fillColor('#102DC5').fontSize(14).text('Plan je bezoek', 210, 255, { width: 336 })
    doc
      .fillColor('#2F2F2F')
      .fontSize(14)
      .underline(210, 255, doc.widthOfString('Plan je bezoek'), doc.heightOfString('Plan je bezoek'))
      .link(210, 255, doc.widthOfString('Plan je bezoek'), doc.heightOfString('Plan je bezoek'), link)

    // doc.fillColor('#102DC5').fontSize(14).link(240, 287, doc.widthOfString(link), doc.heightOfString(link), link).text(link, 240, 287, {
    //   width: 336,
    //   height: 60
    // })
    doc.fillColor('#2F2F2F').fontSize(14).text('Volg ons', 210, 285, { width: 336, height: 40 })

    doc.fillColor('#102DC5').text('Facebook', 231, 305)
    doc.fillColor('#102DC5').text('Instagram', 330, 305)

    doc
      .fillColor('#2F2F2F')
      .fontSize(14)
      .underline(232, 305, doc.widthOfString('Facebook'), doc.heightOfString('Facebook'))
      .link(232, 305, doc.widthOfString('Facebook'), doc.heightOfString('Facebook'), 'https://www.facebook.com/MagischMaastrichtVrijthof2023')
      .underline(330, 305, doc.widthOfString('Instagram'), doc.heightOfString('Instagram'))
      .link(330, 305, doc.widthOfString('Instagram'), doc.heightOfString('Instagram'), 'https://www.instagram.com/MagischMaastrichtVrijthof')
      .text('Op                 en/of                  en blijf op de hoogte!', 210, 305, {
        width: 336,
        height: 40
      })

    doc.fillColor('#2F2F2F').fontSize(14).text('Onze Algemene Voorwaarden zijn van toepassing Op dit E-Ticket. Deze QR-code is uniek, kopiëren heeft dus geen zin.', 210, 330, { width: 335, height: 60 })
    doc
      .fillColor('#2F2F2F')
      .fontSize(14)
      .text('Tijdens jouw bezoek aan Magisch Maastricht Vrijthof laat je eenvoudig je QR-code scannen bij een van de horecapunten en/of attracties.Wij denken graag duurzaam en daarom is het niet nodig om jouw e-ticket te printen.', 20, 392, { width: 555, height: 60 })

    doc.fillColor('#102DC5').text('vragen@magischmaastrichtvrijthof.nl.', 150, 463)

    doc
      .fillColor('#102DC5')
      .text('veelgestelde vragen', 130, 447)
      .underline(130, 447, doc.widthOfString('veelgestelde vragen'), doc.heightOfString('veelgestelde vragen'))
      .link(130, 447, doc.widthOfString('veelgestelde vragen'), doc.heightOfString('veelgestelde vragen'), 'https://www.magischmaastrichtvrijthof.nl/veelgestelde-vragen')
      .underline(150, 462, doc.widthOfString('vragen@magischmaastrichtvrijthof.nl.'), doc.heightOfString('vragen@magischmaastrichtvrijthof.nl.'))
      .link(150, 462, doc.widthOfString('vragen@magischmaastrichtvrijthof.nl.'), doc.heightOfString('vragen@magischmaastrichtvrijthof.nl.'), 'vragen@magischmaastrichtvrijthof.nl')

    doc.fillColor('#2F2F2F').fontSize(14).text('Vragen bekijk de                                  op onze website. Staat jouw vraag er niet bij, stuur dan een e-mail naar ', 20, 447, { width: 555, height: 60 })

    doc.rect(0, 663, 595, 240).fillAndStroke('#F5F5F5')
    doc.fillColor('#7F7F7F').fontSize(12).text('PRODUCT NAME', 20, 683, { width: 230, height: 14 })
    doc
      .fillColor('#5A5A5A')
      .fontSize(16)
      .text(ticketName ?? 'N/A', 20, 705, { width: 230, height: 14 })
    if (type !== TicketTypes.CURLING_TRACK) {
      doc.fillColor('#7F7F7F').fontSize(12).text('Variant Name', 270, 683, { width: 230, height: 14 })

      doc
        .fillColor('#5A5A5A')
        .fontSize(16)
        .text(variantName ?? 'N/A', 270, 705, { width: 230, height: 14 })
    }

    doc.fillColor('#7F7F7F').fontSize(12).text('UNIT PRICE', 486.67, 683, { width: 230, height: 14 })

    doc
      .fillColor('#5A5A5A')
      .fontSize(16)
      .text(unitPrice ?? 'N/A', 486.67, 705, { width: 230, height: 14 })

    doc
      .moveTo(20, 740) // Starting point of the line
      .lineTo(570, 740) // Ending point of the line
      .stroke('#CCC') // Color of the line

    let format = 'DD/MM/YYYY'

    if (type === TicketTypes.DEAL) {
      doc.fillColor('#152955').fontSize(16).text('PRODUCTEN', 20, 490, { width: 555 })
      let x1 = 20,
        y1 = 510
      let x2 = 535,
        y2 = 510

      for (let i = 0; i < products.length; i++) {
        const { product, name, quantity } = products[i]
        doc
          .fillColor('#5A5A5A')
          .fontSize(16)
          .text(name || (product?.title ?? ''), x1, y1, { width: 300 })
        doc.fillColor('#5A5A5A').fontSize(16).text(quantity, x2, y2, { width: 300 })
        y1 = y1 + 25
        y2 = y2 + 25
      }

      doc.moveDown(0.5)

      doc.y = y1
      let y = doc.y

      y = doc.y
    }
    if (type === TicketTypes.CURLING_TRACK) format = 'DD/MM/YYYY HH:mm'

    doc
      .fillColor('#152955')
      .fontSize(14)
      .text(`Belangrijk: Dit ticket is geldig van ${moment(validFrom).format(format)} t/m ${moment(validTo).format(format)}`, 20, 765, { width: 552, height: 20 })
    doc.rect(0, 804, 595, 40).fillAndStroke('#B61E24')
    doc.fillColor('#FFF').fontSize(12).text('Powered by: TeChoices', 449, 817, { width: 126, height: 14 })

    doc.end()

    stream.on('finish', async () => {
      if (s3Service) {
        const location = await s3Service.uploadToS3(fileName, `${ticketCode}.pdf`)
        // console.log({ FINISHED: location })
        return resolve(location)
      }
      resolve('PDF CREATED...')
    })

    stream.on('error', (error) => {
      reject(error)
    })
  })
}