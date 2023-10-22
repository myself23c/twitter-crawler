const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const {parseadorUrls} = require("./src/app")

const app = express()



const port = 3000

app.use(bodyParser.json());
app.use(express.static('public'));



//pagina landing
app.get('/hellow', (req, res) => {
  res.send('Hello World!')
})





app.post("/descargar-perfil-twitter", async (req, res) => {
    const {url,nombreArchivo} = req.body
    console.log(url,nombreArchivo)
    if (!url) {
        return res.status(400).send("no hay url");
    }

    try {
        console.log("Se empezó con el capturado de URLs de twitter");

        // Ejecutar función y luego esperar 40 segundos
        await parseadorUrls(url,nombreArchivo);
        await new Promise((resolve) => setTimeout(resolve, 40000));

        //const filePath = path.join(__dirname, 'puppeter', 'imagenes.zip');

        await res.sendStatus(201)

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