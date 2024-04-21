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
            if (page == "") {

                const apiKey = `e39de4c3c1c2758867914877e0dea313`
                const movieTitle = `Avatar`;
                const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        rootElement.innerHTML = "Flash Film"
                        const movie = data.results[0]
                        rootElement.insertAdjacentHTML('beforeend',
                            `
                            <h2>${movie.title}</h2>
                            <p>${movie.overview}</p>
                            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title} Poster">
                            `
                        )
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
