const { chromium } = require('playwright');

(async () => {
  // Lanzar el navegador de Chromium
  const browser = await chromium.launch({
    headless: false
  });

  // Crear una nueva página
  const page = await browser.newPage();

  // Configurar para que no cargue imágenes, CSS y fuentes
  await page.route('**/*', async (route) => {
    const resourceType = route.request().resourceType();
    if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
      await route.abort();
    } else {
      await route.continue();
    }
  });

  // Navegar a la página web
  await page.goto('https://waifubitches.com/');

  // Obtener URLs de todas las imágenes de la página
  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(image => image.src);
  });

  console.log('Image URLs:', imageUrls);
  await new Promise(resolve => setTimeout(resolve, 30000));
  // Cerrar el navegador
  await browser.close();
})();













exports.saveUrlsToFile = async function (URL_PAGE = "https://twitter.com/SharonWhiteXxX", NUMBER_SCROLLS = 5,TIME_BETWEEN_SCROLL = 3000) {

   
    

    const browser = await chromium.launch({
        headless: false,
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
          }
      });


      const storageState = JSON.parse(fs.readFileSync('storageState.json').toString());
      const context = await browser.newContext({ storageState: storageState });
      const page = await context.newPage();

//test
await page.route('**/*', async (route) => {
    const resourceType = route.request().resourceType();
    if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
      await route.abort();
    } else {
      await route.continue();
    }
  });
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
      window.scrollBy(0, 3000);
    });

    console.log(`>>> esta es la scrolleada numero ${i}`)
    // Esperar un poco antes del próximo scroll
    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_SCROLL));
  }
    
    

    await browser.close();
    console.log("Test terminado");}catch(e){console.log(error, "ubo un error en capturado")}

    const urls = await imageUrls
    console.log(urls)

    console.log("terminando de capturar imagenes")
    return urls
   // console.log('Image URLs:', imageUrls);
    
}










exports.descargador = async function (urlsYaParseadas, archiveName = "archivo") {
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