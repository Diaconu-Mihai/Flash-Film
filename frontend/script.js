function showMovieDetails(movieId, rootElement) {
  const apiKey = `e39de4c3c1c2758867914877e0dea313`;
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews,videos`;

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Retrieve logged-in user data

  fetch(movieDetailsUrl)
    .then((response) => response.json())
    .then((data) => {
      const movie = data;
      console.log(data);

      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      let trailer = movie.videos.results.length - 1;

      const genres = movie.genres.map((genre) => genre.name).join(", ");

      const isInWatchlist = loggedInUser && loggedInUser.favmovies.includes(movie.title);

      rootElement.innerHTML = `<div class="movie-details">
        <h1>${movie.title}</h1>
        <div class="poster-container">
          <img src="${posterUrl}" class="poster">
          ${movie.videos.results.length > 0
            ? `<iframe src="https://www.youtube.com/embed/${movie.videos.results[trailer].key}" class="trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen ></iframe>`
            : `<p>No trailer available!</p>`
          }
        </div>
        <div id="reviews">Reviews: </div> 
        <div class="rate-review-btn">
        ${loggedInUser ? `<button class="rateReview-btn">Rate & Review</button>` : ''}
        ${loggedInUser ? `<button class="watchlist-btn">${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</button>` : ''}
        </div>
        <h3>Rating ${movie.vote_average}</h3>
        <div class="description">
          <h3>Description: </h3>
          <p>${movie.overview}</p>
        </div>
        <div class="release-date">
          <h3>Release Date: ${movie.release_date}</h3>
        </div>
        <h3>Genres: ${genres}</h3>
        <h3>Runtime: ${movie.runtime} minutes</h3>
        <h3>Cast:</h3>
        <div class="cast-container">${movie.credits.cast.slice(0, 6).map((actor) =>
          `<div class="actor">
            <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
            <p class="actor-name">${actor.name}</p>
          </div>`).join("")}
          <div class="hidden-actors">${movie.credits.cast.slice(6).map((actor) =>
            `<div class="actor">
              <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
              <p class="actor-name">${actor.name}</p>
            </div>`).join("")}
          </div>
        </div>
        <button class="more-btn">More</button>
        <h3>Critics reviews:</h3>
        <ul class="critics-reviews-list">${movie.reviews.results.map((review) =>
          `<li>${review.content}</li>`).join("")}
        </ul>
      </div>`;

      if (loggedInUser) {
        const rateReviewBtn = rootElement.querySelector(".rateReview-btn");
        rateReviewBtn.addEventListener('click', () =>{
          if (document.getElementById('reviewDialog')) {
            document.getElementById('reviewDialog').remove();
          }
          else{
            let reviewDialog = document.createElement('div');
            reviewDialog.id = 'reviewDialog';
            reviewDialog.classList.add('review-dialog');
            reviewDialog.innerHTML = 
              `<form id="reviewForm">
                <label for="review">Review:</label>
                <textarea id="review" rows="4" cols="50" required placeholder="Write review..."></textarea><br>
                <label for="rating">Rating (1-10):</label>
                <input type="number" id="rating" min="1" max="10" required><br>
                <button type="submit" id="submitButton">Submit Review</button>
              </form>`;
            const movieDetails = rootElement.querySelector('.rate-review-btn');
            movieDetails.appendChild(reviewDialog);
          }
        });

        const watchlistBtn = rootElement.querySelector(".watchlist-btn");
        if (watchlistBtn) {
          watchlistBtn.addEventListener("click", () => {
            const action = isInWatchlist ? 'remove' : 'add';
            fetch(`/watchlist/${action}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId: loggedInUser.id, movieTitle: movie.title })
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              loggedInUser.favmovies = data.favmovies;
              localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
              watchlistBtn.textContent = isInWatchlist ? 'Add to Watchlist' : 'Remove from Watchlist';
            })
            .catch(error => console.error('Error:', error));
          });
        }
      }

      const moreBtn = rootElement.querySelector(".more-btn");
      const hiddenActors = rootElement.querySelector(".hidden-actors");

      moreBtn.addEventListener("click", () => {
        hiddenActors.classList.toggle("show");
        moreBtn.textContent = hiddenActors.classList.contains("show") ? "Less" : "More";
      });
    })
    .catch((error) => {
      console.log(error);
    });
}




