document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el formulario de agenda
    const btnAgendar = document.getElementById('btnAgendar');
    const agendarModal = document.getElementById('agendarModal');
    const cerrarFormulario = document.getElementById('cerrarFormulario');
    const formularioAgenda = document.getElementById('formularioAgenda');

    if (btnAgendar && agendarModal && cerrarFormulario && formularioAgenda) {
        // Establecer fecha mínima para el input de fecha (día actual)
        const fechaInput = document.getElementById('fecha');
        const hoy = new Date();
        const fechaMinima = hoy.toISOString().split('T')[0];
        fechaInput.min = fechaMinima;

        // Abrir modal
        btnAgendar.addEventListener('click', function() {
            agendarModal.style.display = 'block';
        });

        // Cerrar modal
        cerrarFormulario.addEventListener('click', function() {
            agendarModal.style.display = 'none';
        });

        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', function(event) {
            if (event.target === agendarModal) {
                agendarModal.style.display = 'none';
            }
        });

        // === Formspree integration ===
        // Para automatizar el envío a tu correo sin que el cliente abra su correo:
        // 1) Regístrate en https://formspree.io
        // 2) Crea un formulario y copia el Form ID (algo como f/XXXXXXXX)
        // 3) Pega el ID abajo en FORMSPREE_FORM_ID (o la URL completa)
        // Si no se configura, el sistema hará fallback y descargará un .txt con la solicitud.
        const FORMSPREE_FORM_ID = 'https://formspree.io/f/xldorpge'; // <--- pega aquí tu Formspree ID (por ejemplo: 'f/abc123') o la URL completa

        formularioAgenda.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(formularioAgenda);
            const datos = {
                paquete: formData.get('paquete'),
                fecha: formData.get('fecha'),
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono') || 'No proporcionado'
            };

            const readableContent = `Nueva solicitud de sesión fotográfica:\n\nPaquete seleccionado: ${datos.paquete === 'casual' ? 'Sesión Casual o Formal' : 'Casual y Formal'}\nFecha solicitada: ${datos.fecha}\nNombre: ${datos.nombre}\nCorreo electrónico: ${datos.email}\nTeléfono: ${datos.telefono}\n`;

            // Si el usuario pegó su Formspree ID, usamos fetch para enviar al endpoint
            if (FORMSPREE_FORM_ID && FORMSPREE_FORM_ID.trim() !== '') {
                // Aceptamos que el usuario pegue solo el ID (f/xxx) o la URL completa
                let endpoint = FORMSPREE_FORM_ID.trim();
                if (!endpoint.startsWith('http')) {
                    endpoint = `https://formspree.io/${endpoint}`;
                }

                // Adjuntamos también un campo "_replyto" con el email del cliente para que Formspree lo use
                formData.append('_replyto', datos.email);

                fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        formularioAgenda.reset();
                        agendarModal.style.display = 'none';
                        alert('Tu solicitud se ha enviado correctamente. Te contactaré pronto.');
                    } else {
                        return response.json().then(err => Promise.reject(err));
                    }
                }).catch(err => {
                    console.error('Error enviando a Formspree:', err);
                    alert('No se pudo enviar el formulario automáticamente. Se descargará un archivo .txt como alternativa.');
                    descargarTxt(readableContent, datos);
                });
            } else {
                // Si no hay Formspree configurado, fallback a descarga .txt
                descargarTxt(readableContent, datos);
            }
        });
    }

    // Helper: crear y descargar archivo .txt con la solicitud (fallback)
    function descargarTxt(contenido, datos) {
        try {
            const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = (datos && datos.nombre ? datos.nombre : 'reserva').replace(/[^a-z0-9-_]/gi, '_');
            const filename = `reserva_${safeName}_${(datos && datos.fecha) ? datos.fecha : 'sin-fecha'}.txt`;
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 500);
        } catch (err) {
            console.error('Error al generar el archivo de texto:', err);
            alert('Ocurrió un error al generar el archivo. Por favor intenta de nuevo.');
        }
    }

    // Solo inicializar si hay imágenes de servicios
    const servicioImagenes = document.querySelectorAll('.servicio-img img');
    
    if (servicioImagenes.length > 0) {
        // Asegurarse de que el modal exista
        let modal = document.getElementById('imagenModal');
        if (!modal) {
            // Crear el modal si no existe
            modal = document.createElement('div');
            modal.id = 'imagenModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <span class="cerrar-modal">&times;</span>
                <img class="modal-contenido" id="imgModal">
            `;
            modal.style.display = 'none'; // Asegurarse de que el modal esté oculto inicialmente
            document.body.appendChild(modal);
        }
    
        const modalImg = document.getElementById('imgModal');
        const span = modal.querySelector('.cerrar-modal');
        
        // Agregar evento click a cada imagen de servicio
        servicioImagenes.forEach(img => {
            img.onclick = function() {
                modal.style.display = 'block';
                modalImg.src = this.src;
            }
        });
    
        // Cerrar modal con la X
        span.onclick = function() {
            modal.style.display = 'none';
        }
        
        // Cerrar modal clickeando fuera
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});
