const COSTO_ENVIO = 100;  // Cargo fijo por envío
const MINIMO_ENVIO_GRATIS = 1000; // Monto mínimo para envío gratis
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let nombreCliente = localStorage.getItem("nombreCliente") || "";

const productos = [
    { nombre: "Manzanas Orgánicas", precio: 120, descripcion: "Manzanas frescas y orgánicas, 1 kg.", stock: 20 },
    { nombre: "Almendras Naturales", precio: 300, descripcion: "Almendras crudas sin sal, 500 g.", stock: 15 },
    { nombre: "Quinoa", precio: 250, descripcion: "Quinoa orgánica certificada, 1 kg.", stock: 10 },
    { nombre: "Aceite de Oliva Extra Virgen", precio: 450, descripcion: "Botella 500 ml, prensado en frío.", stock: 12 },
    { nombre: "Miel Natural", precio: 200, descripcion: "Miel pura, 350 g.", stock: 18 },
    { nombre: "Té Verde Orgánico", precio: 180, descripcion: "Bolsa de té verde 50 g.", stock: 25 },
    { nombre: "Barra de Cereal Integral", precio: 90, descripcion: "Barra con avena y frutos secos.", stock: 30 }
];

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

    // Aplicamos descuento si comprás más de 5 productos
    let descuento = 0;
    if (cantidadTotal > 5) {
        descuento = totalSinDescuento * 0.10;  // 10% de descuento
    }

    let totalConDescuento = totalSinDescuento - descuento;

    // Aplicar costo de envío si total menor a $1000
    let costoEnvio = totalConDescuento < MINIMO_ENVIO_GRATIS ? COSTO_ENVIO : 0;

    let totalFinal = totalConDescuento + costoEnvio;

    document.getElementById("total").innerHTML = `
        Subtotal: $${totalSinDescuento.toFixed(2)}<br/>
        Descuento: <span class="text-success">- $${descuento.toFixed(2)}</span><br/>
        Costo de envío: $${costoEnvio.toFixed(2)}<br/>
        <strong>Total a pagar: $${totalFinal.toFixed(2)}</strong>
    `;
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    mostrarProductos();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    mostrarProductos();
}

function finalizarCompra() {
    const inputNombre = document.getElementById("nombreCliente");
    const nombre = inputNombre.value.trim();

    if (carrito.length === 0) {
        mostrarMensaje("Agregá productos antes de finalizar la compra.", "danger");
        return;
    }

    if (nombre === "") {
        mostrarMensaje("Por favor, ingresá tu nombre.", "danger");
        return;
    }

    localStorage.setItem("nombreCliente", nombre);

    const totalSinDescuento = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    let descuento = 0;
    if (cantidadTotal > 5) {
        descuento = totalSinDescuento * 0.10;
    }
    let totalConDescuento = totalSinDescuento - descuento;

    let costoEnvio = totalConDescuento < MINIMO_ENVIO_GRATIS ? COSTO_ENVIO : 0;

    let totalFinal = totalConDescuento + costoEnvio;

    mostrarMensaje(`Gracias por tu compra, ${nombre}. Total a pagar: $${totalFinal.toFixed(2)}`, "success");
    vaciarCarrito();
}

function verCarrito() {
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarMensaje(mensaje, tipo) {
    const div = document.getElementById("mensaje");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensaje}</div>`;
    setTimeout(() => div.innerHTML = "", 4000);
}

window.onload = () => {
    mostrarProductos();
    mostrarCarrito();

    const inputNombre = document.getElementById("nombreCliente");
    if (nombreCliente) {
        inputNombre.value = nombreCliente;
    }
};