if (typeof global === 'undefined') {
  var global = {};
}

function updateNavBar(user) {
  const navbarRight = document.querySelector('.navbar-right');
  navbarRight.innerHTML = '';

  if (user) {
    navbarRight.innerHTML = `
      <span>${user.username}</span>
      <button id="favoriteButton">Favorite movies</button>
      <button id="logoutButton">Log Out</button>
    `;
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
      // Clear the user session or token here (based on your authentication logic)
      localStorage.removeItem('loggedInUser');
      location.reload();
    });

    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.addEventListener('click', () => {
      showFavouriteMovies(user.favmovies);
    });
  } else {
    navbarRight.innerHTML = `
      <button id="SignUpButton"><a href="/newuser">Sign Up</a></button>
      <button id="LogInButton"><a href="/login">Log In</a></button>
    `;
  }
}

function fetchMovieDetailsByTitle(movieTitle, moviesGrid) {
  // Fetch movie details based on its title
  const apiKey = `e39de4c3c1c2758867914877e0dea313`;
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;

  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
          <p class="movie-title">${movie.title}</p>
        `;
        
        // Add click event listener to show movie details
        movieElement.addEventListener('click', () => {
          // Call the showMovieDetails function to display the movie details
          showMovieDetails(movie.id, document.getElementById('root'));
        });
        
        moviesGrid.appendChild(movieElement);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}


function showFavouriteMovies(favMovies) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = '';

  if (favMovies.length === 0) {
    rootElement.innerHTML = '<p>No favorite movies found!</p>';
    return;
  }

  const moviesGrid = document.createElement('div');
  moviesGrid.classList.add('movies-grid');

  favMovies.forEach(movieTitle => {
    fetchMovieDetailsByTitle(movieTitle, moviesGrid);
  });

  rootElement.appendChild(moviesGrid);
}


function showMovies(url, rootElement, loggedInUser) {
  // Fetch and display favorite movies if a logged-in user exists
  if (loggedInUser && loggedInUser.favmovies.length > 0) {
    showFavouriteMovies(loggedInUser.favmovies);
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results.slice(0, 9);
      const moviesGrid = (typeof document !== 'undefined' ? document : global.document).createElement('div'); // Use global.document if document is not defined
      moviesGrid.classList.add('movies-grid');

      if (movies.length === 0) {
        const noMoviesMessage = (typeof document !== 'undefined' ? document : global.document).createElement('p');
        noMoviesMessage.textContent = 'No movie found!';
        rootElement.innerHTML = '';
        rootElement.appendChild(noMoviesMessage);
        return;
      }

      movies.forEach((movie) => {
        const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const movieElement = (typeof document !== 'undefined' ? document : global.document).createElement('div'); // Use global.document if document is not defined
        movieElement.classList.add('movie');
        movieElement.dataset.movieId = movie.id;
        movieElement.innerHTML = `
          <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
          <p class="movie-title">${movie.title}</p>
        `;
        movieElement.addEventListener('click', function () {
          const movieId = this.getAttribute('data-movie-id');
          //console.log(movieId);
          rootElement.innerHTML = '';
          showMovieDetails(movieId, rootElement);
        });
        moviesGrid.appendChild(movieElement);
      });

      rootElement.innerHTML = '';
      rootElement.appendChild(moviesGrid);


    })
    .catch((error) => {
      console.log(error);
    });
}




if (typeof window !== "undefined") {
window.addEventListener("load", function () {

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  updateNavBar(loggedInUser);

  window.addEventListener("scroll", function () {
    var footer = document.getElementById("footer");
    var scrollPosition = window.scrollY || (document.documentElement || document.body.parentNode || document.body).scrollTop || 0;

    if (scrollPosition > 100) {

      footer.style.bottom = "0";
    } else {
      footer.style.bottom = "-100px";
    }
  });
  const page = window.location.pathname.substring(1);
  const rootElement = document.getElementById("root");
  let userNames = [];
  let emails = [];



 
    
    fetch("/users")
    .then((response) => response.json())
    .then((usersData) => {
      usersData.forEach((user) => {
        userNames.push(user.username);
        emails.push(user.email);
      });

      if (page === "home") {

        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=e39de4c3c1c2758867914877e0dea313`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            console.log(error);
          });
        


     
        const apiKey = `e39de4c3c1c2758867914877e0dea313`;

        // function showMovies(url) {
        //   fetch(url)
        //     .then((response) => response.json())
        //     .then((data) => {

        //       const movies = data.results.slice(0, 9);
        //       rootElement.innerHTML = `<div class="movies-grid"></div>`;

        //       const moviesGrid = document.querySelector(".movies-grid");

        //       movies.forEach((movie) => {
        //         const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        //         moviesGrid.insertAdjacentHTML("beforeend",
        //           `<div class="movie" data-movie-id="${movie.id}">
        //           <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
        //           <p class="movie-title">${movie.title}</p>
        //         </div>`
        //         );
        //       });

        //       const movieElements = document.querySelectorAll(".movie");
        //       movieElements.forEach((movieElement) => {
        //         movieElement.addEventListener("click", function () {
        //           const movieId = this.getAttribute("data-movie-id");
        //           console.log(movieId);
        //           rootElement.innerHTML = "";
        //           showMovieDetails(movieId, rootElement);
        //         });
        //       });
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });

        // }

        let movieTitle;
        const searchBar = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");
        console.log(searchButton);

        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
        showMovies(apiUrl, rootElement)

        searchBar.addEventListener("input", function () {
          if (searchBar.value.length >= 3) {
            searchButton.disabled = false;
          } else {
            searchButton.disabled = true;
          }
        });

        const searchForm = document.getElementById("searchForm");
        searchForm.addEventListener("submit", function (event) {
          event.preventDefault();
          rootElement.innerHTML = "";
          movieTitle = searchBar.value;
          console.log(movieTitle);

          const apiUrlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;
          showMovies(apiUrlMovie, rootElement)

        });
        window.showMovieDetails = showMovieDetails;
      } else if (page == "newuser") {
        rootElement.innerHTML = "";
        rootElement.insertAdjacentHTML("beforeend",
          `<h2>Create New User</h2>
          <form id="newUserForm">
            <label>Name:</label>
            <input type="text" id="name" required><br>
            <label>Surname:</label>
            <input type="text" id="surname" required><br>
            <label>Username:</label>
            <input type="text" id="username" required><br>
            <label>Email:</label>
            <input type="email" id="email" required><br>
            <label>Password:</label>
            <input type="password" id="password" required><br>
            <button type="submit" id="createUser">Create User</button>
          </form>
          <div id="message"></div>`
        );

        const form = document.getElementById("newUserForm");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          const message = document.getElementById("message");
          message.innerHTML = "";
          console.log(form.elements);
          userNames.forEach((userName) => {
            if (form.elements.username.value === userName) {
              message.innerHTML = "This username already exists!";
            }
          });
          emails.forEach((email) => {
            if (form.elements.email.value === email) {
              message.innerHTML = "This email already exists!";
            }
          });
          const password = form.elements.password.value;
          if (password.length < 6) {
            message.innerHTML = "Password must be at least 6 characters!";
          } else if (!/[a-z]/.test(password)) {
            message.innerHTML =
              "Password must contain at least one lowercase letter!";
          } else if (!/[A-Z]/.test(password)) {
            message.innerHTML =
              "Password must contain at least one uppercase letter!";
          } else if (!/\d/.test(password)) {
            message.innerHTML = "Password must contain at least one number!";
          }
          if (message.innerHTML === "") {
            const formData = {
              id: [],
              name: form.elements.name.value,
              surname: form.elements.surname.value,
              username: form.elements.username.value,
              email: form.elements.email.value,
              password: form.elements.password.value,
              favmovies: [],
            };
            fetch("/newuser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
      } else if (page === "login") {
        rootElement.innerHTML = "";
        rootElement.insertAdjacentHTML("beforeend", `
          <h2>Log In</h2>
          <form id="loginForm">
            <label>Email:</label>
            <input type="email" id="email" required><br>
            <label>Password:</label>
            <input type="password" id="password" required><br>
            <button type="submit" id="loginButton">Log In</button>
          </form>
          <div id="message"></div>
        `);

        const form = document.getElementById("loginForm");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          const email = form.elements.email.value;
          const password = form.elements.password.value;
          const message = document.getElementById("message");

          // Replace the following logic with your actual authentication logic
          const user = usersData.find(user => user.email === email && user.password === password);
          if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = "/home";
          } else {
            message.textContent = "Invalid email or password.";
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
}
module.exports = { showMovieDetails, showMovies };