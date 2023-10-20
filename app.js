const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const URL_PAGE = "https://twitter.com/SharonWhiteXxX";
/*
function navUrlsReddit(urlReddit) {
   const URL_TOP = urlReddit + "top/?t=all";
    const URL_TOP_YEAR = urlReddit + "top/?t=year";

    return {
        urlReddit,
        URL_TOP,
        URL_TOP_YEAR,
    };
}
*/

const NUMBER_SCROLLS = 15;
const TIME_BETWEEN_SCROLL = 2000;

async function saveUrlsToFile() {

    
    const browser = await chromium.launch({
        //headless: false,
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
          }
      });


      const storageState = JSON.parse(fs.readFileSync('storageState.json').toString());
      const context = await browser.newContext({ storageState: storageState });
      const page = await context.newPage();


    await page.goto(URL_PAGE);

    let imageUrls = [];
    try{
  // Realizar scroll 5 veces y capturar URLs de imágenes
  for (let i = 0; i < NUMBER_SCROLLS; i++) {
    // Capturar las URLs de imágenes y almacenarlas en imageUrls
    const newImageUrls = await page.$$eval('img', (images) =>
      images.map((image) => image.src)
    );
    imageUrls = [...new Set([...imageUrls, ...newImageUrls])];

    // Hacer scroll hacia abajo
    await page.evaluate(() => {
      window.scrollBy(0, 3000);
    });

    // Esperar un poco antes del próximo scroll
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
    
    

    await browser.close();
    console.log("Test terminado");}catch(e){console.log(error, "ubo un error en capturado")}

    const urls = await imageUrls
    console.log(urls)

    console.log("terminando de capturar imagenes")
    return urls
   // console.log('Image URLs:', imageUrls);
    
}











const nuevosCapturados = async(urlsRaw) => {
    let capturados2 = []

    urlsRaw.forEach(u => {
      if (!u.includes('.jpg') && !u.includes('/card_img/')) {
     let arreglado = u.split("format=").shift() + "format=jpg&name=large"
     capturados2.push(arreglado)}  
   
   })
   const capturadosFinal = await capturados2
   console.log("se estan parseando las urls")
   return capturadosFinal
}





async function descargador(urlsYaParseadas) {
  const downloadFolder = path.join(__dirname, 'imagenes_descargadas');
  await fse.ensureDir(downloadFolder);

  const browser = await chromium.launch({
    //headless: false
  });

  const storageState = JSON.parse(fs.readFileSync('storageState.json').toString());
  const context = await browser.newContext({
    storageState: storageState,
    acceptDownloads: true
  });

  const page = await context.newPage();
  let imageIndex = 0; // Índice para cada imagen en una URL

  // Escuchar el evento de descarga y asignar un nombre único a cada archivo descargado
  page.on('download', async (download) => {
    const downloadPath = path.join(downloadFolder, `image-${imageIndex}.jpg`);
    await download.saveAs(downloadPath);
    imageIndex++;
  });

  let urlIndex = 0; // Índice para cada URL
  for (let url of urlsYaParseadas) {

    try{
    await page.goto(url);
    
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

    await page.waitForTimeout(3000);
    console.log(`>>> Se está descargando la imagen número ${urlIndex}`);
    urlIndex++;}catch(e){
        console.log(`ubo un error al intentar descar la imagen numero ${urlIndex}`)
        console.log(e)}
  }

  await browser.close();
}


async function parseadorUrls (){ 
    const urlsCapturadas = await saveUrlsToFile()
    const urlsParseadas = await nuevosCapturados(urlsCapturadas)
    console.log(urlsParseadas)
    const descargar = await descargador(urlsParseadas)
    }






parseadorUrls()




