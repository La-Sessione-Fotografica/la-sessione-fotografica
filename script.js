document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imagenModal');
    const modalImg = document.getElementById('imgModal');
    const span = document.getElementsByClassName('cerrar-modal')[0];
    
    // Obtener todas las imágenes de servicios
    const imagenes = document.querySelectorAll('.servicio-img img');
    
    // Agregar evento click a cada imagen
    imagenes.forEach(img => {
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

    const imagenesCards = document.querySelectorAll('.imagen-card img');
    const modalImagen = document.createElement('div');
    modalImagen.classList.add('modal');
    modalImagen.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="" alt="Imagen ampliada">
        </div>
    `;
    document.body.appendChild(modalImagen);

    const modalImgCard = modalImagen.querySelector('img');
    const modalCloseCard = modalImagen.querySelector('.modal-close');

    imagenesCards.forEach(img => {
        img.addEventListener('click', () => {
            modalImgCard.src = img.src;
            modalImagen.style.display = 'flex';
        });
    });

    modalCloseCard.addEventListener('click', () => {
        modalImagen.style.display = 'none';
    });

    modalImagen.addEventListener('click', (e) => {
        if (e.target === modalImagen) {
            modalImagen.style.display = 'none';
        }
    });
});
