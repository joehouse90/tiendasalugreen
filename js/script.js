const COSTO_ENVIO = 100;
const MINIMO_ENVIO_GRATIS = 1000;

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let nombreCliente = localStorage.getItem("nombreCliente") || "";
let productos = [];

// Cargar productos desde JSON externo
function cargarProductos() {
    return fetch('productos.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar productos');
            return response.json();
        })
        .then(data => {
            productos = data;
            mostrarProductos();
        })
        .catch(error => {
            console.error(error);
            mostrarMensaje("No se pudieron cargar los productos", "error");
        });
}

// Mostrar productos en el DOM
function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((producto, index) => {
        const enCarrito = carrito.find(item => item.nombre === producto.nombre);
        const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
        const stockDisponible = producto.stock - cantidadEnCarrito;

        const div = document.createElement("div");
        div.className = "col-md-4 mb-4";
        div.innerHTML = `
            <div class="card h-100 producto">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text flex-grow-1">${producto.descripcion}</p>
                    <p class="card-text font-weight-bold">Precio: $${producto.precio}</p>
                    <p class="card-text">Stock disponible: ${stockDisponible}</p>
                    <button class="btn btn-primary mt-auto" onclick="agregarProducto(${index})" ${stockDisponible <= 0 ? "disabled" : ""}>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// Agregar producto al carrito
function agregarProducto(index) {
    const producto = productos[index];
    const existente = carrito.find(item => item.nombre === producto.nombre);

    if (existente && existente.cantidad >= producto.stock) {
        mostrarMensaje("No hay más stock disponible para este producto.", "warning");
        return;
    }

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    mostrarCarrito();
    mostrarProductos();
}

// Mostrar contenido del carrito
function mostrarCarrito() {
    const lista = document.getElementById("carrito");
    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = "<li class='list-group-item'>Carrito vacío.</li>";
        document.getElementById("total").textContent = "";
        return;
    }

    let totalSinDescuento = 0;
    let cantidadTotal = 0;

    carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        lista.appendChild(item);
        totalSinDescuento += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    });

    const descuento = cantidadTotal > 5 ? totalSinDescuento * 0.10 : 0;
    const totalConDescuento = totalSinDescuento - descuento;
    const costoEnvio = totalConDescuento < MINIMO_ENVIO_GRATIS ? COSTO_ENVIO : 0;
    const totalFinal = totalConDescuento + costoEnvio;

    document.getElementById("total").innerHTML = `
        Subtotal: $${totalSinDescuento.toFixed(2)}<br/>
        Descuento: <span class="text-success">- $${descuento.toFixed(2)}</span><br/>
        Costo de envío: $${costoEnvio.toFixed(2)}<br/>
        <strong>Total a pagar: $${totalFinal.toFixed(2)}</strong>
    `;
}



// Eliminar producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    mostrarProductos();
}

// Vaciar carrito con confirmación
function vaciarCarrito() {
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: "Se eliminarán todos los productos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
            mostrarProductos();
            Swal.fire({
                text: 'Carrito vaciado',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Finalizar compra con validaciones y confirmación
function finalizarCompra() {
    const inputNombre = document.getElementById("nombreCliente");
    const nombre = inputNombre.value.trim();

    if (carrito.length === 0) {
        mostrarMensaje("Agregá productos antes de finalizar la compra.", "warning");
        return;
    }

    if (nombre === "") {
        mostrarMensaje("Por favor, ingresá tu nombre.", "warning");
        return;
    }

    localStorage.setItem("nombreCliente", nombre);

    const totalSinDescuento = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    let descuento = cantidadTotal > 5 ? totalSinDescuento * 0.10 : 0;
    let totalConDescuento = totalSinDescuento - descuento;
    let costoEnvio = totalConDescuento < MINIMO_ENVIO_GRATIS ? COSTO_ENVIO : 0;
    let totalFinal = totalConDescuento + costoEnvio;

    const listaProductos = carrito.map(p => `<li>${p.nombre} x ${p.cantidad}</li>`).join('');

    Swal.fire({
        title: `¡Gracias por tu compra, ${nombre}!`,
        html: `
            <p><strong>Total a pagar:</strong> $${totalFinal.toFixed(2)}</p>
            <p><strong>Resumen:</strong></p>
            <ul style="text-align: left; margin-left: 1rem;">${listaProductos}</ul>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        vaciarCarrito();
    });
}


// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar mensajes con SweetAlert
function mostrarMensaje(mensaje, tipo) {
    Swal.fire({
        text: mensaje,
        icon: tipo, // 'success', 'error', 'warning', 'info'
        showConfirmButton: false,
        timer: 3000
    });
}

function verCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            icon: "info"
        });
        return;
    }

    let contenido = "";
    let total = 0;

    carrito.forEach(p => {
        contenido += `${p.nombre} - $${p.precio} x ${p.cantidad}<br/>`;
        total += p.precio * p.cantidad;
    });

    Swal.fire({
        title: "Tu Carrito",
        html: contenido + `<hr><strong>Total: $${total.toFixed(2)}</strong>`,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
}


// Inicialización al cargar la página
window.onload = () => {
    cargarProductos();
    mostrarCarrito();

    const inputNombre = document.getElementById("nombreCliente");
    if (nombreCliente) {
        inputNombre.value = nombreCliente;
    }
};












