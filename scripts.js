const API_KEY = '7a47f7c1221e45aa9a85e81c98bbb23f';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const API_URL = 'https://api.themoviedb.org/3';
const POPULAR_MOVIES_ENDPOINT = '/movie/popular';

const ITEMS_PER_PAGE = 10;
const TOTAL_PAGES = 5;
let currentPage = 1;


let isHorizontalView = true; 


$(document).ready(function () {
  
  
  $('#searchButton').on('click', function () {
    const title = $('#searchTitleInput').val();
    const year = $('#searchYearInput').val();
    if (title.trim() !== '' || year.trim() !== '') {
      currentPage = 1; 
      searchMovies(title, year, currentPage);
    }
  });



  $('#toggleViewButton').on('click', function () {
    toggleView(); 
  });

  $('#clearButton').on('click', function () {
    clearInputs(); 
  });
  

  $('#showTopRatedBtn').on('click', function () {
    showTopRatedMovies();
  });




  $("#actorInfoBtn").on("click", function() {
    getActorInfo();
  });



  $('#showPopularMovies').on('click', function () {
    currentPage = 1; 
    fetchPopularMovies(currentPage);
  });
  $('#nextPageBtn').on('click', function () {
    if (currentPage < TOTAL_PAGES) {
      currentPage++;
      searchMovies($('#searchTitleInput').val(), $('#searchYearInput').val(), currentPage);
    }
  });

  $('#prevPageBtn').on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      searchMovies($('#searchTitleInput').val(), $('#searchYearInput').val(), currentPage);
    }
  });





});




function getActorInfo() {
  const actorId = '7a47f7c1221e45aa9a85e81c98bbb23f';
  const url = `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`;

  $.ajax({
    url: url,
    method: "GET",
    success: function(data) {
      displayActorInfo(data);
    },
    error: function(err) {
      console.error("Error fetching actor info:", err);
    }
  });
}
function displayActorInfo(actorData) {
  const actorInfoDiv = $("#actorInfo");
  actorInfoDiv.html(`
    <h2>${actorData.name}</h2>
    <p><strong>Birthday:</strong> ${actorData.birthday}</p>
    <p><strong>Place of Birth:</strong> ${actorData.place_of_birth}</p>
    <p><strong>Biography:</strong></p>
    <p>${actorData.biography}</p>
    <p><strong>Popularity:</strong> ${actorData.popularity}</p>
  `);
}




function fetchPopularMovies(page) {
  $.ajax({
    url: `${API_URL}${POPULAR_MOVIES_ENDPOINT}?api_key=${API_KEY}&page=${page}`,
    method: 'GET',
    success: function (data) {
      displayMovies(data.results);
      updatePagination(data.total_pages, page);
    },
    error: function (error) {
      console.error('Error fetching popular movies:', error);
    }
  });
}

function displayMovies(movies) {
  const moviesContainer = $('#moviesContainer');
  moviesContainer.empty();
  movies.forEach(movie => {
    const movieElement = `
      <div>
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
        <p>${movie.overview}</p>
      </div>
    `;
    moviesContainer.append(movieElement);
  });
}

$('#showPopularMovies').on('click', function () {
  fetchPopularMovies();
});



function showTopRatedMovies() {
  const apiUrl = `${API_URL}/movie/top_rated?api_key=${API_KEY}`;

  $.ajax({
    url: apiUrl,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      displayMovies(data.results);
    },
    error: function (error) {
      console.error('Error fetching top rated movies:', error);
    }
  });
}

function displayMovies(movies) {
  const moviesContainer = $('#moviesContainer');
  moviesContainer.empty();
  movies.forEach(movie => {
    const movieElement = `
      <div>
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
        <p>${movie.overview}</p>
      </div>
    `;
    moviesContainer.append(movieElement);
  });
}


function clearInputs() {
  $('#searchTitleInput').val(''); 
  $('#searchYearInput').val(''); 
}


function toggleView() {
  const movieResults = $('#movieResults');
  const searchTerm = $('#searchInput').val();

  if (movieResults.children().length === 0) {
    return;
  }

  if (isHorizontalView) {
    movieResults.removeClass('movie-results');
    movieResults.addClass('movie-results-vertical');
  } else {
    movieResults.removeClass('movie-results-vertical');
    movieResults.addClass('movie-results');
  }

  isHorizontalView = !isHorizontalView; 

  currentPage = 1; 
  searchMovies(searchTerm, currentPage);
}



function searchMovies(title, year, page) {
  let url = `${BASE_URL}?api_key=${API_KEY}`;

  if (title.trim() !== '') {
    url += `&query=${encodeURIComponent(title)}`;
  }

  if (year.trim() !== '') {
    url += `&year=${year}`;
  }

  if (page > 0) {
    url += `&page=${page}`;
  }

  $.ajax({
    url: url,
    method: 'GET',
    success: function (response) {
      const movies = response.results.slice(0, ITEMS_PER_PAGE);
      displayMovies(movies);
      displayPagination(response.total_pages);
    },
    error: function (error) {
      console.error('Error fetching movie data:', error);
    }
  });
}

function filterMoviesByYear(movies, year) {
  if (year.trim() === '') {
    return movies;
  }

  return movies.filter(movie => {
    const releaseDate = movie.release_date;
    if (releaseDate) {
      const releaseYear = parseInt(releaseDate.split('-')[0]);
      return releaseYear === parseInt(year);
    }
    return false;
  });
}

function displayMovies(movies) {
  const movieResults = $('#movieResults');
  movieResults.empty();

  if (movies.length === 0) {
    movieResults.append('<p>No movies found.</p>');
    return;
  }

  for (const movie of movies) {
    const movieCard = `
      <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        <div class="movie-details">
          <h3>${movie.title}</h3>
          <p><strong>Release Date:</strong> ${movie.release_date}</p>
          <p><strong>Description:</strong> ${movie.overview}</p>
        </div>
        <div class="movie-buttons">
          <button class="btn-add-to-fav" data-movie-id="${movie.id}">Add to Fav</button>
          <button class="btn-add-to-watchlist" data-movie-id="${movie.id}">Add to Watchlist</button>
        </div>
      </div>`;
    movieResults.append(movieCard);
  }
  $('.btn-add-to-fav').on('click', function () {
    const movieId = $(this).attr('data-movie-id');
    addToFavorites(movieId);
  });

  $('.btn-add-to-watchlist').on('click', function () {
    const movieId = $(this).attr('data-movie-id');
    addToWatchlist(movieId);
  });



}

function addToFavorites(movieId) {
  
}

function addToWatchlist(movieId) {
  
}


