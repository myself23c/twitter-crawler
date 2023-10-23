

const {descargador,nuevosCapturados,saveUrlsToFile} = require("./redditPuppeter.js")
require = require('esm')(module /*, options*/);
const { compresor } = require('./compresor.mjs');
const { deleteFiles } = require("./eliminarArchivos.mjs")





exports.appReddit = async function (url, archiveName, numberScrolls){
    const urlsCapturadas = await saveUrlsToFile(url, numberScrolls)

    const urlsParseadas = await nuevosCapturados(urlsCapturadas)

    console.log(urlsParseadas)

    const urlsDescargadas = await descargador(urlsParseadas,archiveName)

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const comprimidor = await compresor(archiveName);

    await await new Promise((resolve) => setTimeout(resolve, 60000));

    await deleteFiles(archiveName)
  
  }
  
  