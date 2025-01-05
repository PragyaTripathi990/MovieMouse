const API_KEY = 'b4ce170023d68ccd60d1c53e975bd533';
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');
const reviewsContainer = document.getElementById('reviews-container');
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments-container');

async function fetchMovieData(movieTitle) {
  try {
    const searchResponse = await fetch(`${SEARCH_URL}${movieTitle}`);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      movieContainer.innerHTML = `<p>No movie found with the title "${movieTitle}".</p>`;
      return;
    }

    const movie = searchData.results[0];
    const movieId = movie.id;

    movieContainer.innerHTML = `
      <h3>${movie.title}</h3>
      <p><strong>Rating:</strong> ${generateStars(movie.vote_average)}</p>
      <p><strong>Summary:</strong> ${movie.overview}</p>
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
    `;

    const reviewsResponse = await fetch(`${MOVIE_DETAILS_URL}/${movieId}/reviews?api_key=${API_KEY}`);
    const reviewsData = await reviewsResponse.json();

    reviewsContainer.innerHTML = reviewsData.results.length
      ? reviewsData.results.map(review => `<div class="review"><p><strong>${review.author}</strong>: ${review.content}</p></div>`).join('')
      : '<p>No reviews available for this movie.</p>';
  } catch (error) {
    console.error('Error fetching movie data:', error);
    movieContainer.innerHTML = `<p>Failed to load movie details. Please try again later.</p>`;
    reviewsContainer.innerHTML = `<p>Failed to load reviews. Please try again later.</p>`;
  }
}

commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userName = document.getElementById('user-name').value.trim();
  const userId = document.getElementById('user-id').value.trim();
  const commentText = document.getElementById('comment-text').value.trim();

  if (userName && userId && commentText) {
    commentsContainer.innerHTML += `
      <div class="user-comment">
        <p><strong>${userName} (ID: ${userId}):</strong> ${commentText}</p>
      </div>
    `;
    commentForm.reset();
  }
});

function generateStars(rating) {
  const stars = Math.round(rating / 2);
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const movieTitle = searchInput.value.trim();
  if (movieTitle) {
    fetchMovieData(movieTitle);
  }
});
