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
