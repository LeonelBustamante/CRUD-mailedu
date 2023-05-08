let form = document.querySelector('#login');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        email: form.email.value,
        password: form.password.value
    };

    console.log("datos enviados desde el front", data);

    fetch('login', {
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

    location.href = '/';

});

