// Variable global para almacenar las camisetas
let camisetas = [];

const catalogoContainer = document.getElementById('catalogo');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// ------------------------------------------------------------------
// Función principal corregida: renderizarCatalogo
// ------------------------------------------------------------------
function renderizarCatalogo(camisetasToDisplay) {
    catalogoContainer.innerHTML = '';
    if (camisetasToDisplay.length === 0) {
        catalogoContainer.innerHTML = '<p class="no-results">No se encontraron camisetas que coincidan con la búsqueda. 😔</p>';
        return;
    }

    camisetasToDisplay.forEach((camiseta, index) => {
        const camisetaCard = document.createElement('div');
        camisetaCard.classList.add('camiseta-card');
        
        // Ya no necesitamos dataset.index porque pasaremos el objeto completo
        // camisetaCard.dataset.index = index; 

        // Genera el HTML para el slider
        const sliderImagesHTML = camiseta.imagenes.map(src => `<img src="${src}" alt="${camiseta.nombre}" loading="lazy">`).join('');

        camisetaCard.innerHTML = `
            <div class="slider-container">
                <div class="slider-images">
                    ${sliderImagesHTML}
                </div>
                <button class="slider-btn prev"><i class="fas fa-chevron-left"></i></button>
                <button class="slider-btn next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="camiseta-info">
                <h3>${camiseta.nombre}</h3>
                <p>${camiseta.club} | Versión: ${camiseta.version}</p>
                <a href="${camiseta.link}" class="btn-comprar" target="_blank">
                    <i class="fab fa-whatsapp"></i> Consultar
                </a>
            </div>
        `;
        catalogoContainer.appendChild(camisetaCard);

        // Agrega los eventos de clic a los botones del slider
        const prevBtn = camisetaCard.querySelector('.prev');
        const nextBtn = camisetaCard.querySelector('.next');
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            moverSlider(camisetaCard, 'prev', camiseta.imagenes.length); // Pasa la longitud de imágenes
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            moverSlider(camisetaCard, 'next', camiseta.imagenes.length); // Pasa la longitud de imágenes
        });
        
        // **CORRECCIÓN CLAVE: Pasar el objeto 'camiseta' al evento**
        camisetaCard.addEventListener('click', () => {
            // Guardamos la camiseta filtrada/renderizada, no dependemos del índice global
            localStorage.setItem('camisetaSeleccionada', JSON.stringify(camiseta));
            window.location.href = 'detalle.html';
        });
    });
}

// ------------------------------------------------------------------
// Lógica del Slider (Ligeramente modificada)
// ------------------------------------------------------------------

/**
 * Función para mover el slider de una tarjeta específica.
 * NOTA: La lógica del slider ahora necesita la longitud de imágenes 
 * porque ya no usamos el dataset.index para buscar en el array 'camisetas'.
 */
function moverSlider(card, direction, totalImages) {
    const sliderImages = card.querySelector('.slider-images');
    const imageWidth = card.offsetWidth;
    // La posición inicial es 0 si no hay transformación previa
    let newPosition = parseFloat(sliderImages.style.transform.replace('translateX(', '').replace('px)', '')) || 0; 

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
    sliderImages.style.transform = `translateX(${newPosition}px)`;
}

// ------------------------------------------------------------------
// El resto del script se mantiene igual
// ------------------------------------------------------------------

/**
 * Función para filtrar las camisetas.
 */
function filtrarCamisetas(searchTerm, filterType) {
    const term = searchTerm.toLowerCase();
    const camisetasFiltradas = camisetas.filter(camiseta => {
        const matchesSearch = camiseta.nombre.toLowerCase().includes(term) || camiseta.club.toLowerCase().includes(term);
        const matchesFilter = (
            filterType === 'all' ||
            camiseta.tipo === filterType ||
            camiseta.version === filterType
        );
        return matchesSearch && matchesFilter;
    });
    renderizarCatalogo(camisetasFiltradas);
}

/**
 * Carga las camisetas desde el archivo JSON y las muestra.
 */
async function cargarCatalogo() {
    try {
        const response = await fetch('camisetas.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        camisetas = await response.json();
        renderizarCatalogo(camisetas);
    } catch (error) {
        console.error('No se pudo cargar el catálogo:', error);
        catalogoContainer.innerHTML = '<p class="error-msg">Lo sentimos, no pudimos cargar el catálogo en este momento. Intenta más tarde. 😢</p>';
    }
}

// Evento para el buscador en tiempo real
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    filtrarCamisetas(searchTerm, activeFilter);
});

// Eventos para los botones de filtro
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const filterType = e.target.dataset.filter;
        const searchTerm = searchInput.value;
        filtrarCamisetas(searchTerm, filterType);
    });
});

document.addEventListener('DOMContentLoaded', cargarCatalogo);