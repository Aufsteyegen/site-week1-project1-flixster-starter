const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzVmN2NjOWViYWZmMDc3NjVhNWY5NjVhOTk0NjAzYyIsInN1YiI6IjY0N2U1YWJhY2NkZTA0MDBjMTNhN2VkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WJ_BQfbTnsJmnqa29im636zyppZ2ZLKL66uLj8ThekA'
    }
  };

fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        const movieGrid = document.querySelector('.movies-grid')
        movies.forEach(movie => {
            const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieGrid.innerHTML += `
                <div class="movie-card">
                    <h4 class="movie-title">${movie.title}</h4>
                    <img class="movie-poster" src="${imageURL}">
                    <h4 class="movie-votes">⭐️ ${movie.vote_average}</h4>
                </div>
            `
        })})
    .catch(err => console.error(err));

