const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

//const URL_PAGE = "https://twitter.com/SharonWhiteXxX";
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

//const NUMBER_SCROLLS = 3;
//const TIME_BETWEEN_SCROLL = 2000;









// test


exports.saveUrlsToFile = async function (URL_PAGE = "https://twitter.com/elonmusk", NUMBER_SCROLLS = 3, TIME_BETWEEN_SCROLL = 5000) {
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

  let capturedImageUrls = [];

  await page.route('**/*', async (route) => {
    const resourceType = route.request().resourceType();
    const url = route.request().url();

    if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
      capturedImageUrls.push(url);
      await route.abort();
    } else {
      await route.continue();
    }
  });

  await page.goto(URL_PAGE);

  let imageUrls = [];

  try {
    for (let i = 0; i < NUMBER_SCROLLS; i++) {
      const newImageUrls = await page.$$eval('img', (images) => images.map((image) => image.src));
      imageUrls = [...new Set([...imageUrls, ...newImageUrls])];
      
      await page.evaluate(() => {
        window.scrollBy(0, 8000);
      });

      console.log(`>>> esta es la scrolleada numero ${i}`);
      await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_SCROLL));
    }

    await browser.close();
    console.log(">>>>>>Test terminado<<<<<<");
  } catch (error) {
    console.log(error, "!>>>hubo un error en capturado");
  }

  const urls = [...new Set([...imageUrls, ...capturedImageUrls])];
  console.log(">>>>>>>>>>>>terminando de capturar imagenes<<<<<<<<<<<");
  console.log(urls);
  return urls;
}

//test




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

exports.nuevosCapturados = nuevosCapturados





//test

exports.descargador = async function (urlsYaParseadas,archiveName) {
  const downloadFolder = path.join(__dirname, archiveName);
  await fse.ensureDir(downloadFolder);

  const browser = await chromium.launch({
   // headless: false
  });

  const storageState = JSON.parse(fs.readFileSync('storageState.json').toString());
  const context = await browser.newContext({
    storageState: storageState,
    acceptDownloads: true,
    // Configuración para bloquear las solicitudes de imágenes
    route: [
      {
        url: '**/*',
        handler: async (route, request) => {
          if (request.resourceType() === 'image')
            route.abort();
          else
            route.continue();
        }
      },
    ]
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

    try {
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

      await page.waitForTimeout(1200);
      console.log(`>>> Se está descargando la imagen número ${urlIndex}  del archivo ${archiveName}`);
      urlIndex++;
    } catch (e) {
      console.log(`Hubo un error al intentar descargar la imagen número ${urlIndex} del archivo ${archiveName}`);
      console.log(e);
    }
  }

  await browser.close();
}


//test

