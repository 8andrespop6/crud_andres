function consulta_general() {
    let url = "http://127.0.0.1:5000/";  // Asegúrate de que esta URL apunte a tu servidor Flask
    fetch(url)
        .then(response => response.json())
        .then(data => visualizar(data))
        .catch(error => console.log(error));

    let b = "";
    const visualizar = (data) => {
        console.log(data);
        for (let i = 0; i < data.baul.length; i++) {
            b += `<tr>
                    <td>${data.baul[i].id_baul}</td>
                    <td>${data.baul[i].Plataforma}</td>
                    <td>${data.baul[i].usuario}</td>
                    <td>${data.baul[i].clave}</td>
                    <td>
                        <button type='button' class='btn btn-success' onclick="location.href = 'edit.html?variableB=${data.baul[i].id_baul}'">
                            <img src='img/guardar.png' height='30' width='30'>
                        </button>
                        <button type='button' class='btn btn-danger' onclick="eliminar(${data.baul[i].id_baul})">
                            <img src='img/basura.png' height='30' width='30'>
                        </button>
                    </td>
                  </tr>`;
        }
        document.getElementById('data').innerHTML = b;
    }
}

function registrar() {
    let url = "http://127.0.0.1:5000/registro/";  // Asegúrate de que esta URL apunte a tu servidor Flask
    let plat = document.getElementById("plataforma").value;
    let usua = document.getElementById("usuario").value;
    let clav = document.getElementById("clave").value;

    let data = { 
        "plataforma": plat,
        "usuario": usua,
        "clave": clav
    };

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(response => {
        if (response.mensaje === "Error") {
            swal("Mensaje", "Error en el registro", "error");
        } else {
            swal("Mensaje", "Registro agregado exitosamente", "success");
        }
    })
    .catch((error) => console.error("Error:", error));
}
function eliminar(id_baul) {
    let url = `http://127.0.0.1:5000/eliminar/${id_baul}`;  // Asegúrate de que esta URL apunte a tu servidor Flask

    // Confirmar con el usuario antes de eliminar
    swal({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.mensaje === "Error") {
                    swal("Mensaje", "Error al eliminar el registro", "error");
                } else {
                    swal("Mensaje", "Registro eliminado exitosamente", "success");
                    // Opcionalmente, puedes llamar a consulta_general() para actualizar la lista
                    consulta_general();
                }
            })
            .catch((error) => {
                console.error("Error al eliminar:", error);
                swal("Mensaje", "Error en la solicitud", "error");
            });
            
        }
    });
}
// Función para eliminar un registro
function eliminar(id) {
    fetch(`http://127.0.0.1:5000/eliminar/${id}`, {
        method: 'DELETE',  // Especificar el método DELETE
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())  // Procesar la respuesta JSON
    .then(data => {
        alert(data.mensaje);  // Mostrar mensaje de éxito o error
        if (data.mensaje === "Registro eliminado") {
            cargarDatos();  // Recargar los datos de la tabla
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al eliminar el registro.");
    });
}

var id = getParameterByName('variableB');
consulta_individual(id);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function consulta_individual(id) {
    fetch(`http://127.0.0.1:5000/consulta_individual/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("Plataforma").value = data.baul.Plataforma;
            document.getElementById("usuario").value = data.baul.usuario;
            document.getElementById("clave").value = data.baul.clave;
        });
}

function guardar() {
    const plataforma = document.getElementById('Plataforma').value;
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    fetch(`http://127.0.0.1:5000/actualizar/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            plataforma: plataforma,
            usuario: usuario,
            clave: clave
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        location.href = 'index.html';  // Redirigir después de guardar
    });
}



        function registrar() {
            const plataforma = document.getElementById('Plataforma').value;
            const usuario = document.getElementById('usuario').value;
            const clave = document.getElementById('clave').value;

            fetch("http://127.0.0.1:5000/registro/", {
                method: 'POST',
                body: JSON.stringify({
                    plataforma: plataforma,
                    usuario: usuario,
                    clave: clave
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.mensaje);
                location.href = 'index.html';  
            });
        }
    
// Captura el evento de envío del formulario
document.getElementById('form-registro').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario
    alert('Registro exitoso');
    window.location.href = "index.html"; // Redirige al archivo index.html
});
