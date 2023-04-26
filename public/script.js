async function getData() {
    try {
        const response = await fetch("/api/contacts");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function llenarDataTable(res) {
    return res.map((item) => ({
        id: item.id,
        domain_id: item.domain_id,
        nombre: item.nombre,
        apellido: item.apellido,
        dni: item.dni,
        email: item.email,
        quota: item.quota,
    }));
}

$(document).ready(async function () {
    const data = await getData();
    console.log(data);
    const columns = [
        { title: 'ID', data: 'id' },
        { title: 'DOMINIO', data: 'domain_id' },
        { title: 'NOMBRE', data: 'nombre' },
        { title: 'APELLIDO', data: 'apellido' },
        { title: 'DNI', data: 'dni' },
        { title: 'EMAIL', data: 'email' },
        { title: 'QUOTA', data: 'quota' },
        { 
            title: 'ACCIONES',
            data: null,
            defaultContent: '<button class="btn-editar">Editar</button> <button class="btn-eliminar">Eliminar</button>'
        }
    ];

    $(document).ready(function () {
        const table = $('#example').DataTable({
            data: llenarDataTable(data),
            columns: columns,
            "autoWidth": true,
            "responsive": true,
            "paging": false,
            "searching": true,
            "stateSave": true,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            },
            "info": false,
            "fixedHeader": true
        });

        $('#example').on('click', '.btn-editar', function () {
            const row = table.row($(this).parents('tr')).data();
        });

        $('#example').on('click', '.btn-eliminar', function () {
            const row = table.row($(this).parents('tr')).data();
        });
    });
});
/* kalsjdlkajsdlasdlkaldskjlaksjdlkajsdljalsdjlaksd */

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

  fetch('/nuevo-usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(`Error sending data: ${error}`);
    });
});
