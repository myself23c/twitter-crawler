const { chromium } = require('playwright');
const fs = require('fs');


// primero te logeas aqui para que se cree un json con el logeo y ya el abri sesion ya entrarias logeado


(async () => {


    
  // Lanzar el navegador



  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navegar a la página de inicio de sesión
  await page.goto('https://example.com/login');

  // Esperar 3 minutos para que el usuario inicie sesión manualmente
  await new Promise(resolve => setTimeout(resolve, 180000));

  // Guardar el estado de la sesión
  const storageState = await context.storageState();
  fs.writeFileSync('storageStateReddit.json', JSON.stringify(storageState));

  // Cerrar el navegador
  await browser.close();
})();
