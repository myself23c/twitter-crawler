document.addEventListener("DOMContentLoaded", () => {
  const fetchFilesBtn = document.getElementById("fetchFiles");
  const fileListDiv = document.getElementById("fileList");

  fetchFilesBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://34.70.61.24:3002/get");
      const data = await response.json();
      const files = data.files;

      fileListDiv.innerHTML = ""; // Limpiar el div

      files.forEach(file => {
        const fileDiv = document.createElement("div");
        fileDiv.textContent = file;
        
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        
        downloadBtn.addEventListener("click", async () => {
          const response = await fetch("http://34.70.61.24:3002/descargararchivo", {
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
