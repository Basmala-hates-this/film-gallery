let movies = [];

const ADMIN_PASS = "bruh2005";


async function init() {
    try {
        const res = await fetch('/api/movies'); // Fetch from our server
        const data = await res.json();
        movies = data.movies;
        renderMovies(movies);
    } catch (err) {
        console.error("Failed to load movies:", err);
    }
}



function loginAdmin() {
    const pass = prompt("Enter Admin Password:");
    if (pass === ADMIN_PASS) {
        document.getElementById('admin-panel').style.display = "block";
        document.body.classList.add("admin-active");
        renderMovies(movies); 
        alert("Admin Mode Activated.");
        document.getElementById('admin-login-btn').style.display = "none";
    }
    else {
        alert("Wrong password. what are u doing bruh?....");
    }
}

async function addMovie() {
    const btn = document.querySelector("#admin-panel button");
    const fileInput = document.getElementById('new-poster');
    const title = document.getElementById('new-title').value;

    // 1. Basic Validation
    if (!title || !fileInput.files[0]) {
        alert("Please provide at least a title and a poster!");
        return;
    }

    // 2. Deactivate button
    btn.disabled = true;
    btn.textContent = "Adding to Vault...";

    // 3. Process the Image (Convert to Base64)
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const base64Image = reader.result;

        const newMovie = {
            id: Date.now(),
            title: title,
            director: document.getElementById('new-director').value,
            year: parseInt(document.getElementById('new-year').value) || 2026,
            genre: document.getElementById('new-genre').value,
            rating: 5.0,
            poster: base64Image //img
        };

        // update data
        movies.push(newMovie);
        saveAndRefresh();

        //  reset form & reactivate button.....still hate js
        resetAdminForm();
        btn.disabled = false;
        btn.textContent = "Add to Collection";
        alert(`${title} has been added!`);
    };

    reader.readAsDataURL(file);
}

function resetAdminForm() {
    document.getElementById('new-title').value = "";
    document.getElementById('new-director').value = "";
    document.getElementById('new-year').value = "";
    document.getElementById('new-genre').value = "Fantasy";
    document.getElementById('new-poster').value = "";
}

function deleteMovie(id) {
    if (confirm("Delete this masterpiece?")) {
        movies = movies.filter(m => m.id !== id);
        saveAndRefresh();
    }
}

//....forgot about update till just now...
let editId = null; // track which movie is being edited

//  to fill the form with existing data
function editMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    // set the global editId
    editId = id;

    // populate the form fields
    document.getElementById('new-title').value = movie.title;
    document.getElementById('new-director').value = movie.director;
    document.getElementById('new-year').value = movie.year;
    document.getElementById('new-genre').value = movie.genre;

    // Change the button text to show we are in edit mode
    const addBtn = document.getElementById('add');
    addBtn.textContent = "Update Masterpiece";
    addBtn.onclick = updateMovie; // Switch the click handler

    // ccroll to the admin panel
    document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
}

//  to save the changes
function updateMovie() {
    const movieIndex = movies.findIndex(m => m.id === editId);
    
    if (movieIndex !== -1) {
        // update the text fields
        movies[movieIndex].title = document.getElementById('new-title').value;
        movies[movieIndex].director = document.getElementById('new-director').value;
        movies[movieIndex].year = parseInt(document.getElementById('new-year').value);
        movies[movieIndex].genre = document.getElementById('new-genre').value;

        // update poster if a new file was selected
        const fileInput = document.getElementById('new-poster');
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onloadend = function () {
                movies[movieIndex].poster = reader.result;
                finishUpdate();
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            finishUpdate();
        }
    }
}

function finishUpdate() {
    saveAndRefresh();
    resetAdminForm();
    alert("Movie updated successfully!");
    
    // Reset the button back to "Add" mode
    const addBtn = document.getElementById('add');
    addBtn.textContent = "Add to Collection";
    addBtn.onclick = addMovie;
    editId = null;
}

async function saveAndRefresh() {
    try {
        const response = await fetch('/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movies) // Send the updated array to the server
        });

        if (response.ok) {
            renderMovies(movies);
        } else {
            alert("Server failed to save the masterpiece.");
        }
    } catch (err) {
        console.error("Error saving data:", err);
    }
}

function logoutAdmin() {
    isAdmin = false; 
   
    document.getElementById('admin-panel').style.display = "none";
    document.body.classList.remove("admin-active");

    document.getElementById('new-title').value = "";
    document.getElementById('new-director').value = "";
    document.getElementById('new-year').value = "";
    document.getElementById('new-poster').value = "";
    renderMovies(movies);
    document.getElementById('admin-login-btn').style.display = "block";

    alert("Logged out successfully. Stay unhinged!");
}

function renderMovies(filteredList) {
    const grid = document.getElementById('movie-grid');
    const count = document.getElementById('movie-count');

    count.textContent = `Showing ${filteredList.length} movie(s)`;

    if (filteredList.length === 0) {
        grid.innerHTML = `<p>No movies found</p>`;
        return;
    }

    grid.innerHTML = filteredList.map(m =>
        
 ` <div class="movie-card">
    <div class="admin-controls">
        <button class="delete-btn" onclick="event.stopPropagation(); deleteMovie(${m.id})">Delete</button>
        <button class="edit-btn" onclick="event.stopPropagation(); editMovie(${m.id})">Edit</button>
    </div>
    
    <div onclick="openModal(${m.id})">
        <img src="${m.poster}" alt="${m.title}">
        <div class="card-info">
            <h3>${m.title}</h3>
            <p>${m.year} | Dir: ${m.director}</p>
            <p>Rating: ${m.rating}/10</p>
            <span class="genre-tag">${m.genre}</span>
        </div>
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
        `${movie.year} | ${movie.genre} | Dir: ${movie.director} | Rating: ${movie.rating}/10`;
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