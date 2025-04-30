// Variables y constantes
const IVA = 0.21; // IVA del 21%
const LIMITE_PRODUCTOS = 10; // Límite total de productos
const carrito = [];
const productos = [
    {
        nombre: "Refrigerador",
        precio: 800,
        descripcion: "Refrigerador de 500L con tecnología de enfriamiento rápido.",
        cantidad: 0
    },
    {
        nombre: "Lavadora",
        precio: 600,
        descripcion: "Lavadora automática de 8 kg con ciclo de lavado rápido.",
        cantidad: 0
    },
    {
        nombre: "Horno Microondas",
        precio: 150,
        descripcion: "Horno microondas de 20L con múltiples funciones.",
        cantidad: 0
    },
    {
        nombre: "Licadora",
        precio: 100,
        descripcion: "Licadora de 1.5L con 3 velocidades y función de pulso.",
        cantidad: 0
    },
    {
        nombre: "Tostadora",
        precio: 50,
        descripcion: "Tostadora de 2 rebanadas con control de dorado.",
        cantidad: 0
    }
];

// Función para mostrar los productos
function mostrarProductos() {
    const contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = ""; // Limpiar contenedor antes de mostrar
    productos.forEach((producto, index) => {
        const div = document.createElement("div");
        div.className = "producto col-md-4";
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <button class="btn btn-primary btn-agregar" onclick="agregarProducto(${index})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(div);
    });
    console.log("Productos mostrados en la interfaz.");
}

// Función para agregar producto al carrito
function agregarProducto(index) {
    if (carrito.length < LIMITE_PRODUCTOS) {
        carrito.push(productos[index]);
        productos[index].cantidad += 1; // Incrementar la cantidad del producto
        alert(`${productos[index].nombre} ha sido agregado al carrito.`);
        console.log(`Producto agregado: ${productos[index].nombre}, Cantidad: ${productos[index].cantidad}`);
        mostrarCarrito();
    } else {
        alert("Has alcanzado el límite de productos en el carrito.");
        console.log("Límite de productos alcanzado.");
    }
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<li>No hay productos en el carrito.</li>";
    } else {
        carrito.forEach((producto, index) => {
            const li = document.createElement("li");
            li.textContent = `${producto.nombre} - $${producto.precio} (Cantidad: ${producto.cantidad})`;
            
            // Botón para eliminar producto
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn btn-danger btn-sm ml-2";
            btnEliminar.onclick = () => eliminarProducto(index);
            
            li.appendChild(btnEliminar);
            contenedorCarrito.appendChild(li);
            total += producto.precio * producto.cantidad; // Calcular total considerando la cantidad
        });
    }

    const totalConIva = total * (1 + IVA);
    document.getElementById("total").textContent = `Total (con IVA): $${totalConIva.toFixed(2)}`;
    console.log(`Total calculado: $${totalConIva.toFixed(2)}`);
}

// Función para eliminar producto del carrito
function eliminarProducto(index) {
    const productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    alert(`${productoEliminado} ha sido eliminado del carrito.`);
    console.log(`Producto eliminado: ${productoEliminado}`);
    mostrarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito.length = 0; // Vaciar el carrito
    alert("El carrito ha sido vaciado.");
    console.log("Carrito vaciado.");
    mostrarCarrito();
}

// Función para iniciar la compra
function iniciarCompra() {
    let continuar = true;
    while (continuar) {
        let index = prompt("Elige un producto:\n0. Refrigerador\n1. Lavadora\n2. Horno Microondas\n3. Licadora\n4. Tostadora\nEscribe el número del producto:");
        if (index >= 0 && index < productos.length) {
            agregarProducto(index);
        } else {
            alert("Producto no válido. Intenta de nuevo.");
            console.log("Selección de producto no válida.");
        }
        continuar = confirm("¿Quieres agregar otro producto?");
    }
    mostrarCarrito();
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    let nombre = prompt("Ingresa tu nombre para completar la compra:");
    if (!nombre) {
        alert("Nombre no válido. Compra cancelada.");
        return;
    }

    let confirmar = confirm(`Hola ${nombre}, ¿deseás confirmar tu compra por un total de $${calcularTotalConIVA().toFixed(2)}?`);
    if (confirmar) {
        alert("¡Gracias por tu compra, " + nombre + "!\nTu pedido será procesado.");
        carrito.length = 0;
        mostrarCarrito();
    } else {
        alert("Compra cancelada.");
    }
}

// Función auxiliar para calcular total con IVA (para mostrar en el pago)
function calcularTotalConIVA() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total * (1 + IVA);
}

// Función para mostrar el carrito cuando se haga clic en el botón "Ver Carrito"
function verCarrito() {
    mostrarCarrito(); // Llama a la función que ya tienes definida para mostrar el carrito
}

// Llamar a la función para mostrar productos al cargar la página
window.onload = mostrarProductos;









