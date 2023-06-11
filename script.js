let curPage = 1, searchPage = 1
let query = null, queryMovieData = null;
let curMovieRequestData = null;
let curMovieDetails = null;
let pageExtendButton = null, pageFooter = null;
let movieID = null;

const movieGrid = document.querySelector('.movies-grid')
const queryGrid = document.querySelector('.query-grid')

const searchButton = document.querySelector("#search-button")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector("#search-form")
const queryCloseButton = document.querySelector("#close-search-btn")

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzVmN2NjOWViYWZmMDc3NjVhNWY5NjVhOTk0NjAzYyIsInN1YiI6IjY0N2U1YWJhY2NkZTA0MDBjMTNhN2VkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WJ_BQfbTnsJmnqa29im636zyppZ2ZLKL66uLj8ThekA'
    }
};

function closeModal() {
    document.querySelector('.movies-modal-inner').innerHTML = ``
    document.querySelector('.movies-modal').style.display = "none"
    document.querySelector('.movies-modal-inner').style.display = "none"
    document.body.classList.remove("body-scroll-lock")
}

function displayMovieDetailsModal () {
    document.querySelector('.movies-modal').style.display = "flex"
    document.body.classList.add("body-scroll-lock")
    document.querySelector('.movies-modal-inner').style.display = "block"
    const backdropURL = `https://image.tmdb.org/t/p/w500${curMovieDetails.backdrop_path}`
    const genreNames = curMovieDetails.genres.map(genre => genre.name).join(', ')
    const languages = curMovieDetails.spoken_languages.map(language => language.english_name).join(', ')
    document.querySelector('.movies-modal-inner').innerHTML += `
    <img class="movie-backdrop" title="${curMovieDetails.original_title} movie backdrop."src="${backdropURL}"/>
    <div class="modal-movie-title">
    <div title="Movie title: ${curMovieDetails.original_title}">${curMovieDetails.original_title}</div>
    <div title="Close modal" class="modal-close-button" onClick=closeModal()>
        <button role="button">
            <div title="Return to currently playing movies">
                <i class="fa-solid fa-x fa-xl"></i>
            </div>
        </button>
    </div>
    </div>
    <div title="Average rating: ${curMovieDetails.vote_average > 0 ? curMovieDetails.vote_average.toFixed(1) : "(No rating)"} out of 10"} class="modal-movie-votes">⭐️ ${curMovieDetails.vote_average > 0 ? curMovieDetails.vote_average.toFixed(1) : "—"}</div>
    <div id="currently-playing-underline">━━━━━━━━━</div>
    <div class="movie-tagline">${curMovieDetails.tagline}</div>
    <div class="modal-movie-details">${curMovieDetails.overview}</div>
    <br>
    <div title="Runtime: ${curMovieDetails.runtime} minutes | Release date: ${curMovieDetails.release_date}" class="modal-movie-details">Runtime: ${curMovieDetails.runtime} minutes <br> Release date: ${curMovieDetails.release_date}</div>
    <div class="movie-genres"></div>
    `
    document.querySelector(".movie-genres").innerHTML += `
    Genres: ${genreNames}<br>
    Languages: ${languages}
    `
}

async function triggerDetailsAPI (ID) {
    movieID = ID
    const url = `https://api.themoviedb.org/3/movie/${movieID}`
    const response = await fetch(url, options);
    const data = await response.json();
    curMovieDetails = data;
    displayMovieDetailsModal();
}

