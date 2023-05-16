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
        .then(response => { return response.json() })
        .then(data => {
            console.log("datos recibidos en el front", data);
            if (data.status == 200) {
                window.location.href = '/';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.log(error));

});

