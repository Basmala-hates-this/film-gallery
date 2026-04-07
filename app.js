let movies = [];

async function init() {
    const res = await fetch('./movies.json');
    const data = await res.json();
     movies = data.movies;
    renderMovies(movies);
}

function renderMovies(filteredList) {
    const grid = document.getElementById('movie-grid');
    const count = document.getElementById('movie-count');

    count.textContent = `Showing ${filteredList.length} movie(s)`;

    if (filteredList.length === 0) {
        grid.innerHTML = `<p>No movies found</p>`;
        return;
    }

    grid.innerHTML = filteredList.map(m => `
        <div class="movie-card" onclick="openModal(${m.id})">
            <img src="${m.poster}" alt="${m.title}">
            <div class="card-info">
                <h3>${m.title}</h3>
                <p>${m.year} | Dir: ${m.director}</p>
                <span class="genre-tag">${m.genre}</span>
            </div>
        </div>
    `).join('');
}

//toggle details
function toggleDetails(id) {
    const el = document.getElementById(`extra-${id}`);
    el.style.display = el.style.display === "none" ? "block" : "none";
}

//what is better then toggle?
//u guessd it...a whole fricking modal....not so bad
function openModal(id) {
    const movie = movies.find(m => m.id === id);

    if (!movie) return; // safety

    document.getElementById("modal-poster").src = movie.poster;
    document.getElementById("modal-title").textContent = movie.title;
    document.getElementById("modal-info").textContent =
        `${movie.year} | ${movie.genre} | Dir: ${movie.director}`;
    document.getElementById("modal-description").textContent =
        movie.description || "No description available.";

    document.getElementById("modal-link").href =
        `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    document.getElementById("movie-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}

//clicking outside to close the modal....who said i am not extra?
window.onclick = function(e) {
    const modal = document.getElementById("movie-modal");
    if (e.target === modal) {
        closeModal();
    }
};

// The "Multi-Tool" Filter
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedGenre = document.getElementById('genre-select').value;

    const filtered = movies.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm) || 
                              m.director.toLowerCase().includes(searchTerm) ||
                              m.year.toString().includes(searchTerm);
        
        const matchesGenre = selectedGenre === "All" || m.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    renderMovies(filtered);
}

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('genre-select').addEventListener('change', applyFilters);


const backToTop = document.getElementById("back-to-top");


backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
init();