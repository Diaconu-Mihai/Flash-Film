window.addEventListener("load", function() {
    //const rootElement = document.getElementById("root");

    const apiKey = `e39de4c3c1c2758867914877e0dea313`
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
})
