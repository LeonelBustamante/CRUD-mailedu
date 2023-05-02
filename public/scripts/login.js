let loginForm = document.querySelector('#login');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        email: loginForm.email.value,
        password: loginForm.pwd.value
    };

    console.log("datos enviados desde el front", data);

    fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => { if (response.ok) { return response.text(); } })
        .catch(error => {
            error.text.then(errorMessage => {
                alert(errorMessage);
            });
        });
});

