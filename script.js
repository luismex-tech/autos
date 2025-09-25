document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL DOM ---
    const carGrid = document.getElementById('car-grid');
    const modal = document.getElementById('details-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const closeTermsBtn = document.getElementById('close-terms-modal');
    const lightbox = document.getElementById('lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // --- ELEMENTOS DE FILTRADO ---
    const searchInput = document.getElementById('search-input');
    const conditionFilter = document.getElementById('condition-filter');
    const filterButton = document.getElementById('filter-button');

    let allCarsData = []; // Almacenará todos los autos del JSON

    // --- CARGA INICIAL DE DATOS ---
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allCarsData = data;
            displayCars(allCarsData); // Muestra todos los autos al principio
        })
        .catch(error => console.error('Error al cargar los datos de los autos:', error));

    // --- FUNCIÓN PRINCIPAL PARA MOSTRAR AUTOS ---
    function displayCars(cars) {
        carGrid.innerHTML = ''; // Limpia el grid antes de mostrar nuevos resultados
        if (cars.length === 0) {
            carGrid.innerHTML = `<p class="no-results">No se encontraron vehículos con esos criterios.</p>`;
            return;
        }
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.dataset.id = car.id;
            
            carCard.innerHTML = `
                <div class="card-image-container">
                    <img src="${car.mainImage}" alt="${car.make} ${car.model}">
                </div>
                <div class="card-content">
                    <h3>${car.make} ${car.model}</h3>
                    <span class="year">${car.year}</span>
                    <div class="card-tags">
                        <span>${car.condition}</span>
                        <span>${car.city}</span>
                    </div>
                </div>
            `;
            carGrid.appendChild(carCard);
        });
    }

    // --- LÓGICA DE FILTRADO ---
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCondition = conditionFilter.value;

        let filteredCars = allCarsData.filter(car => {
            const matchesSearch = car.make.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm);
            const matchesCondition = selectedCondition === 'all' || car.condition === selectedCondition;
            return matchesSearch && matchesCondition;
        });
        
        displayCars(filteredCars);
    }

    // --- EVENT LISTENERS PARA FILTROS ---
    filterButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', applyFilters); // Filtra en tiempo real al escribir
    conditionFilter.addEventListener('change', applyFilters); // Filtra al cambiar la condición

    // --- LÓGICA DE MODALES Y LIGHTBOX ---
    carGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.car-card');
        if (card) {
            const carId = parseInt(card.dataset.id);
            const carData = allCarsData.find(c => c.id === carId);
            if (carData) {
                populateModal(carData);
                modal.style.display = 'flex';
            }
        }
    });

    function populateModal(car) {
        document.getElementById('modal-title').textContent = `${car.make} ${car.model} ${car.version}`;
        document.getElementById('modal-price').textContent = `$${car.price} MXN`;
        document.getElementById('modal-year-condition').textContent = `${car.year} | ${car.condition}`;
        document.getElementById('modal-city').textContent = `📍 ${car.city}`;
        document.getElementById('modal-mileage').textContent = car.mileage;
        document.getElementById('modal-transmission').textContent = car.transmission;
        document.getElementById('modal-color').textContent = car.color;
        document.getElementById('modal-description').textContent = car.description;
        document.getElementById('modal-main-image').src = car.mainImage;

        const thumbnailsContainer = document.getElementById('modal-thumbnails');
        thumbnailsContainer.innerHTML = '';
        car.galleryImages.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Vista ${index + 1}`;
            if (index === 0) thumb.classList.add('active');
            thumbnailsContainer.appendChild(thumb);
        });
        
        const whatsappBtn = document.getElementById('whatsapp-button');
        const message = `Hola, vi tu ${car.make} ${car.model} ${car.year} en La Cochera Digital y quisiera más información.`;
        whatsappBtn.href = `https://wa.me/${car.sellerPhone}?text=${encodeURIComponent(message)}`;
    }
    
    document.getElementById('modal-thumbnails').addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            document.getElementById('modal-main-image').src = e.target.src;
            document.querySelectorAll('#modal-thumbnails img').forEach(thumb => thumb.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    document.getElementById('modal-main-image').addEventListener('click', (e) => {
        lightboxImage.src = e.target.src;
        lightbox.style.display = 'flex';
    });

    function closeModal() { modal.style.display = 'none'; }
    function closeTermsModal() { termsModal.style.display = 'none'; }
    function closeLightbox() { lightbox.style.display = 'none'; }

    closeModalBtn.addEventListener('click', closeModal);
    closeTermsBtn.addEventListener('click', closeTermsModal);
    closeLightboxBtn.addEventListener('click', closeLightbox);
    
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
        if (e.target === termsModal) closeTermsModal();
        if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeTermsModal();
            closeLightbox();
        }
    });
});