function displayResults (data) {
    const movies = data.results;
    offset = curPage * 20;
    movies.forEach(movie => {
        const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieGrid.innerHTML += `
            <div class="movie-card" id="${movie.id}" onClick="triggerDetailsAPI(${movie.id})">
                <img class="movie-poster" title="${movie.title}" src="${imageURL}">
                <div class="movie-description">
                    <div class="movie-title"><h4 >${movie.title}</h4></div>
                    <div class="movie-votes" title="Average rating: ${movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "(No rating)"} out of 10" >⭐️ ${movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}</h4></div>
                </div>
            </div>
        `
    })
    if (curPage > 1) {
        footer.remove();
    }
    movieGrid.innerHTML += `
        <div id="footer">
            <button title="Button to extend page" id="load-more-movies-btn">
                <div><i class="fa-solid fa-angle-down fa-xl"></i></div>
            </button>
        </div>
    `
    pageExtendButton = document.querySelector('#load-more-movies-btn')
    pageExtendButton.addEventListener("click", getMoreCurrentMovies)
    pageFooter = document.querySelector('#footer')
    curPage += 1;
}

async function getCurrentMovies() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${curPage}`
    const response = await fetch(url, options);
    const data = await response.json();
    curMovieRequestData = data;
    displayResults(curMovieRequestData);
}

async function getMoreCurrentMovies(event) {
    getCurrentMovies()
    event.preventDefault()
}

function clearSearchInput (event) {
    searchInput.value = "" 
    event.preventDefault()
}

function closeQueryData() {
    if (queryGrid.style.display == "flex") {
    queryCloseButton.style.display = "none"
    queryGrid.style.display = "none"
    queryGrid.innerHTML = ``
    movieGrid.style.display = "flex"
    movieGrid.innerHTML = ``
    searchPage = 1
    curPage = 1
    getCurrentMovies()
    document.querySelector('#currently-playing').textContent = "Now in theatres"
    }
}

queryCloseButton.addEventListener("click", closeQueryData)
queryCloseButton.addEventListener("click", clearSearchInput)

async function getMoreSearchedMovies(event) {
    searchPage += 1;
    offset = searchPage * 20;
    searchMovies()
    event.preventDefault()
}

function displayQueryData() {
    const movies = queryMovieData.results;
    queryCloseButton.style.display = "flex"
    if (searchPage == 1) queryGrid.innerHTML = ``
    movies.forEach(movie => {
        const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        queryGrid.style.display = "flex"
        queryGrid.innerHTML += `
            <div class="movie-card" onClick="triggerDetailsAPI(${movie.id})">
                <img class="movie-poster" title="${movie.title}" src="${imageURL}">
                <div class="movie-description">
                    <div class="movie-title"><h4 >${movie.title}</h4></div>
                    <div class="movie-votes" title="Average rating: ${movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "No rating"} out of 10" >⭐️ ${movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}</h4></div>
                </div>
            </div>
        `
    })
    if (searchPage > 1) {
        document.querySelector('#footer2').remove();
    }
    queryGrid.innerHTML += `
        <div id="footer2">
            <button id="extend-search-page">
                <div><i class="fa-solid fa-angle-down fa-xl"></i></div>
            </button>
        </div>
    `
    pageExtendButton = document.querySelector('#extend-search-page')
    pageExtendButton.addEventListener("click", getMoreSearchedMovies)
}


async function searchMovies() {
    movieGrid.style.display = "none"
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${searchPage}`
    const response = await fetch(url, options);
    const data = await response.json();
    document.querySelector('#currently-playing').textContent = `Search results for: "${query}"`
    queryMovieData = data;
    displayQueryData();
}

async function handleFormSubmit(event) {
    curPage = 1
    query = searchInput.value
    if (query.length > 0) {
        searchMovies()
        console.log('The form was submitted.')
        searchInput.value = ""
    }
    event.preventDefault()
}

searchForm.addEventListener("submit", handleFormSubmit)
searchButton.addEventListener("click", handleFormSubmit)

async function handleAutoComplete (event) {
    curPage = 1
    query = searchInput.value
    if (query.length <= 2) {
        closeQueryData()
    }
    else if (query.length >= 3) {
        searchMovies()
        console.log('The form was submitted.')
    }
    event.preventDefault()
}

searchForm.addEventListener("input", handleAutoComplete)

window.onload = function () {
    getCurrentMovies()   
    searchInput.value = ""
} 
