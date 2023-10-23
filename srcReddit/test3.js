const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs-extra');

async function downloadImagesFromUrls(urlsParseadas) {
  const urls = urlsParseadas;
  const downloadFolder = path.join(__dirname, 'downloaded_images');
  await fs.ensureDir(downloadFolder);

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--window-size=1366,768',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
    ]
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    downloadsPath: downloadFolder
  });

  const page = await context.newPage();
  let imageIndex = 0;

  page.on('download', async (download) => {
    console.log("Evento de descarga detectado.");
    
    // Comprobar si la descarga ha fallado
    if (await download.failure()) {
      console.error(`Descarga fallida: ${await download.failure()}`);
      return;
    }
    
    const downloadPath = path.join(downloadFolder, `image-${imageIndex}.jpg`);
    
    try {
      await download.saveAs(downloadPath);
      imageIndex++;
    } catch (error) {
      console.error(`Error al guardar la descarga: ${error.message}`);
    }
  });

  let contador = 0;
  for (let url of urls) {

    try{
    console.log(`Navegando a ${url}`);
    await page.goto(url, { waitUntil: 'load' }); // Añadido waitUntil para esperar a que la página se cargue completamente.
    
    console.log('Ejecutando el script en la página.');
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach((img, index) => {
        const anchor = document.createElement('a');
        anchor.href = img.src;
        anchor.download = `image-${index}.jpg`;
        img.parentElement.replaceChild(anchor, img);
        anchor.appendChild(img);
        anchor.click();
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(`>>> Se ha descargado la imagen número ${contador}`);
    contador++;

}catch(e){}
  }

  await browser.close();
}

downloadImagesFromUrls([
    'https://i.redd.it/profileIcon_snoo459e6ceb-63d7-4742-8126-b929c9359974-headshot.png',
    'https://i.redd.it/profileIcon_snoo9f347da8-3210-4696-a25e-90bac4437257-headshot.png',
    'https://i.redd.it/zOx8fQ+WgN7n58B XNkAIgyEb+j5VQ0kgWCyO7G88gX8BA0iEQE02M2MAAAAASUVORK5CYII=',
    'https://i.redd.it/sjmao8bi7r6b1.gif',
    'https://i.redd.it/renderTimingPixel.png',
    'https://i.redd.it/gc1h7p5ghnkb1.gif',
    'https://i.redd.it/G0pNdcbSSyR5UlujZFeYjVbYEL0W3XWMmuNzAIcJFgg.jpg',
    'https://i.redd.it/lht0c86hyLjhvtI4Q1Cb3EkQCUvfP_UJ8iMlKQDd9sA.jpg',
    'https://i.redd.it/communityIcon_w14bru8wld381.png',
    'https://i.redd.it/communityIcon_pf6cwr9uypab1.jpg',
    'https://i.redd.it/communityIcon_27rxpao4aye91.jpg',
    'https://i.redd.it/3f12he80arvb1.jpg',
    'https://i.redd.it/communityIcon_0qnzus014dd91.png',
    'https://i.redd.it/moderator-achievement.svg',
    'https://i.redd.it/communityIcon_62qd7c9skfc51.png',
    'https://i.redd.it/communityIcon_4wly08xocow81.png',
    'https://i.redd.it/communityIcon_139ajoqu3d8b1.png',
    'https://i.redd.it/5WJU8ZhyLsUqXmc6l_zV2d4eF0Xm6Be3yRfltHwHha8.jpg',
    'https://i.redd.it/communityIcon_ql1eccoq3vy81.png',
    'https://i.redd.it/communityIcon_m3pwnnsnaoo11.png',
    'https://i.redd.it/0S-EhBXw7OTpq4pzKXQPsxnMPWxgPfiAwgrwuEJ65L8.jpg',
    'https://i.redd.it/bs9545ddkqvb1.jpg',
    'https://i.redd.it/n9dt0fltpqvb1.jpg',
    'https://i.redd.it/communityIcon_p7a6i2oavjfb1.png',
    'https://i.redd.it/459e6ceb-63d7-4742-8126-b929c9359974.png',
    'https://i.redd.it/twitter.png',
    'https://i.redd.it/custom.png',
    'https://i.redd.it/2ijsitib9kub1.jpg',
    'https://i.redd.it/WAq7Sqeb6qTWvEHjU64iQyD914pFK73sw2wk6aArilI.jpg',
    'https://i.redd.it/zrdi0bntvjub1.jpg',
    'https://i.redd.it/cm88dgfd66ub1.jpg',
    'https://i.redd.it/6x1c7xpqw5ub1.jpg',
    'https://i.redd.it/uufisgg5k5ub1.jpg',
    'https://i.redd.it/0ii17kgjg5ub1.jpg',
    'https://i.redd.it/43as69p3e5ub1.jpg',
    'https://i.redd.it/sy6afahw6rtb1.jpg',
    'https://i.redd.it/766byujx5stb1.jpg'
  ]);
