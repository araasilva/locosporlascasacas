const DATA_URL = 'products.json';

let products = [];
let cart = {};
let activeType = 'all';

// estado modal
let currentProduct = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  setupUI();
  renderProducts();
  renderCart();
});

async function loadProducts() {
  const res = await fetch(DATA_URL);
  products = await res.json();
}

function setupUI() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.type;
      renderProducts();
    });
  });

  document.getElementById('search').addEventListener('input', renderProducts);

  document.getElementById('clear-cart').addEventListener('click', () => {
    cart = {};
    renderCart();
  });

  document.getElementById('whatsapp').addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  });

  // modal
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.querySelector('.slide-btn.prev').addEventListener('click', () => changeImage(-1));
  document.querySelector('.slide-btn.next').addEventListener('click', () => changeImage(1));
  document.getElementById('modal-add').addEventListener('click', () => {
    const size = document.getElementById('modal-size').value;
    if (!size) {
      alert('Selecciona un talle');
      return;
    }
    addToCart(currentProduct.id, size);
    closeModal();
  });
}

function filterProducts() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  return products.filter(p => {
    if (activeType !== 'all' && p.category !== activeType) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  const list = filterProducts();

  for (const p of list) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="product-img" data-id="${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" />
      </div>
      <div class="meta">
        <div class="title">${p.name}</div>
        <div class="price">$${p.price}</div>
      </div>
      <div style="color:${p.available ? '#2a7a2a' : '#aa2a2a'};">
        ${p.available ? 'Disponible' : 'No disponible'}
      </div>
    `;
    grid.appendChild(card);

    card.querySelector('.product-img').addEventListener('click', () => openModal(p.id));
  }
}

function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;

  currentImageIndex = 0;
  document.getElementById('modal-img').src = currentProduct.images[currentImageIndex];
  document.getElementById('modal-name').textContent = currentProduct.name;
  document.getElementById('modal-price').textContent = `$${currentProduct.price}`;
  document.getElementById('modal-availability').textContent = currentProduct.available ? 'Disponible' : 'No disponible';

  const sizeSelect = document.getElementById('modal-size');
  sizeSelect.innerHTML = '';
  currentProduct.sizes.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sizeSelect.appendChild(opt);
  });

  document.getElementById('product-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('product-modal').classList.add('hidden');
  currentProduct = null;
}

function changeImage(dir) {
  if (!currentProduct) return;
  currentImageIndex = (currentImageIndex + dir + currentProduct.images.length) % currentProduct.images.length;
  document.getElementById('modal-img').src = currentProduct.images[currentImageIndex];
}

function addToCart(id, size) {
  const key = `${id}-${size}`;
  const p = products.find(x => x.id === id);
  if (!cart[key]) {
    cart[key] = { product: p, size, qty: 1 };
  } else {
    cart[key].qty++;
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    container.innerHTML = `<div>Tu carrito está vacío.</div>`;
  } else {
    for (const k of keys) {
      const item = cart[k];
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.product.images[0]}" alt="${item.product.name}" />
        <div class="info">
          <div>${item.product.name} (Talle: ${item.size})</div>
          <div>$${item.product.price} x ${item.qty}</div>
        </div>
        <button data-k="${k}" class="btn secondary">-</button>
        <button data-k="${k}" class="btn secondary">+</button>
      `;
      container.appendChild(el);

      el.querySelectorAll('button')[0].addEventListener('click', () => {
        item.qty--;
        if (item.qty <= 0) delete cart[k];
        renderCart();
      });
      el.querySelectorAll('button')[1].addEventListener('click', () => {
        item.qty++;
        renderCart();
      });
    }
  }

  const total = Object.values(cart).reduce((sum, it) => sum + it.product.price * it.qty, 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((s,i)=>s+i.qty,0);
}

function buildWhatsAppMessage() {
  const rows = Object.values(cart).map(it => {
    return `- ${it.product.name} (Talle: ${it.size}) x${it.qty} — $${it.product.price * it.qty}`;
  });
  const total = Object.values(cart).reduce((sum, it) => sum + it.product.price * it.qty, 0);
  return `Hola! Me interesa comprar las siguientes camisetas:\n\n${rows.join("\n")}\n\nTotal: $${total}`;
}


// Variable global para almacenar las camisetas
/*let camisetas = [];

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

document.addEventListener('DOMContentLoaded', cargarCatalogo);*/