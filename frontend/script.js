window.addEventListener("load", function () {
    const rootElement = document.getElementById("root");

    const apiKey = `e39de4c3c1c2758867914877e0dea313`;
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

    // Funcție pentru a afișa detaliile unui film
    function showMovieDetails(movieId) {
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews,videos`;

        fetch(movieDetailsUrl)
            .then(response => response.json())
            .then(data => {
                const movie = data;
                console.log(data);

                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                rootElement.insertAdjacentHTML("beforeend",
                    ` <div class="movie-details">
                        <h2>${movie.title}</h2>
                        <div class="poster-container">
                            <img src="${posterUrl}" class="poster">
                            <iframe src="https://www.youtube.com/embed/${movie.videos.results[1].key}" class="trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen ></iframe>
                        </div>
                        <button class="rateReview-btn">Rate & Review</button>
                        <button class="wishlist-btn">Add to Wishlist</button>
                        <p>Rating ${movie.vote_average}</p>
                        <div class="description">
                            <p>Description:</p>
                            <p>${movie.overview}</p>
                        </div>
                        <h3>Cast:</h3>
                        <div class="cast-container">
                            ${movie.credits.cast.slice(0, 5).map(actor => `
                                <div class="actor">
                                    <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}" class="actor-image">
                                    <p class="actor-name">${actor.name}</p>
                                </div>`).join('')}
                            <div class="hidden-actors">
                                ${movie.credits.cast.slice(3).map(actor => `
                                    <div class="actor">
                                        <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}" class="actor-image">
                                        <p class="actor-name">${actor.name}</p>
                                    </div>`).join('')}
                            </div>
                        <button class="more-btn">More</button>
                        </div>
                        <h3>Critics reviews:</h3>
                        <ul class="critics-reviews-list">
                            ${movie.reviews.results.map(review => `<li>${review.content}</li>`).join('')}
                        </ul>
                    </div>
                `);

                const rateReviewBtn = rootElement.querySelector('.rateReview-btn');
                const wishlistBtn = rootElement.querySelector('.wishlist-btn');
                const moreBtn = rootElement.querySelector('.more-btn');
                const hiddenActors = rootElement.querySelector('.hidden-actors');

                rateReviewBtn.addEventListener('click', () => {
                    console.log('Review button clicked');
                });

                wishlistBtn.addEventListener('click', () => {
                    console.log('Wishlist button clicked');
                });

                moreBtn.addEventListener('click', () => {
                    hiddenActors.classList.toggle('show');
                    moreBtn.textContent = hiddenActors.classList.contains('show') ? 'Less' : 'More';
                });

            })
            .catch(error => {
                console.log(error);
            });

    };
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movieId = data.results[17].id;
            showMovieDetails(movieId);
        })
        .catch(error => {
            console.log(error);
        });
})