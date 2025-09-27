document.addEventListener('DOMContentLoaded', () => {
    const carListings = document.getElementById('car-listings');
    const modal = document.getElementById('carModal');
    const closeModalBtn = document.getElementById('closeModal');
    const searchInput = document.getElementById('searchInput');
    const conditionFilter = document.getElementById('conditionFilter');
    let allCars = [];
    let currentImageIndex = 0;
    let currentGallery = [];

    // Cargar datos de los autos desde el JSON
    fetch('cars.json')
        .then(response => response.json())
        .then(data => {
            allCars = data;
            displayCars(allCars);
        })
        .catch(error => console.error('Error al cargar los datos de los autos:', error));

    // Función para mostrar los autos en la cuadrícula
    const displayCars = (cars) => {
        carListings.innerHTML = '';
        if (cars.length === 0) {
            carListings.innerHTML = '<p>No se encontraron autos con esos criterios.</p>';
            return;
        }
        
        // --- CAMBIO: Ordenamos para que los premium aparezcan primero ---
        const sortedCars = cars.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));

        sortedCars.forEach(car => {
            // --- CAMBIO: Añadimos la clase 'premium' si corresponde ---
            const isPremiumClass = car.isPremium ? 'premium' : '';
            const carCard = `
                <div class="car-card ${isPremiumClass}" data-id="${car.id}">
                    <img src="${car.mainImage}" alt="${car.make} ${car.model}" class="car-card-img">
                    <div class="car-card-info">
                        <h3>${car.make} ${car.model}</h3>
                        <p>${car.year} &bull; ${car.condition}</p>
                        <button class="btn-details">Ver Más Detalles</button>
                    </div>
                </div>
            `;
            carListings.innerHTML += carCard;
        });
    };

    // Event listener para el filtro y la búsqueda
    searchInput.addEventListener('input', filterAndSearch);
    conditionFilter.addEventListener('change', filterAndSearch);

    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const condition = conditionFilter.value;
        
        let filteredCars = allCars.filter(car => {
            const matchesSearch = car.make.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm);
            const matchesCondition = condition === 'todos' || car.condition === condition;
            return matchesSearch && matchesCondition;
        });
        
        displayCars(filteredCars);
    }

    // Event listener para abrir el modal
    carListings.addEventListener('click', e => {
        if (e.target.classList.contains('btn-details') || e.target.closest('.car-card')) {
            const card = e.target.closest('.car-card');
            const carId = parseInt(card.dataset.id);
            const carData = allCars.find(car => car.id === carId);
            openModal(carData);
        }
    });

    // Función para abrir el modal y popularlo con datos
    const openModal = (car) => {
        document.getElementById('modal-title').innerText = `${car.make} ${car.model}`;
        document.getElementById('modal-year').innerText = car.year;
        document.getElementById('modal-condition').innerText = car.condition;
        document.getElementById('modal-city').innerText = car.city;
        document.getElementById('modal-details-text').innerText = car.details;
        document.getElementById('modal-contact').innerText = car.contact;
        
        const whatsappLink = `https://wa.me/${car.contact}?text=Hola,%20vi%20tu%20${car.make}%20${car.model}%20${car.year}%20en%20Cochera%20Digital%20y%20estoy%20interesado.`;
        document.getElementById('modal-whatsapp').href = whatsappLink;

        // --- CAMBIO: Lógica para mostrar el video si es premium ---
        const videoContainer = document.getElementById('modal-video-container');
        if (car.isPremium && car.videoUrl) {
            // Extraer el ID del video de la URL de YouTube
            const videoId = car.videoUrl.split('v=')[1];
            videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            videoContainer.style.display = 'block';
        } else {
            videoContainer.innerHTML = '';
            videoContainer.style.display = 'none';
        }
        
        currentGallery = car.galleryImages;
        currentImageIndex = 0;
        setupGallery();

        modal.style.display = 'block';
    };

    // Función para configurar la galería del modal
    const setupGallery = () => {
        const galleryContainer = document.getElementById('modal-gallery');
        galleryContainer.innerHTML = `
            <img src="${currentGallery[currentImageIndex]}" alt="Foto del auto" class="gallery-image active">
            <div class="gallery-nav">
                <button class="prev">&lt;</button>
                <button class="next">&gt;</button>
            </div>
        `;
        
        galleryContainer.querySelector('.prev').addEventListener('click', showPrevImage);
        galleryContainer.querySelector('.next').addEventListener('click', showNextImage);
    };

    const showImage = () => {
        const galleryImage = document.querySelector('.gallery-image');
        galleryImage.src = currentGallery[currentImageIndex];
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        showImage();
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        showImage();
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeModalBtn.addEventListener('click', closeModal);

    // Cierra el modal si se hace clic fuera del contenido
    window.addEventListener('click', e => {
        if (e.target == modal) {
            closeModal();
        }
    });
});
    conditionFilter.addEventListener('change', filterAndSearch);

    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const condition = conditionFilter.value;
        
        let filteredCars = allCars.filter(car => {
            const matchesSearch = car.make.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm);
            const matchesCondition = condition === 'todos' || car.condition === condition;
            return matchesSearch && matchesCondition;
        });
        
        displayCars(filteredCars);
    }

    // Event listener para abrir el modal
    carListings.addEventListener('click', e => {
        if (e.target.classList.contains('btn-details') || e.target.closest('.car-card')) {
            const card = e.target.closest('.car-card');
            const carId = parseInt(card.dataset.id);
            const carData = allCars.find(car => car.id === carId);
            openModal(carData);
        }
    });

    // Función para abrir el modal y popularlo con datos
    const openModal = (car) => {
        document.getElementById('modal-title').innerText = `${car.make} ${car.model}`;
        document.getElementById('modal-year').innerText = car.year;
        document.getElementById('modal-condition').innerText = car.condition;
        document.getElementById('modal-city').innerText = car.city;
        document.getElementById('modal-details-text').innerText = car.details;
        document.getElementById('modal-contact').innerText = car.contact;
        
        const whatsappLink = `https://wa.me/${car.contact}?text=Hola,%20vi%20tu%20${car.make}%20${car.model}%20${car.year}%20en%20Cochera%20Digital%20y%20estoy%20interesado.`;
        document.getElementById('modal-whatsapp').href = whatsappLink;

        currentGallery = car.galleryImages;
        currentImageIndex = 0;
        setupGallery();

        modal.style.display = 'block';
    };

    // Función para configurar la galería del modal
    const setupGallery = () => {
        const galleryContainer = document.getElementById('modal-gallery');
        galleryContainer.innerHTML = `
            <img src="${currentGallery[currentImageIndex]}" alt="Foto del auto" class="gallery-image active">
            <div class="gallery-nav">
                <button class="prev">&lt;</button>
                <button class="next">&gt;</button>
            </div>
        `;
        
        galleryContainer.querySelector('.prev').addEventListener('click', showPrevImage);
        galleryContainer.querySelector('.next').addEventListener('click', showNextImage);
    };

    const showImage = () => {
        const galleryImage = document.querySelector('.gallery-image');
        galleryImage.src = currentGallery[currentImageIndex];
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        showImage();
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        showImage();
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeModalBtn.addEventListener('click', closeModal);

    // Cierra el modal si se hace clic fuera del contenido
    window.addEventListener('click', e => {
        if (e.target == modal) {
            closeModal();
        }
    });
});

