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
            "paging": false,
            "searching": true,
            "stateSave": true,
            "language": { "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json" },
            "info": false,
            "fixedHeader": true
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

    fetch('api/nuevo-usuario', {
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
    if (confirm("¿Está seguro que desea eliminar el usuario?")) {
        fetch('api/eliminar-usuario/' + email, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => { if (response.ok) { return response.text(); } })
            .catch(error => { error.text.then(errorMessage => { alert(errorMessage); }); });
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

        fetch('api/editar-usuario/' + email, {
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
    fetch('api/cambiar-estado-usuario/' + email, {
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