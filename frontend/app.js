// URL base de la API - Ajusta el puerto si es necesario
const API = 'https://web-czz1pkxtkrle.up-de-fra1-k8s-1.apps.run-on-seenode.com/api';
const API_BASE_URL = `${API}/books`;

// Función para mostrar/ocultar secciones
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.classList.remove('activa');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(seccion).classList.add('activa');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
    
    // Limpiar mensajes al cambiar de sección
   limpiarMensajes();
}

// Función para limpiar mensajes
function limpiarMensajes() {
    document.querySelectorAll('.mensaje').forEach(msg => {
        msg.classList.remove('exito', 'error');
        msg.textContent = '';
        msg.style.display = 'none';
    });
}

// Función para mostrar mensajes
function mostrarMensaje(elementId, mensaje, tipo) {
    const elemento = document.getElementById(elementId);
    elemento.textContent = mensaje;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// ========== ALTA (CREATE) ==========
document.getElementById('formAlta').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('altaTitle').value.trim();
    const autor = document.getElementById('altaAutor').value.trim();
    
    if (!title || !autor) {
        mostrarMensaje('mensajeAlta', 'Por favor, complete todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/createBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, autor })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensaje('mensajeAlta', `✅ Libro agregado exitosamente. ID: ${data.id_insertado}`, 'exito');
            document.getElementById('formAlta').reset();
        } else {
            mostrarMensaje('mensajeAlta', `❌ Error: ${data.mensaje || 'Error al agregar el libro'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeAlta', '❌ Error de conexión con el servidor', 'error');
    }
});

// ========== BAJA (DELETE) ==========

// Variable para almacenar el ID del libro a eliminar
let libroAEliminar = null;

// Función para mostrar el modal de confirmación
function mostrarModalEliminar(libro) {
    document.getElementById('modalLibroId').textContent = libro.id;
    document.getElementById('modalLibroTitle').textContent = libro.title;
    document.getElementById('modalLibroAutor').textContent = libro.autor;
    libroAEliminar = libro.id;
    document.getElementById('modalEliminar').classList.add('mostrar');
}

// Función para ocultar el modal
function ocultarModalEliminar() {
    document.getElementById('modalEliminar').classList.remove('mostrar');
    libroAEliminar = null;
}

// Función para cargar datos del libro antes de eliminar
async function cargarDatosLibroParaEliminar() {
    const id = document.getElementById('bajaId').value.trim();
    
    if (!id) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            mostrarModalEliminar(data);
        } else {
            mostrarMensaje('mensajeBaja', `❌ ${data.mensaje || 'Libro no encontrado'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeBaja', '❌ Error de conexión con el servidor', 'error');
    }
}

// Evento para el formulario de baja
document.getElementById('formBaja').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('bajaId').value.trim();
    
    if (!id) {
        mostrarMensaje('mensajeBaja', 'Por favor, ingrese un ID válido', 'error');
        return;
    }
    
    // Cargar datos del libro y mostrar modal
    await cargarDatosLibroParaEliminar();
});

// Evento para cargar datos cuando se ingresa un ID (al salir del campo o presionar Enter)
document.getElementById('bajaId').addEventListener('blur', async () => {
    const id = document.getElementById('bajaId').value.trim();
    if (id) {
        // Solo cargar datos, no mostrar modal todavía
        // El modal se mostrará cuando se envíe el formulario
    }
});

// Función para confirmar eliminación
async function confirmarEliminacion() {
    if (!libroAEliminar) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${libroAEliminar}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensaje('mensajeBaja', `✅ ${data.mensaje}`, 'exito');
            document.getElementById('formBaja').reset();
            ocultarModalEliminar();
        } else {
            mostrarMensaje('mensajeBaja', `❌ Error: ${data.mensaje || 'Error al eliminar el libro'}`, 'error');
            ocultarModalEliminar();
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeBaja', '❌ Error de conexión con el servidor', 'error');
        ocultarModalEliminar();
    }
}

// Eventos del modal
document.getElementById('btnConfirmarEliminar').addEventListener('click', confirmarEliminacion);
document.getElementById('btnCancelarEliminar').addEventListener('click', ocultarModalEliminar);

// Cerrar modal al hacer clic fuera de él
document.getElementById('modalEliminar').addEventListener('click', (e) => {
    if (e.target.id === 'modalEliminar') {
        ocultarModalEliminar();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modalEliminar').classList.contains('mostrar')) {
        ocultarModalEliminar();
    }
});

