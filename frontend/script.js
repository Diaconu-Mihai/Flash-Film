window.addEventListener("load", function() {
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

                // Construim URL-ul pentru posterul filmului
                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                // Construim HTML-ul pentru afișarea detaliilor filmului
                const movieDetailsHTML = `
                    <div class="movie-details">
                        <h2>${movie.title}</h2>
                        <div class="poster-container">
                            <img src="${posterUrl}" class="poster">
                            <div class="trailer">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie.videos.results[3].key}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>
                        </div>    
                        <div class="description">
                            <p>${movie.overview}</p>
                        </div>
                        
                        <h4>Distribuție:</h4>
                        <ul>
                            ${movie.credits.cast.map(actor => `<li>${actor.name}</li>`).join('')}
                        </ul>
                        <h4>Recenzii utilizatori:</h4>
                        <ul>
                            ${movie.reviews.results.map(review => `<li>${review.content}</li>`).join('')}
                        </ul> 
                    </div>
                `;

                // Afișăm detaliile filmului în elementul root
                rootElement.innerHTML = movieDetailsHTML;
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Faceți o cerere la API pentru a obține lista de filme și afișați detaliile primului film
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movieId = data.results[3].id;
            showMovieDetails(movieId);
        })
        .catch(error => {
            console.log(error);
        });
});
