window.addEventListener("load", function () {
  window.addEventListener("scroll", function () {
    var footer = document.getElementById("footer");
    var scrollPosition =
      window.scrollY ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop ||
      0;

    if (scrollPosition > 100) {
      // Poți ajusta această valoare în funcție de cât de mult trebuie să facă scroll utilizatorul pentru a face footer-ul vizibil
      footer.style.bottom = "0";
    } else {
      footer.style.bottom = "-100px";
    }
  });


let genre = "None"
  var filterButton = document.getElementById("filterButton");
  var filterPopup = document.getElementById("filterPopup");

  // Move the filter button to the left side of the search bar
  var navbarCenter = document.querySelector(".navbar-center");
  navbarCenter.insertBefore(filterButton, navbarCenter.firstChild);
  var closeButton = filterPopup.querySelector(".close");
  

  filterButton.addEventListener("click", function () {
    
    // Position the popup below the filter button
    var filterButtonRect = filterButton.getBoundingClientRect();
    filterPopup.style.left = filterButtonRect.left + "px";
    filterPopup.style.top =
      filterButtonRect.bottom + window.scrollY + "px";

    filterPopup.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    filterPopup.style.display = "none";
  });

  // Ascunde popup-ul când se face clic în afara acestuia
  window.addEventListener("click", function (event) {
    if (event.target == filterPopup) {
      filterPopup.style.display = "none";
    }
  });

  const formFilter = document.getElementById("formFilter");
  

  const page = window.location.pathname.substring(1);
  const rootElement = document.getElementById("root");
  let userNames = [];
  let emails = [];

  Promise.all([
    fetch("/admins").then((response) => response.json()),
    fetch("/users").then((response) => response.json()),
  ])
    .then(([adminsData, usersData]) => {
      adminsData.forEach((admin) => {
        userNames.push(admin.username);
        emails.push(admin.email);
      });
      usersData.forEach((user) => {
        userNames.push(user.username);
        emails.push(user.email);
      });

      if (page === "home") {
        const apiKey = `e39de4c3c1c2758867914877e0dea313`;
        // const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

        function showMovieDetails(movieId) {
          const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews,videos`;

          fetch(movieDetailsUrl)
            .then((response) => response.json())
            .then((data) => {
              const movie = data;
              console.log(data);

              const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

              let trailer = movie.videos.results.length - 1;
              console.log(trailer);

              const genres = movie.genres.map((genre) => genre.name).join(", ");

              rootElement.insertAdjacentHTML(
                "beforeend",
                ` <div class="movie-details">
                                    <h1>${movie.title}</h1>
                                    <div class="poster-container">
                                        <img src="${posterUrl}" class="poster">
                                        <iframe src="https://www.youtube.com/embed/${
                                          movie.videos.results[trailer].key
                                        }" class="trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen ></iframe>
                                    </div>
                                    <button class="rateReview-btn">Rate & Review</button>
                                    <button class="watchlist-btn">Add to Watchlist</button>
                                    <h3>Rating ${movie.vote_average}</h3>
                                
                                    <div class="description">
                                        <h3>Description: </h3>
                                        <p>${movie.overview}</p>
                                    </div>

                                    <div class="release-date">
                                        <h3>Release Date: ${
                                          movie.release_date
                                        }</h3>
                                    </div>

                                    <h3>Genres: ${genres}</h3>

                                    <h3>Runtime: ${movie.runtime} minutes</h3>

                                    <h3>Cast:</h3>
                                    <div class="cast-container">
                                        ${movie.credits.cast
                                          .slice(0, 6)
                                          .map(
                                            (actor) => `
                                            <div class="actor">
                                                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
                                                <p class="actor-name">${actor.name}</p>
                                            </div>`
                                          )
                                          .join("")}
                                        <div class="hidden-actors">
                                            ${movie.credits.cast
                                              .slice(6)
                                              .map(
                                                (actor) => `
                                                <div class="actor">
                                                    <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
                                                    <p class="actor-name">${actor.name}</p>
                                                </div>`
                                              )
                                              .join("")}
                                        </div>
                                    
                                    </div>
                                    <button class="more-btn">More</button>
                                    <h3>Critics reviews:</h3>
                                    <ul class="critics-reviews-list">
                                        ${movie.reviews.results
                                          .map(
                                            (review) =>
                                              `<li>${review.content}</li>`
                                          )
                                          .join("")}
                                    </ul>
                                </div>
                            `
              );

              const rateReviewBtn =
                rootElement.querySelector(".rateReview-btn");
              const watchlistBtn = rootElement.querySelector(".watchlist-btn");
              const moreBtn = rootElement.querySelector(".more-btn");
              const hiddenActors = rootElement.querySelector(".hidden-actors");

              rateReviewBtn.addEventListener("click", () => {
                console.log("Review button clicked");
              });

              watchlistBtn.addEventListener("click", () => {
                console.log("Watchlist button clicked");
              });

              moreBtn.addEventListener("click", () => {
                hiddenActors.classList.toggle("show");
                moreBtn.textContent = hiddenActors.classList.contains("show")
                  ? "Less"
                  : "More";
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }

        function showMovies(url) {
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              const movies = data.results.slice(0, 9);
              rootElement.innerHTML = `<div class="movies-grid"></div>`;

              const moviesGrid = document.querySelector(".movies-grid");

              movies.forEach((movie) => {
                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                moviesGrid.insertAdjacentHTML(
                  "beforeend",
                  `<div class="movie" data-movie-id="${movie.id}">
                  <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
                  <p class="movie-title">${movie.title}</p>
                </div>`
                );
              });

              const movieElements = document.querySelectorAll(".movie");
              movieElements.forEach((movieElement) => {
                movieElement.addEventListener("click", function () {
                  const movieId = this.getAttribute("data-movie-id");
                  console.log(movieId);
                  rootElement.innerHTML = "";
                  showMovieDetails(movieId);
                });
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }

        let movieTitle = `Avatar`;
        const searchBar = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");
        console.log(searchButton);

        var apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
        

        showMovies(apiUrl);

        formFilter.addEventListener("submit", function (event) {
          event.preventDefault();
          console.log(formFilter.elements.selectGenre.options[formFilter.elements.selectGenre.selectedIndex]);
          var idGenre= formFilter.elements.selectGenre.options[formFilter.elements.selectGenre.selectedIndex].id;
          var minLength=formFilter.elements.runtimeMin.value;
          var maxLength=formFilter.elements.runtimeMax.value;
          var minRating = formFilter.elements.ratingMin.value; 
          var maxRating = formFilter.elements.ratingMax.value; 
          var minYear = formFilter.elements.yearMin.value; 
          var maxYear = formFilter.elements.yearMax.value; 
         

          apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
         
          if (formFilter.elements.selectGenre.value !== "None") {
            apiUrl += `&with_genres=${idGenre}`;
        }

        if(minLength !== "" && maxLength !== ""){
          apiUrl += `&with_runtime.gte=${minLength}&with_runtime.lte=${maxLength}`;
      } else if(minLength !== ""){
          apiUrl += `&with_runtime.gte=${minLength}`;
      } else if(maxLength !== ""){
          apiUrl += `&with_runtime.lte=${maxLength}`;
      }

        if (minRating !== "" && maxRating !== "") { 
          apiUrl += `&vote_average.gte=${minRating}&vote_average.lte=${maxRating}`;
        } else if (minRating !== "") {
          apiUrl += `&vote_average.gte=${minRating}`;
        } else if (maxRating !== "") {
          apiUrl += `&vote_average.lte=${maxRating}`;
        }

        if (minYear !== "" && maxYear !== "") { 
          apiUrl += `&primary_release_year=${minYear}:${maxYear}`;
        } else if (minYear !== "") {
          apiUrl += `&primary_release_year=${minYear}`;
        } else if (maxYear !== "") {
          apiUrl += `&primary_release_year=${maxYear}`;
        }

        

        
    
          showMovies(apiUrl);
        });

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

          const apiUrlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            movieTitle
          )}`;

          showMovies(apiUrlMovie);
        });
      } else if (page == "newuser") {
        rootElement.innerHTML = "";
        rootElement.insertAdjacentHTML(
          "beforeend",
          `
                            <h2>Create New User</h2>
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
                                <button type="submit">Create User</button>
                            </form>
                            <div id="message"></div>
                            `
        );

        const form = document.getElementById("newUserForm");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          const message = document.getElementById("message");
          message.innerHTML = "";
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
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});