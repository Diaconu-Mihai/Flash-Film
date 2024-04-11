window.addEventListener("load", function() {
    const rootElement = document.getElementById("root");

    const apiKey = `e39de4c3c1c2758867914877e0dea313`
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movie = data["results"][15];
            console.log(movie);

            const posterUrl= `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

            rootElement.insertAdjacentHTML("beforeend", 
            `<div class="movie">
                <div class="title">${movie.title}</div>
                <img src="${posterUrl}" class="poster">
                </div>

                <div class="description">${movie.overview}</div>
                `)
        })
        .catch(error => {
            console.log(error);
        })
})


window.addEventListener("load", function() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    
    searchInput.addEventListener("input", function() {
        if (searchInput.value.trim() !== "") {
            searchButton.disabled = false; 
            searchButton.style.backgroundColor = "#7B00FF"; 
        } else {
            searchButton.disabled = true; 
            searchButton.style.backgroundColor = "#007BFF"; 
        }
    });
});