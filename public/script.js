
//require('dotenv').config({ path: '../.env' });
const API_URL="http://34.70.61.24:3002"
//const API_URL="http://localhost:3002"

////////////bloque twitter

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myFormTwitter");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const urlValue = document.getElementById("url").value;
    const filenameValue = document.getElementById("filename").value;
    //const scrollNumber = document.getElmentById("scrolls").value

    const payload = {
      url: urlValue,
      nombreArchivo: filenameValue,
     // scrolls : scrollNumber
    };

    try {
      const response = await fetch(`${API_URL}/descargar-perfil-twitter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log("Datos enviados con éxito");
      } else {
        console.log("Error en la solicitud");
      }
    } catch (error) {
      console.log("Error de red o del servidor", error);
    }
  });
});
////////// termina bloque twitter


//// empieza bloque reddit

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myFormReddit");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const urlValue = document.getElementById("urlReddit").value;
    const filenameValue = document.getElementById("filenameReddit").value;
    //const scrollNumber = document.getElmentById("scrolls").value

    const payload = {
      url: urlValue,
      nombreArchivo: filenameValue,
     // scrolls : scrollNumber
    };

    try {
      const response = await fetch(`${API_URL}/descargar-perfil-reddit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log("Datos enviados con éxito");
      } else {
        console.log("Error en la solicitud");
      }
    } catch (error) {
      console.log("Error de red o del servidor", error);
    }
  });
});

//// termina bloque reddit
















///// bloque ver archivos en la nuve
document.addEventListener("DOMContentLoaded", () => {
  const fetchFilesBtn = document.getElementById("fetchFiles");
  const fileListDiv = document.getElementById("fileList");

  fetchFilesBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/get`);
      const data = await response.json();
      const files = data.files;

      fileListDiv.innerHTML = ""; // Limpiar el div

      files.forEach(file => {
        const fileDiv = document.createElement("div");
        fileDiv.textContent = file;
        
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        
        downloadBtn.addEventListener("click", async () => {
          const response = await fetch(`${API_URL}/descargararchivo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: file }),
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = file;
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
          } else {
            alert("Error al descargar el archivo");
          }
        });

        fileDiv.appendChild(downloadBtn);
        fileListDiv.appendChild(fileDiv);
      });

    } catch (error) {
      console.error("Error al cargar los archivos:", error);
    }
  });
});


////////// termina bloque archivos en la nuve