let movies = [];

async function init() {
    const res = await fetch('./movies.json');
    movies = await res.json();
    renderMovies(movies);
}

function renderMovies(filteredList) {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = filteredList.map(m => `
        <div class="movie-card">
            <img src="${m.poster}" alt="${m.title}">
            <div class="card-info">
                <h3>${m.title}</h3>
                <p>${m.year} | Dir: ${m.director}</p>
                <span class="genre-tag">${m.genre}</span>
            </div>
        </div>
    `).join('');
}

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

// window.onscroll = () => {
//     if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
//         backToTop.style.display = "block";
//     } else {
//         backToTop.style.display = "none";
//     }
// };

backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
init();