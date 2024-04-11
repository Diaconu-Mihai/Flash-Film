window.addEventListener("load", function () {
    const page = window.location.pathname.substring(1);
    const rootElement = document.getElementById("root");
    console.log(page);
    if (page == "") {

        const apiKey = `e39de4c3c1c2758867914877e0dea313`;
        const movieTitle = `Avatar`;
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const movie = data.results[0];
                rootElement.insertAdjacentHTML('beforeend',
                    `
                <h2>${movie.title}</h2>
                <p>${movie.overview}</p>
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title} Poster">
                `)
            })
            .catch(error => {
                console.log(error);
            });
    }
    else if (page == "newuser") {
        rootElement.innerHTML = ""
        rootElement.insertAdjacentHTML('beforeend',
            `
        <h2>Create New User</h2>
        <form id="newUserForm">
            <label>Username:</label>
            <input type="text" id="username" required><br>
            <label>Email:</label>
            <input type="email" id="email" required><br>
            <label>Password:</label>
            <input type="password" id="password"required><br>
            <button type="submit">Create User</button>
        </form>
        `)
    }
});
