// app ya rediddt funcionando  solo quiero probar quee rquest de 2



const requestQueueReddit = [];
let isProcessingReddit = false;

////// test de reddit
app.post("/descargar-perfil-reddit", async (req, res) => {
  const {url,nombreArchivo} = req.body
  console.log(url,nombreArchivo)
  if (!url) {
      return res.status(400).send("no hay url");
  }

  try {
      console.log("se agrego tu solicitud a la solo q para descargar");

      // Ejecutar función y luego esperar 40 segundos

//test
requestQueueReddit.push({ req, res, url, nombreArchivo });
if (!isProcessing) {
  processQueueReddit();
}
//test








  } catch (err) {
      console.log(err);
      res.status(500).send('Error al capturar URLs de Reddit');
  }
});


//test
async function processQueueReddit() {
if (requestQueueReddit.length === 0) {
    isProcessing = false;
    return;
}
isProcessingReddit = true;
const { req, res, url, nombreArchivo } = requestQueueReddit.shift();
try {
    console.log("ya se esta empezando a procesar la nueva quoue")
    console.log("Se empezó con el capturado de URLs de Reddit");
    await appReddit(url, nombreArchivo);
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Retraso de 5 segundos
    res.sendStatus(201);
} catch (err) {
    console.log(err);
    res.status(500).send('Error al capturar URLs de Reddit');
}
processQueue();
}
//test
////// test de reddit