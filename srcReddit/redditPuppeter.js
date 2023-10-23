const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');



exports.saveUrlsToFile = async function (URL_PAGE = "https://www.reddit.com/r/IrineMeier/", NUMBER_SCROLLS = 750,TIME_BETWEEN_SCROLL = 3000) {

   
    

    const browser = await playwright.chromium.launch({
        //headless: false,
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
          }
      });


      const storageState = JSON.parse(fs.readFileSync('storageStateReddit.json').toString());
      const context = await browser.newContext({ storageState: storageState });
      const page = await context.newPage();


      
//test



//test


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
      window.scrollBy(0, 4000);
    });

    console.log(`>>> esta es la scrolleada numero ${i}`)
    // Esperar un poco antes del próximo scroll
    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_SCROLL));
  }
    
    

    await browser.close();
    console.log("Test terminado");}catch(e){console.log(error, "ubo un error en capturado")}

    const urls = await imageUrls
    console.log(urls)

    console.log(">>>terminando de capturar imagenes")
    return urls
   // console.log('Image URLs:', imageUrls);
    
}


const nuevosCapturados = async (arrUrls) => {
    // 1. Leer el archivo


        // 2. Aplicar la función para transformar las URLs
 

        const urls = await arrUrls.map(u => u.split("?", 1)[0]);
        const urlsFinales = await urls.map(u => {
            if (!u.includes("image_widget")) {
                let ulfinal = u.split("/").reverse().shift();
                return `https://i.redd.it/${ulfinal}`;
            }
            return u; // Si no cumple la condición, retornar la URL original
        });
        console.log('¡URLs transformadas con éxito!')
        
        return urlsFinales
        
}

exports.nuevosCapturados = nuevosCapturados




exports.descargador = async function (urlsParseadas,archiveName) {
  const urls = urlsParseadas;
  const downloadFolder = path.join(__dirname, archiveName);
  await fse.ensureDir(downloadFolder);

  const browser = await playwright.chromium.launch({
    //headless: false,
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

}catch(e){console.log(e)}
  }

  await browser.close();
}





/*

async function app (){
  const urlsCapturadas = await saveUrlsToFile()
  const urlsParseadas = await transformUrls(urlsCapturadas)
  console.log(urlsParseadas)
  const urlsDescargadas = await downloadImagesFromUrls(urlsParseadas)


}

app()
*/


