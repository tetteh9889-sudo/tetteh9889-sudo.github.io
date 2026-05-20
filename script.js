const cars = [
    { id: 1, name: "Ferrari SF90 Stradale", model: "SF90", category: "sports", image: "https://images.unsplash.com/photo-1592198084033-ade902d2ab6c?w=600&h=400&fit=crop", desc: "Hybrid V8 beast" },
    { id: 2, name: "Lamborghini Revuelto", model: "Revuelto", category: "sports", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=400&fit=crop", desc: "V12 plug-in hybrid" },
    { id: 3, name: "Porsche 911 Turbo S", model: "992", category: "sports", image: "https://images.unsplash.com/photo-1503376780359-7e5e0c2c5d2f?w=600&h=400&fit=crop", desc: "Iconic sports car" },
    { id: 4, name: "Tesla Cybertruck", model: "Cybertruck", category: "suv", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop", desc: "Futuristic electric truck" },
    { id: 5, name: "Mercedes-Benz S-Class", model: "W223", category: "luxury", image: "https://images.unsplash.com/photo-1626668893632-6f1a39aae07e?w=600&h=400&fit=crop", desc: "Pinnacle of luxury" },
    { id: 6, name: "BMW M3 Competition", model: "G80", category: "sports", image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=600&h=400&fit=crop", desc: "High-performance sedan" },
    { id: 7, name: "Range Rover Sport", model: "L461", category: "suv", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop", desc: "Luxury offroader" },
    { id: 8, name: "Ford Mustang GT", model: "S650", category: "classic", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&h=400&fit=crop", desc: "American muscle legacy" },
    { id: 9, name: "Chevrolet Corvette C8", model: "Stingray", category: "sports", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop", desc: "Mid-engine masterpiece" },
    { id: 10, name: "Rolls-Royce Phantom", model: "VIII", category: "luxury", image: "https://images.unsplash.com/photo-1631295868223-63228b10f9e4?w=600&h=400&fit=crop", desc: "Ultimate luxury" }
];

let favorites = JSON.parse(localStorage.getItem('carFavorites')) || [];
let currentFilter = "all";
let currentSearch = "";

function saveFavorites() {
    localStorage.setItem('carFavorites', JSON.stringify(favorites));
    document.getElementById('favCount').innerText = favorites.length;
}

function toggleFavorite(carId) {
    if (favorites.includes(carId)) {
        favorites = favorites.filter(id => id !== carId);
    } else {
        favorites.push(carId);
    }
    saveFavorites();
    renderCarGrid();
}

function isFavorite(carId) {
    return favorites.includes(carId);
}

function filterCars() {
    return cars.filter(car => {
        if (currentFilter !== "all" && car.category !== currentFilter) return false;
        if (currentSearch.trim() !== "") {
            const searchTerm = currentSearch.toLowerCase();
            return car.name.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm);
        }
        return true;
    });
}

function renderCarGrid() {
    const filtered = filterCars();
    const grid = document.getElementById('carGrid');
    document.getElementById('carCount').innerText = filtered.length;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">🚫 No cars match your search. Try something else!</div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(car => `
        <div class="car-card">
            <img class="car-image" src="${car.image}" alt="${car.name}" data-img-full="${car.image}">
            <div class="car-info">
                <div class="car-name">
                    ${car.name}
                    <button class="like-btn ${isFavorite(car.id) ? 'liked' : ''}" data-id="${car.id}">
                        ${isFavorite(car.id) ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="car-model">${car.model}</div>
                <span class="car-category">${car.category.toUpperCase()}</span>
                <p style="font-size: 0.8rem; margin-top: 0.6rem; color: #94a3b8;">${car.desc}</p>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.getAttribute('data-id')));
        });
    });
    
    document.querySelectorAll('.car-image').forEach(img => {
        img.addEventListener('click', () => {
            document.getElementById('lightboxImg').src = img.getAttribute('data-img-full');
            document.getElementById('lightbox').classList.add('active');
        });
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderCarGrid();
    });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderCarGrid();
});

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox') || e.target.id === 'closeLightbox') {
        document.getElementById('lightbox').classList.remove('active');
    }
});

saveFavorites();
renderCarGrid();