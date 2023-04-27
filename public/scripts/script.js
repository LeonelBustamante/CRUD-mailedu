async function getData() {
    try {
        const response = await fetch("api/obtener-usuario");
        const data = await response.json();
        return data;
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
                '<div class="btns-accion"><button class="btn btn-editar">Editar</button><button class="btn btn-eliminar">Eliminar</button><button class="btn btn-desactivar">Desactivar</button></div>'
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
            /* alert para confirmar eliminacion */

            if (confirm("¿Está seguro que desea editar el usuario?")) {
                const row = table.row($(this).parents('tr')).data();

            }
        });

        $('#example').on('click', '.btn-eliminar', function () {
            const row = table.row($(this).parents('tr')).data();
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
        .then(response => {
            console.log("front",response);
            if (response.ok) { return response.text(); }
        })
        .catch(error => {
            console.log(error);
            error.text.then(errorMessage => {
                alert(errorMessage);
            });
        });
});
