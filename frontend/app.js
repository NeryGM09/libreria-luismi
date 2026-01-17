fetch("http://localhost:3000/libros")
    .then(response => response.json())
    .then(data => {
        let tabla = document.getElementById("tablaLibros");
        tabla.innerHTML = "";

        data.forEach(libro => {
            tabla.innerHTML += `
                <tr>
                    <td>${libro.id}</td>
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>L. ${libro.precio}</td>
                </tr>
            `;
        });
    })
    .catch(error => console.error("Error:", error));
