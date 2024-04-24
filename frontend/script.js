window.addEventListener("load", function () {
    const page = window.location.pathname.substring(1)
    const rootElement = document.getElementById("root")
    let userNames = []
    let emails = []

    Promise.all([
        fetch('/admins').then(response => response.json()),
        fetch('/users').then(response => response.json())
    ])
        .then(([adminsData, usersData]) => {
            adminsData.forEach(admin => {
                userNames.push(admin.username)
                emails.push(admin.email)
            })
            usersData.forEach(user => {
                userNames.push(user.username)
                emails.push(user.email)
            })
            if (page == "movieDetails") {

                const apiKey = `e39de4c3c1c2758867914877e0dea313`
                const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

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
                                    <iframe src="https://www.youtube.com/embed/${movie.videos.results[5].key}" class="trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen ></iframe>
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
                                    ${movie.credits.cast.slice(0, 6).map(actor => `
                                        <div class="actor">
                                            <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
                                            <p class="actor-name">${actor.name}</p>
                                        </div>`).join('')}
                                    <div class="hidden-actors">
                                        ${movie.credits.cast.slice(6).map(actor => `
                                            <div class="actor">
                                                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" class="actor-image">
                                                <p class="actor-name">${actor.name}</p>
                                            </div>`).join('')}
                                    </div>
                                
                                </div>
                                <button class="more-btn">More</button>
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

            
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        const movieId = data.results[9].id;
                        showMovieDetails(movieId);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            else if (page == "newuser") {
                rootElement.innerHTML = ""
                rootElement.insertAdjacentHTML('beforeend',
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
                )

                const form = document.getElementById("newUserForm")
                form.addEventListener("submit", function (event) {
                    event.preventDefault()
                    const message = document.getElementById("message")
                    message.innerHTML = ""
                    userNames.forEach(userName => {
                        if (form.elements.username.value === userName) {
                            message.innerHTML = "This username already exists!"
                        }
                    })
                    emails.forEach(email => {
                        if (form.elements.email.value === email) {
                            message.innerHTML = "This email already exists!"
                        }
                    })
                    const password = form.elements.password.value
                    if (password.length < 6) {
                        message.innerHTML = "Password must be at least 6 characters!"
                    } else if (!/[a-z]/.test(password)) {
                        message.innerHTML = "Password must contain at least one lowercase letter!";
                    } else if (!/[A-Z]/.test(password)) {
                        message.innerHTML = "Password must contain at least one uppercase letter!";
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
                            favmovies: []
                        }
                        fetch('/newuser', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                            })
                            .catch(error => {
                                console.error('Error:', error)
                            })
                    }
                })
            }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
})