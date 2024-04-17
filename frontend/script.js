window.addEventListener("load", function() {
    const rootElement = document.getElementById("root");
    const searchBox = document.getElementById("form-control");
    const searchButton = document.getElementById("searchButton");
    const movieSearchBox = document.getElementById('movie-search-box');
    const searchList = document.getElementById('search-list');


    const apiKey = `e39de4c3c1c2758867914877e0dea313`
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`

    searchBox.addEventListener("input", function() {
        if (searchBox.value.trim() !== "") {
            searchButton.disabled = false;
            searchButton.style.backgroundColor = "#8A2BE2"; 
        } else {
            searchButton.disabled = true;
            searchButton.style.backgroundColor = "007bff"; 
        }
    });

    searchButton.addEventListener("click", function() {
        console.log("Search button clicked!");
    });

    
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

