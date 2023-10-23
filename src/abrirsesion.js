const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const storageState = JSON.parse(fs.readFileSync('storageStateReddit.json').toString());
  const context = await browser.newContext({ storageState: storageState });
  const page = await context.newPage();
  
  // Navega a una página donde deberías estar autenticado
  await page.goto('https://twitter.com/');

  await new Promise(resolve => setTimeout(resolve, 40000));
  
  await browser.close();
})();


//si quieres logearte y abrir sesion y guardarla