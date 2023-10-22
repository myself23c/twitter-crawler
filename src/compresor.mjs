
/*
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';







const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function compresor (archiveName = "archivoreciencreado"){


    console.log(">>>>>>> Estoy comprimiendo esperate")
    const downloadFolder = path.join(__dirname, 'imagenes_descargadas');
    await fs.ensureDir(downloadFolder);



//const output = fs.createWriteStream(`${__dirname}, ../zip_archivadas/imagenesTwitter.zip`);

const outputPath = path.join((__dirname, `../zip_archivadas/${archiveName}`))
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.pipe(output);
archive.directory(downloadFolder, false);
await archive.finalize();

console.log('Archivo ZIP creado con éxito');


}

compresor()
*/

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function compresor (archiveName) {
    try {
        if (!archiveName) {
            console.error("El nombre del archivo ZIP es necesario");
            return;
        }
        
        console.log(`>>>>>>> Estoy comprimiendo, esperate ${archiveName}`);
        const downloadFolder = path.join(__dirname, archiveName);
        await fs.ensureDir(downloadFolder);
        
        const outputFilePath = path.join(__dirname, `../zip_archivadas/${archiveName}.zip`);
        const output = fs.createWriteStream(outputFilePath);
        
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        
        archive.pipe(output);
        archive.directory(downloadFolder, false);
        await archive.finalize();
        
        console.log(`Archivo ZIP creado con éxito con nombre ${archiveName}`);
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
    }
}

// Uso de la función con un nombre de archivo como argumento
//compresor('miArchivssdoasdgfg').catch(err => console.error(err));
