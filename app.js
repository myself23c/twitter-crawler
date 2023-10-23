const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const {parseadorUrls} = require("./src/app")
const {appReddit} = require("./srcReddit/appReddit")
const morgan = require('morgan');

const app = express()



const port = 3002

app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(express.static('public'));



//pagina landing
app.get('/hellow', (req, res) => {
  res.send('Hello World!')
})




//esta es la request qoue la cual va estar enfilando cada solicitud en la ruth descargar-perfil-twitter
const requestQueue = [];
let isProcessing = false;

// >>>>>>>>>>>>>>>>>



app.post("/descargar-perfil-twitter", async (req, res) => {
    const {url,nombreArchivo} = req.body
    console.log(url,nombreArchivo)
    if (!url) {
        return res.status(400).send("no hay url");
    }

    try {
        console.log("se agrego tu solicitud a la solo q para descargar");

        // Ejecutar función y luego esperar 40 segundos

//test
requestQueue.push({ req, res, url, nombreArchivo });
if (!isProcessing) {
    processQueue();
}
//test






/*
          //>>>>>>>>>>>>>>> esto es el codigo funcional sin la request quue
        await parseadorUrls(url,nombreArchivo);
        await new Promise((resolve) => setTimeout(resolve, 40000));

        //const filePath = path.join(__dirname, 'puppeter', 'imagenes.zip');

        await res.sendStatus(201)
          //<<<<<<<<<<<<<<<<<
*/


        // Comprobar si el archivo existe
        //await checkFileExists(filePath);

        /*
        // Ahora el archivo debería existir, procedemos a enviarlo
        res.download(filePath, 'imagenes.zip', async (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error al descargar el archivo');
            } else {
                console.log("se envio archivo");
            }
        });
        */

    } catch (err) {
        console.log(err);
        res.status(500).send('Error al capturar URLs de Reddit');
    }
});


//test
async function processQueue() {
  if (requestQueue.length === 0) {
      isProcessing = false;
      return;
  }
  isProcessing = true;
  const { req, res, url, nombreArchivo } = requestQueue.shift();
  try {
      console.log("ya se esta empezando a procesar la que nueva solo que")
      console.log("Se empezó con el capturado de URLs de twitter");
      await parseadorUrls(url, nombreArchivo);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Retraso de 5 segundos
      res.sendStatus(201);
  } catch (err) {
      console.log(err);
      res.status(500).send('Error al capturar URLs de Twitter');
  }
  processQueue();
}
//test





//test reddit


const requestQueueReddit = [];
let isProcessingReddit = false;
let concurrentRequests = 0; // Para llevar registro de cuántas solicitudes están siendo procesadas.
const MAX_CONCURRENT_REQUESTS = 2; // El número máximo de solicitudes en paralelo.

// Endpoint para recibir la solicitud
app.post("/descargar-perfil-reddit", async (req, res) => {
  const { url, nombreArchivo } = req.body;
  console.log(url, nombreArchivo);
  if (!url) {
    return res.status(400).send("no hay url");
  }

  try {
    console.log("se agrego tu solicitud a la solo q para descargar");

    requestQueueReddit.push({ req, res, url, nombreArchivo });
    if (!isProcessingReddit) {
      processQueueReddit();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al capturar URLs de Reddit");
  }
});

// Función para procesar la cola
async function processQueueReddit() {
  if (requestQueueReddit.length === 0) {
    isProcessingReddit = false;
    return;
  }
  
  if (concurrentRequests >= MAX_CONCURRENT_REQUESTS) {
    return;
  }

  isProcessingReddit = true;
  const { req, res, url, nombreArchivo } = requestQueueReddit.shift();
  concurrentRequests++;

  try {
    console.log("ya se esta empezando a procesar la nueva quoue");
    console.log("Se empezó con el capturado de URLs de Reddit");
    await appReddit(url, nombreArchivo);
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Retraso de 10 segundos
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al capturar URLs de Reddit");
  }

  concurrentRequests--;
  processQueueReddit(); // Verificar si hay más trabajos en la cola para procesar.
}

//test
////// test de reddit



//ruta para ver los archivos y devuelve un json con los nombre de la carpeta zi_archivadas
app.get('/get', (req, res) => {
    const directoryPath = path.join(__dirname, './zip_archivadas');
  
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ files });
    });
  });


/*
  //ruta para descargar archivos
app.post('/descargararchivo', (req, res) => {
    const fileName = req.body.fileName;
    console.log(fileName)
    const directoryPath = path.join(__dirname, './zip_archivadas');
  
    const filePath = path.join(directoryPath, fileName);
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    });
  });
  */

  app.post('/descargararchivo', (req, res) => {
    const fileName = req.body.fileName;
    const directoryPath = path.join(__dirname, './zip_archivadas');
    const filePath = path.join(directoryPath, fileName);
  
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    fs.createReadStream(filePath).pipe(res);
  });
  



  
//ruta de la pagina html statica de public
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`>>>App listening on port ${port}`)
})