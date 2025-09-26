document.addEventListener('DOMContentLoaded', () => {
    const camiseta = JSON.parse(localStorage.getItem('camisetaSeleccionada'));

    if (!camiseta) {
        window.location.href = 'index.html';
        return;
    }

    // Actualiza el título y el enlace de WhatsApp
    document.title = camiseta.nombre;
    document.getElementById('whatsapp-link').href = camiseta.link;

    // Elementos del DOM
    const camisetaNombre = document.getElementById('camiseta-nombre');
    const camisetaPrecio = document.getElementById('camiseta-precio');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    const mainProductImage = document.getElementById('main-product-image');
    const quantityInput = document.getElementById('product-quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    // Asignar datos de la camiseta
    camisetaNombre.textContent = `Camiseta ${camiseta.nombre}`;
    // Asumiendo que tienes un precio en tu JSON o un valor por defecto.
    // Si no tienes precio, puedes hardcodearlo o añadirlo al JSON.
    camisetaPrecio.textContent = `$70.000,00`; // Ejemplo, ajusta si tienes precio en camiseta.
    mainProductImage.src = camiseta.imagenes[0]; // La primera imagen es la principal por defecto

    // Generar miniaturas
    camiseta.imagenes.forEach((src, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = src;
        thumbnail.alt = `Miniatura ${index + 1} de ${camiseta.nombre}`;
        thumbnail.classList.add('thumbnail-item');
        if (index === 0) {
            thumbnail.classList.add('active'); // Marca la primera como activa
        }
        thumbnail.addEventListener('click', () => {
            mainProductImage.src = src; // Cambia la imagen principal
            
            // Eliminar 'active' de todas las miniaturas y añadirlo a la clicada
            document.querySelectorAll('.thumbnail-item').forEach(item => {
                item.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
        thumbnailGallery.appendChild(thumbnail);
    });

    // Control de cantidad
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Evento del botón "Agregar al carrito"
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        alert(`Agregada ${quantityInput.value} unidad(es) de ${camiseta.nombre} al carrito.`);
        // Aquí iría la lógica real para añadir al carrito (guardar en localStorage o enviar a un backend)
    });

    // Lógica para el header (si tiene buscador y filtros)
    // Para que el buscador del header funcione en la página de detalle, 
    // necesitarías replicar la lógica de filtrado del script.js o redirigir.
    // Por simplicidad, el buscador en detalle.html de momento no tendrá funcionalidad de filtrado.
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Previene el envío del formulario
                const searchTerm = searchInput.value;
                if (searchTerm) {
                    // Opcional: podrías guardar el término en localStorage y redirigir al index.html
                    // localStorage.setItem('searchTerm', searchTerm);
                    window.location.href = 'index.html'; // Redirige al catálogo para buscar
                }
            }
        });
    }
});/*document.addEventListener('DOMContentLoaded', () => {
    const camiseta = JSON.parse(localStorage.getItem('camisetaSeleccionada'));

    if (!camiseta) {
        // Si no hay datos, redirige al catálogo
        window.location.href = 'index.html';
        return;
    }

    // Actualiza el título y el botón de WhatsApp
    document.title = camiseta.nombre;
    //document.getElementById('camiseta-nombre').textContent = camiseta.nombre;
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
        <div class="camiseta-info">   
            <h2>Camiseta ${camiseta.nombre}</h2>
            <p><strong>Versión:</strong> ${camiseta.version}</p>            
            <a href="${camiseta.link}" class="btn-comprar" target="_blank">
                <i class="fab fa-whatsapp"></i> Consultar
            </a>
        </div>
    `;
    detalleInfo.innerHTML = infoHTML;

    // Lógica para el slider de la página de detalles
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
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
});*/