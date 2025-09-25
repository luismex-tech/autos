document.addEventListener('DOMContentLoaded', () => {
    
    const carGrid = document.getElementById('car-grid');
    const modal = document.getElementById('details-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const closeTermsBtn = document.getElementById('close-terms-modal');
    const lightbox = document.getElementById('lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    let carsData = [];

    // Cargar datos de los autos desde el archivo JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            carsData = data;
            displayCars(carsData);
        })
        .catch(error => console.error('Error al cargar los datos de los autos:', error));

    // Función para mostrar las tarjetas de los autos en el grid
    function displayCars(cars) {
        carGrid.innerHTML = '';
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

    // Abrir el modal con los detalles del auto
    carGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.car-card');
        if (card) {
            const carId = parseInt(card.dataset.id);
            const carData = carsData.find(c => c.id === carId);
            if (carData) {
                populateModal(carData);
                modal.style.display = 'flex';
            }
        }
    });

    // Rellenar el modal con la información del auto seleccionado
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
        const message = `Hola, vi tu ${car.make} ${car.model} ${car.year} en Motor Hub y quisiera más información.`;
        whatsappBtn.href = `https://wa.me/${car.sellerPhone}?text=${encodeURIComponent(message)}`;
    }
    
    // Cambiar imagen principal en la galería del modal
    document.getElementById('modal-thumbnails').addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            document.getElementById('modal-main-image').src = e.target.src;
            // Actualizar clase activa en thumbnails
            const thumbs = document.querySelectorAll('#modal-thumbnails img');
            thumbs.forEach(thumb => thumb.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // Abrir Lightbox al hacer clic en la imagen principal del modal
    document.getElementById('modal-main-image').addEventListener('click', (e) => {
        lightboxImage.src = e.target.src;
        lightbox.style.display = 'flex';
    });

    // Cerrar el modal de detalles
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Cerrar el modal de términos
    function closeTermsModal() {
        termsModal.style.display = 'none';
    }

    // Cerrar el lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', closeModal);
    closeTermsBtn.addEventListener('click', closeTermsModal);
    closeLightboxBtn.addEventListener('click', closeLightbox);
    
    // Abrir modal de términos
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
    });

    // Cerrar modales y lightbox al hacer clic fuera del contenido o presionar Escape
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
