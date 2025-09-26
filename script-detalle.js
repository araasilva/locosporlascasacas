document.addEventListener('DOMContentLoaded', () => {
    const camiseta = JSON.parse(localStorage.getItem('camisetaSeleccionada'));

    if (!camiseta) {
        window.location.href = 'index.html';
        return;
    }

    // Elementos del DOM y asignación de datos
    const camisetaNombre = document.getElementById('camiseta-nombre');
    const camisetaPrecio = document.getElementById('camiseta-precio');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    const mainProductImage = document.getElementById('main-product-image');
    const quantityInput = document.getElementById('product-quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const talleSelect = document.getElementById('talle-select');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Actualiza el título y el enlace de WhatsApp (Mantendremos el link de la camiseta por ahora)
    document.title = camiseta.nombre;
    document.getElementById('whatsapp-link').href = camiseta.link;

    camisetaNombre.textContent = `Camiseta ${camiseta.nombre}`;
    // Si tu JSON no tiene precio, usa este valor. AJUSTA SI ES NECESARIO.
    camisetaPrecio.textContent = `$70.000,00`; 
    mainProductImage.src = camiseta.imagenes[0]; 

    // --- Lógica del Slider/Miniaturas (Se mantiene, solo se refactoriza ligeramente) ---
    camiseta.imagenes.forEach((src, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = src;
        thumbnail.alt = `Miniatura ${index + 1} de ${camiseta.nombre}`;
        thumbnail.classList.add('thumbnail-item');
        if (index === 0) {
            thumbnail.classList.add('active'); 
        }
        thumbnail.addEventListener('click', () => {
            mainProductImage.src = src; 
            document.querySelectorAll('.thumbnail-item').forEach(item => {
                item.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
        thumbnailGallery.appendChild(thumbnail);
    });

    // --- Control de Cantidad (Se mantiene) ---
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

    // --- LÓGICA CLAVE DEL CARRITO ---
    addToCartBtn.addEventListener('click', () => {
        const cantidad = parseInt(quantityInput.value);
        const talle = talleSelect.value;
        const imagen = camiseta.imagenes[0]; // Usamos la primera imagen como miniatura del carrito

        const itemCarrito = {
            id: `${camiseta.nombre}-${talle}`, // ID único para evitar duplicados
            nombre: camiseta.nombre,
            talle: talle,
            cantidad: cantidad,
            precioUnitario: 70000, // Hardcodeado por ahora. Reemplazar con el precio real.
            linkWhatsApp: camiseta.link,
            imagen: imagen
        };

        agregarItemACarrito(itemCarrito);

        // Mostrar un feedback rápido al usuario
        addToCartBtn.textContent = '¡AGREGADO! ✅';
        setTimeout(() => {
            addToCartBtn.textContent = 'AGREGAR AL CARRITO';
        }, 1500);

        // Actualizar el contador del carrito en el header
        actualizarContadorCarrito();
    });

    // Lógica para el header (Redirigir búsqueda)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                window.location.href = 'index.html'; 
            }
        });
    }
});



/*document.addEventListener('DOMContentLoaded', () => {
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