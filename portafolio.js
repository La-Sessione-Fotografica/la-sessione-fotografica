document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.foto-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const close = document.querySelector('.lightbox-close');
    const next = document.querySelector('.lightbox-next');
    const prev = document.querySelector('.lightbox-prev');
    let currentIndex = 0;

    // Aplicar delays de animación
    items.forEach((item, index) => {
        item.style.setProperty('--delay', `${index * 100}ms`);
    });

    // Abrir lightbox
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            const imgSrc = item.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
        });
    });

    // Cerrar lightbox
    close.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Navegación
    next.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        lightboxImg.src = items[currentIndex].querySelector('img').src;
    });

    prev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        lightboxImg.src = items[currentIndex].querySelector('img').src;
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowRight') next.click();
        if (e.key === 'ArrowLeft') prev.click();
    });
});
