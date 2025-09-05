// Variable global para almacenar las camisetas
let camisetas = [];

const catalogoContainer = document.getElementById('catalogo');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

/**
 * Función para renderizar las camisetas en el DOM con sliders.
 * @param {Array} camisetasToDisplay - El array de camisetas a mostrar.
 */
function renderizarCatalogo(camisetasToDisplay) {
    catalogoContainer.innerHTML = '';
    if (camisetasToDisplay.length === 0) {
        catalogoContainer.innerHTML = '<p class="no-results">No se encontraron camisetas que coincidan con la búsqueda. 😔</p>';
        return;
    }

    camisetasToDisplay.forEach((camiseta, index) => {
        const camisetaCard = document.createElement('div');
        camisetaCard.classList.add('camiseta-card');
        camisetaCard.dataset.index = index; // Identificador para el slider

        // Genera el HTML para el slider
        const sliderImagesHTML = camiseta.imagenes.map(src => `<img src="${src}" alt="${camiseta.nombre}">`).join('');

        camisetaCard.innerHTML = `
            <div class="slider-container">
                <div class="slider-images">
                    ${sliderImagesHTML}
                </div>
                <button class="slider-btn prev" data-card-index="${index}"><i class="fas fa-chevron-left"></i></button>
                <button class="slider-btn next" data-card-index="${index}"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="camiseta-info">
                <h3>${camiseta.nombre}</h3>
                <p>${camiseta.club} | Tipo: ${camiseta.tipo} | Versión: ${camiseta.version}</p>
                <a href="${camiseta.link}" class="btn-comprar" target="_blank">
                    <i class="fab fa-whatsapp"></i> Consultar
                </a>
            </div>
        `;
        catalogoContainer.appendChild(camisetaCard);
    });
    
    // Asigna los eventos de clic a los botones del slider después de renderizar
    setupSliders();
}

/**
 * Función para inicializar la lógica de los sliders.
 */
function setupSliders() {
    document.querySelectorAll('.slider-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const cardIndex = e.target.dataset.cardIndex;
            const card = document.querySelector(`.camiseta-card[data-index="${cardIndex}"]`);
            const sliderImages = card.querySelector('.slider-images');
            const totalImages = camisetas[cardIndex].imagenes.length;
            const currentPosition = parseFloat(getComputedStyle(sliderImages).transform.split(',')[4]) || 0;
            const imageWidth = card.offsetWidth;
            let newPosition = currentPosition;

            if (e.target.classList.contains('next')) {
                if (currentPosition > -(imageWidth * (totalImages - 1))) {
                    newPosition -= imageWidth;
                } else {
                    newPosition = 0; // Regresa al inicio
                }
            } else if (e.target.classList.contains('prev')) {
                if (currentPosition < 0) {
                    newPosition += imageWidth;
                } else {
                    newPosition = -(imageWidth * (totalImages - 1)); // Va al final
                }
            }
            sliderImages.style.transform = `translateX(${newPosition}px)`;
        });
    });
}

// ... (El resto del script, como filtrarCamisetas y cargarCatalogo, se mantiene igual)

// Carga las camisetas desde el archivo JSON y las muestra.
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

// Llama a la función de carga al iniciar la página
document.addEventListener('DOMContentLoaded', cargarCatalogo);