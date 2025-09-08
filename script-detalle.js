document.addEventListener('DOMContentLoaded', () => {
    const camiseta = JSON.parse(localStorage.getItem('camisetaSeleccionada'));

    if (!camiseta) {
        // Si no hay datos, redirige al catálogo
        window.location.href = 'index.html';
        return;
    }

    // Actualiza el título y el botón de WhatsApp
    document.title = camiseta.nombre;
    document.getElementById('camiseta-nombre').textContent = camiseta.nombre;
    document.getElementById('whatsapp-link').href = camiseta.link;

    const detalleSliderContainer = document.getElementById('detalle-slider-container');
    const detalleInfo = document.getElementById('detalle-info');

    // Genera el HTML del slider grande para el detalle
    const sliderHTML = `
        <div class="slider-full-images">
            ${camiseta.imagenes.map(src => `<img src="${src}" alt="${camiseta.nombre}" loading="lazy">`).join('')}
        </div>
        <button class="slider-btn prev"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-btn next"><i class="fas fa-chevron-right"></i></button>
    `;
    detalleSliderContainer.innerHTML = sliderHTML;

    // Genera el HTML de la información
    const infoHTML = `
        <h2>${camiseta.club}</h2>
        <p><strong>Nombre:</strong> ${camiseta.nombre}</p>
        <p><strong>Tipo:</strong> ${camiseta.tipo}</p>
        <p><strong>Versión:</strong> ${camiseta.version}</p>
        <a href="${camiseta.link}" class="btn-comprar" target="_blank">
            <i class="fab fa-whatsapp"></i> Consultar
        </a>
    `;
    detalleInfo.innerHTML = infoHTML;

    // Lógica para el slider de la página de detalles
    const prevBtn = document.querySelector('.prev-full');
    const nextBtn = document.querySelector('.next-full');
    const sliderFullImages = document.querySelector('.slider-full-images');

    prevBtn.addEventListener('click', () => moverSliderDetalle('prev'));
    nextBtn.addEventListener('click', () => moverSliderDetalle('next'));

    function moverSliderDetalle(direction) {
        const totalImages = camiseta.imagenes.length;
        const imageWidth = sliderFullImages.firstElementChild.offsetWidth;
        let newPosition = parseFloat(sliderFullImages.style.transform.replace('translateX(', '').replace('px)', '')) || 0;

        if (direction === 'next') {
            if (newPosition > -(imageWidth * (totalImages - 1))) {
                newPosition -= imageWidth;
            } else {
                newPosition = 0;
            }
        } else if (direction === 'prev') {
            if (newPosition < 0) {
                newPosition += imageWidth;
            } else {
                newPosition = -(imageWidth * (totalImages - 1));
            }
        }
        sliderFullImages.style.transform = `translateX(${newPosition}px)`;
    }
});