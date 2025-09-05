// Variable global para almacenar las camisetas una vez cargadas
let camisetas = [];

const catalogoContainer = document.getElementById('catalogo');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

/**
 * Función para renderizar las camisetas en el DOM.
 * @param {Array} camisetasToDisplay - El array de camisetas a mostrar.
 */
function renderizarCatalogo(camisetasToDisplay) {
    catalogoContainer.innerHTML = ''; // Limpia el contenedor
    if (camisetasToDisplay.length === 0) {
        catalogoContainer.innerHTML = '<p class="no-results">No se encontraron camisetas que coincidan con la búsqueda. 😔</p>';
        return;
    }

    camisetasToDisplay.forEach(camiseta => {
        const camisetaCard = document.createElement('div');
        camisetaCard.classList.add('camiseta-card');
        camisetaCard.innerHTML = `
            <img src="${camiseta.imagen}" alt="${camiseta.nombre}">
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
}

/**
 * Función para filtrar las camisetas.
 * @param {string} searchTerm - El término de búsqueda del input.
 * @param {string} filterType - El tipo de filtro seleccionado ('all', 'Retro', 'Actual', 'Jugador', 'Fan').
 */
function filtrarCamisetas(searchTerm, filterType) {
    const term = searchTerm.toLowerCase();
    const camisetasFiltradas = camisetas.filter(camiseta => {
        // Filtra por nombre (buscador)
        const matchesSearch = camiseta.nombre.toLowerCase().includes(term);

        // Filtra por tipo o versión (botones)
        const matchesFilter = (
            filterType === 'all' ||
            camiseta.tipo === filterType ||
            camiseta.version === filterType
        );

        return matchesSearch && matchesFilter;
    });
    renderizarCatalogo(camisetasFiltradas);
}

// ----------------------------------------------------
// Lógica para cargar el JSON y manejar los eventos
// ----------------------------------------------------

/**
 * Carga las camisetas desde el archivo JSON y las muestra.
 */
async function cargarCatalogo() {
    try {
        const response = await fetch('camisetas.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        camisetas = await response.json(); // Asigna los datos a la variable global
        renderizarCatalogo(camisetas); // Renderiza todas las camisetas inicialmente
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
        // Remueve la clase 'active' de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Agrega la clase 'active' al botón clickeado
        e.target.classList.add('active');

        const filterType = e.target.dataset.filter;
        const searchTerm = searchInput.value;
        filtrarCamisetas(searchTerm, filterType);
    });
});

// Llama a la función de carga al iniciar la página
document.addEventListener('DOMContentLoaded', cargarCatalogo);