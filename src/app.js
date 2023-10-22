
const {descargador,nuevosCapturados,saveUrlsToFile} = require("./aplicacionPuppeteer")
require = require('esm')(module /*, options*/);
const { compresor } = require('./compresor.mjs');
const { deleteFiles } = require("./eliminarArchivos.mjs")

/*
async function parseadorUrls (url,archiveName,numberScrolls){ 
    const urlsCapturadas = await saveUrlsToFile(url,numberScrolls)
    const urlsParseadas = await nuevosCapturados(urlsCapturadas)
    console.log(urlsParseadas)
    const descargar = await descargador(urlsParseadas)
    await new Promise((resolve) => setTimeout(resolve, 50000));
    const comprimidor = await compresor(archiveName)

    }


parseadorUrls()
*/

exports.parseadorUrls = async function (url, archiveName, numberScrolls){ 
  try {
      const urlsCapturadas = await saveUrlsToFile(url, numberScrolls);
      const urlsParseadas = await nuevosCapturados(urlsCapturadas);
      console.log(urlsParseadas);
      const descargar = await descargador(urlsParseadas,archiveName);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const comprimidor = await compresor(archiveName);
      await await new Promise((resolve) => setTimeout(resolve, 60000));
      await deleteFiles(archiveName)

  } catch (error) {
      console.error("Ha ocurrido un error:", error);
  }
}

//parseadorUrls("https://twitter.com/wolfhot01", "wolf", 2)



