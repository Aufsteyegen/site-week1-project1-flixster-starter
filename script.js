let curPage = 1
let searchPage = 1
let query = ""
let queryMovieData = {}
let curMovieRequestData = {}

const movieGrid = document.querySelector('.movies-grid')
const queryGrid = document.querySelector('.query-grid')

const searchButton = document.querySelector("#search-button")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector("#search-form")
const pageExtendButton = document.querySelector('#extend-page')
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzVmN2NjOWViYWZmMDc3NjVhNWY5NjVhOTk0NjAzYyIsInN1YiI6IjY0N2U1YWJhY2NkZTA0MDBjMTNhN2VkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WJ_BQfbTnsJmnqa29im636zyppZ2ZLKL66uLj8ThekA'
    }
};

function displayResults(data) {
    const movies = data.results;
    offset = curPage * 20;
    movies.forEach(movie => {
        const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieGrid.innerHTML += `
            <div class="movie-card">
                <img title="${movie.title}" class="movie-poster" src="${imageURL}">
                <div class="movie-description">
                    <div class="movie-title"><h4 >${movie.title}</h4></div>
                    <div class="movie-votes" title="Average rating: ${movie.vote_average} out of 10" >⭐️ ${movie.vote_average}</h4></div>
                </div>
                </div>
        `
    })
    curPage += 1;
}

async function getCurrentMovies() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${curPage}`
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Success! Request retrieved.');
    curMovieRequestData = data;
    displayResults(curMovieRequestData);
}

async function getMoreCurrentMovies(event) {
    event.preventDefault()
    getCurrentMovies()
}

pageExtendButton.addEventListener("click", getMoreCurrentMovies)

function displayQueryData() {
    const movies = queryMovieData.results;
    offset = searchPage * 20;
    movies.forEach(movie => {
        const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        queryGrid.innerHTML += `
            <div class="movie-card">
                <img title="${movie.title}" class="movie-poster" src="${imageURL}">
                <div class="movie-description">
                    <div class="movie-title"><h4 >${movie.title}</h4></div>
                    <div class="movie-votes" title="Average rating: ${movie.vote_average} out of 10" >⭐️ ${movie.vote_average}</h4></div>
                </div>
            </div>
        `
    })
    searchPage += 1;
}

async function searchMovies() {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${searchPage}`
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Success! Request retrieved.');
    queryMovieData = data;
    displayQueryData();
}

async function handleFormSubmit(event) {
    curPage = 1
    //moreButton.style.display = "block"
    query = searchInput.value
    searchMovies()
    console.log('The form was submitted.')
    searchInput.value = ""
    event.preventDefault()
}

searchForm.addEventListener("submit", handleFormSubmit)
searchButton.addEventListener("click", handleFormSubmit)


window.onload = function () {
    getCurrentMovies()    
} 