// ========== CAMBIO (UPDATE) ==========

// Función para cargar los datos del libro cuando se ingresa un ID
async function cargarDatosLibro() {
    const id = document.getElementById('cambioId').value.trim();
    
    if (!id) {
        // Limpiar campos si no hay ID
        document.getElementById('cambioTitle').value = '';
        document.getElementById('cambioAutor').value = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            // Llenar los campos con los datos del libro
            document.getElementById('cambioTitle').value = data.title;
            document.getElementById('cambioAutor').value = data.autor;
            mostrarMensaje('mensajeCambio', '✅ Datos del libro cargados. Puede modificar los campos.', 'exito');
        } else {
            // Limpiar campos si no se encuentra el libro
            document.getElementById('cambioTitle').value = '';
            document.getElementById('cambioAutor').value = '';
            mostrarMensaje('mensajeCambio', `❌ ${data.mensaje || 'Libro no encontrado'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeCambio', '❌ Error de conexión con el servidor', 'error');
    }
}

// Evento para cargar datos cuando se ingresa un ID (al salir del campo o presionar Enter)
document.getElementById('cambioId').addEventListener('blur', cargarDatosLibro);
document.getElementById('cambioId').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        cargarDatosLibro();
    }
});

document.getElementById('formCambio').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('cambioId').value.trim();
    const title = document.getElementById('cambioTitle').value.trim();
    const autor = document.getElementById('cambioAutor').value.trim();
    
    if (!id || !title || !autor) {
        mostrarMensaje('mensajeCambio', 'Por favor, complete todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, autor })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensaje('mensajeCambio', `✅ ${data.mensaje}`, 'exito');
            document.getElementById('formCambio').reset();
        } else {
            mostrarMensaje('mensajeCambio', `❌ Error: ${data.mensaje || 'Error al actualizar el libro'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeCambio', '❌ Error de conexión con el servidor', 'error');
    }
});

// ========== CONSULTA (READ) ==========

// Consultar todos los libros
// Mejora la función consultarTodos()
async function consultarTodos() {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '<div class="loading">⏳ Cargando libros...</div>';

    try {
        console.log('🔍 Consultando:', API_BASE_URL + '/');

        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const books = await response.json();
        console.log('📚 Libros recibidos:', books);

        if (books.length === 0) {
            resultadoDiv.innerHTML = '<div class="sin-resultados">📭 No hay libros registrados</div>';
            return;
        }

        let html = '<table class="tabla-libros">';
        html += '<thead><tr><th>ID</th><th>Título</th><th>Autor</th></tr></thead>';
        html += '<tbody>';

        books.forEach(book => {
            html += `
                <tr>
                    <td><strong>${book.id}</strong></td>
                    <td>${book.title}</td>
                    <td>${book.autor}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        resultadoDiv.innerHTML = html;

    } catch (error) {
        console.error('❌ Error completo:', error);
        resultadoDiv.innerHTML = `
            <div class="mensaje error">
                ❌ Error al consultar los libros.<br>
                <small>Error: ${error.message}</small><br>
                <small>Verifica la consola del navegador (F12) para más detalles.</small>
            </div>
        `;
    }
}
// Consultar un libro por ID
async function consultarPorId() {
    const id = document.getElementById('consultaId').value.trim();
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    if (!id) {
        resultadoDiv.innerHTML = '<div class="mensaje error">❌ Por favor, ingrese un ID válido</div>';
        return;
    }
    
    resultadoDiv.innerHTML = '<div class="loading">⏳ Buscando libro...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            const book = data;
            resultadoDiv.innerHTML = `
                <div class="libro-individual">
                    <h3>📖 Libro Encontrado</h3>
                    <p><strong>ID:</strong> ${book.id}</p>
                    <p><strong>Título:</strong> ${book.title}</p>
                    <p><strong>Autor:</strong> ${book.autor}</p>
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `<div class="mensaje error">❌ ${data.mensaje || 'Libro no encontrado'}</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultadoDiv.innerHTML = '<div class="mensaje error">❌ Error al consultar el libro. Verifique que el servidor esté ejecutándose.</div>';
    }
}

// Permitir consultar por ID con Enter
document.getElementById('consultaId').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        consultarPorId();
    }
});

// Cargar todos los libros al entrar a la sección de consulta
document.querySelector('.menu-btn[onclick="mostrarSeccion(\'consulta\')"]').addEventListener('click', () => {
    setTimeout(() => {
        consultarTodos();
    }, 100);
});

