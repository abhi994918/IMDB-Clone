const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

async function loadMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?apikey=97564898&s=${searchTerm}`;
  const res = await fetch(URL);
  const data = await res.json();

  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  movies.forEach((movie) => {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movie.imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster =
      movie.Poster !== "N/A" ? movie.Poster : "imagenotfound.jpg";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>`;

    searchList.appendChild(movieListItem);
  });
  loadMovieDetails();
}

// Array to store favorite movie IDs
let favoriteMovies = [];

// Function to add movie to favorites
function addToFavorites(movieID) {
  if (!favoriteMovies.includes(movieID)) {
    favoriteMovies.push(movieID);
    // Optionally, you can update UI to reflect the addition to favorites
    console.log("Movie added to favorites:", favoriteMovies);
  } else {
    alert("Movie already in favorites");
  }
}

// Function to remove movie from favorites
function removeFromFavorites(movieID) {
  const index = favoriteMovies.indexOf(movieID);
  if (index !== -1) {
    favoriteMovies.splice(index, 1);
    // Optionally, you can update UI to reflect the removal from favorites
    console.log("Movie removed from favorites:", favoriteMovies);
  } else {
    alert("Movie not found in favorites");
  }
}

async function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      await displayMovieDetails(movie.dataset.id);

      // Create and append button to add to favorites
      const addToFavoritesBtn = document.createElement("button");
      addToFavoritesBtn.textContent = "Add to Favorites";
      addToFavoritesBtn.classList.add("add-to-favorites-btn");
      addToFavoritesBtn.addEventListener("click", () => {
        addToFavorites(movie.dataset.id);
      });

      // Create and append button to remove from favorites
      const removeFromFavoritesBtn = document.createElement("button");
      removeFromFavoritesBtn.textContent = "Remove from Favorites";
      removeFromFavoritesBtn.classList.add("remove-from-favorites-btn");
      removeFromFavoritesBtn.addEventListener("click", () => {
        removeFromFavorites(movie.dataset.id);
      });

      resultGrid.appendChild(addToFavoritesBtn);
      resultGrid.appendChild(removeFromFavoritesBtn);
    });
  });
}

async function displayMovieDetails(movieID) {
  const result = await fetch(
    `http://www.omdbapi.com/?apikey=97564898&i=${movieID}`
  );
  const movieDetails = await result.json();

  if (movieDetails.Response == "True") {
    resultGrid.innerHTML = `
      <div class="movie-poster">
        <img src="${
          movieDetails.Poster !== "N/A"
            ? movieDetails.Poster
            : "image_not_found.png"
        }" alt="movie poster">
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movieDetails.Title}</h3>
        <ul class="movie-misc-info">
          <li class="year">Year: ${movieDetails.Year}</li>
          <li class="rated">Ratings: ${
            movieDetails.Rated ? movieDetails.Rated : "N/A"
          }</li>
          <li class="released">Released: ${
            movieDetails.Released ? movieDetails.Released : "N/A"
          }</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${
          movieDetails.Genre ? movieDetails.Genre : "N/A"
        }</p>
        <p class="writer"><b>Writer:</b> ${
          movieDetails.Writer ? movieDetails.Writer : "N/A"
        }</p>
        <p class="actors"><b>Actors: </b>${
          movieDetails.Actors ? movieDetails.Actors : "N/A"
        }</p>
        <p class="plot"><b>Plot:</b> ${
          movieDetails.Plot ? movieDetails.Plot : "N/A"
        }</p>
        <p class="language"><b>Language:</b> ${
          movieDetails.Language ? movieDetails.Language : "N/A"
        }</p>
        <p class="awards"><b><i class="fa-solid fa-award"></i></i></b> ${
          movieDetails.Awards ? movieDetails.Awards : "N/A"
        }</p>
      </div>`;
  } else {
    resultGrid.innerHTML = "<p>Movie details not found</p>";
  }
}

window.addEventListener("click", (event) => {
  if (event.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
