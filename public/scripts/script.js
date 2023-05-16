async function getData() {
    try {
        const response = await fetch("obtener-usuarios");
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return []
        }
    } catch (error) { console.error(error); }
}

function llenarDataTable(res) {
    return res.map((item) => ({
        nombre: item.nombre,
        apellido: item.apellido,
        dni: item.dni,
        email: item.email,
        quota: item.quota,
        activo: item.activo,
    }));
}

$(document).ready(async function () {
    const data = await getData();
    const columns = [
        { title: 'NOMBRE', data: 'nombre' },
        { title: 'APELLIDO', data: 'apellido' },
        { title: 'DNI', data: 'dni' },
        { title: 'EMAIL', data: 'email' },
        { title: 'QUOTA', data: 'quota' },
        { title: 'ACTIVO', data: 'activo' },
        {
            title: 'ACCIONES',
            data: null,
            defaultContent:
                '<div class="btns-accion"><button class="btn btn-editar">Editar</button><button class="btn btn-eliminar">Eliminar</button><button class="btn btn-estado">Estado</button></div>'
        }
    ];

    $(document).ready(function () {
        const table = $('#example').DataTable({
            data: llenarDataTable(data),
            columns: columns,
            "responsive": true,
            "paging": true,
            "searching": true,
            "stateSave": true,
            "language": { "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json" },
            "info": false,
            "fixedHeader": true,
        });

        $('#example').on('click', '.btn-editar', function () {
            const row = table.row($(this).parents('tr')).data();
            document.querySelector('#nombre').value = row.nombre;
            document.querySelector('#apellido').value = row.apellido;
            document.querySelector('#dni').value = row.dni;
            document.querySelector('#email').value = row.email;
            let quota = document.querySelector('#quota');
            quota.type = "text";
            quota.value = row.quota;
            let pwd = document.querySelector('#password')
            pwd.removeAttribute("required");
            pwd.value = "";
            let formulario = document.querySelector('#form-usuario');
            formulario.id = "form-usuario-editar";
            editarUsuario(row.email);
        });

        $('#example').on('click', '.btn-estado', function () {
            if (confirm("¿Está seguro que desea editar el usuario?")) {
                const row = table.row($(this).parents('tr')).data();
                const email = row.email;
                const activo = row.activo;
                cambiarEstadoUsuario(activo, email);
            }
        });

        $('#example').on('click', '.btn-eliminar', function () {
            const row = table.row($(this).parents('tr')).data();
            const email = row.email;
            eliminarUsuario(email);
        });
    });
});

const form = document.querySelector('#form-usuario');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        dni: form.dni.value,
        email: form.email.value,
        quota: form.quota.value,
        password: form.password.value
    };

    console.log(data);

    fetch('nuevo-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => { if (response.ok) { return response.text(); } })
        .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });

    location.reload();
});

function eliminarUsuario(email) {
    const data = { email: email };
    if (confirm(`Está seguro que desea eliminar el ${email}`)) {
        if (confirm(`¿Completamente seguro de eliminar el ${email}?`)) {
            fetch('eliminar-usuario/' + email, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => { if (response.ok) { return response.text(); } })
                .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });
        }
    }

    location.reload();
}

function editarUsuario(email) {
    const form = document.querySelector('#form-usuario-editar');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            nombre: form.nombre.value,
            apellido: form.apellido.value,
            dni: form.dni.value,
            email: form.email.value,
            quota: form.quota.value,
        };

        fetch('editar-usuario/' + email, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

            .then(response => { if (response.ok) { return response.text(); } })
            .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });

        location.reload();
    });
}

function cambiarEstadoUsuario(activo, email) {
    const data = { email: email };
    fetch('cambiar-estado-usuario/' + email, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => { if (response.ok) { return response.text(); } })
        .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });
    location.reload();
}

let logoutButton = document.querySelector('#logout');
logoutButton.addEventListener('click', (event) => {
    event.preventDefault();

    fetch('logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => { if (response.ok) { return response.text(); } })
        .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });

    location.reload();
});

let nombre = document.querySelector('#nombre');
let apellido = document.querySelector('#apellido');
let mail = document.querySelector('#email');

nombre.addEventListener('focus', formularioDefault);
apellido.addEventListener('change', crearCorreo);

function formularioDefault() {
    let quota = document.querySelector('#quota').value = 1;
    let pwd = document.querySelector('#password').value = generarPassword();
}

async function crearCorreo() {
    let nombre = document.querySelector('#nombre').value;
    let apellido = document.querySelector('#apellido').value;
    let email = document.querySelector('#email');

    let primerApellido = apellido.split(' ')[0];


    nombre.toLowerCase();
    primerApellido.toLowerCase();

    let mail = nombre[0] + primerApellido + "@neuquen.edu.ar";
    mail = mail.toLowerCase();
    email.value = mail;
    chequeoCorreo();
}

function generarPassword() {
    let longitud = 8;
    let caracteres = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let contraseña = "";
    for (let i = 0; i < longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña;
}


const chequeoCorreo = async () => {
    const response = await fetch('obtener-usuario/' + mail.value, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    console.log(data);
    if (data[0]) {
        document.querySelector('#email').style.borderColor = "red";
        document.querySelector('#email').style.borderWidth = "2px";
        document.querySelector('#enviar').style.backgroundColor = 'gray';
        document.querySelector('#enviar').style.borderColor = "grays";
        document.querySelector('#enviar').disabled = true;
    } else {
        document.querySelector('#email').style.borderColor = "green";
        document.querySelector('#email').style.borderWidth = "2px";
        document.querySelector('#enviar').disabled = false;
    }
}

mail.addEventListener('change', chequeoCorreo);