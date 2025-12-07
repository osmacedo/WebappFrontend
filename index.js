// const btnCambiarTitulo = document.getElementById("btn-cambiar-titulo")
// const btnListaProductos = document.getElementById("btn-lista-productos")
// const tituloPrincipal = document.getElementById("titulo-principal")
// const listaProductos = document.getElementById("lista-productos")
// const parrafoPrincipal = document.getElementById("parrafo-principal")
const productosRuta = "http://localhost:3000/products/"
const formularioProducto = document.getElementById("add-product-form")

// aca se consume la API
// fetch(productosRuta).then(response => response.json()).then(data => console.log(data)) 

// fetch(productosRuta)
//     .then(response => response.json())
//     .then(data => data.forEach(product => 
//         elementosDeLista += `<li>${product.name}</li>`
//     )) 


// btnCambiarTitulo.addEventListener("click", function() {
//     tituloPrincipal.textContent = "Nuevo titulo de la tienda"
//     parrafoPrincipal.textContent = "Nuevo parrafo de la landing page"
//     console.log("hola ke ace")
//     tituloPrincipal.innerHTML = "<div><h1>Nuevo titulo de la tienda</h1><h2>Otro titulo de la tienda</h2></div>"
// })

// btnListaProductos.addEventListener("click", function() {
//     let elementosDeLista = ``
//     fetch(productosRuta)
//     .then(response => response.json())
//     .then(data => { 
//         data.forEach(product => { 
//         elementosDeLista += `<div>
//                                 <h2>${product.name}</h2>
//                                 <h3>${product.price}</h3>
//                                 <h3>${product.description}</h3>
//                             </div>`
//         }) 
//     listaProductos.innerHTML = elementosDeLista
//     })
// })

const contenedor = document.getElementById("productos-container");

fetch(productosRuta)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.name}" />
          <h3>${producto.name}</h3>
          <p>${producto.description}</p>
          <p><strong>Precio:</strong> S/ ${producto.price}</p>
          <button class="btn-agregar">Agregar al carrito</button>
        `;
        contenedor.appendChild(card);
      });
    })
    .catch((error) => {
      contenedor.innerHTML = "<p>Error al cargar productos.</p>";
      console.error("Error:", error);
    });


formularioProducto.addEventListener('submit', (e) => { 
    e.preventDefault();

    const name = e.target.elements['product-name'].value;
    const price = parseFloat(e.target.elements['product-price'].value);
    const description = e.target.elements['product-description'].value;
    const stock = e.target.elements['product-stock'].value;
    const sku = e.target.elements['product-sku'].value;

    const datosEnviar = {
        name: name,
        price: price,
        description: description,
        stock: stock,
        sku: sku
    };

    console.log(datosEnviar);

    fetch(productosRuta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            datosEnviar
        )
    })
    .then((res) => res.json())
    .then((data) => {
        alert("Producto agregado exitosamente");
        formularioProducto.reset();
        location.reload();
    })
    .catch((error) => {
      contenedor.innerHTML = "<p>Error al agregar el producto.</p>";
      console.error("Error:", error);
    });

})

// ADMIN: mostrar productos con botones
const contenedorAdmin = document.getElementById("productos-container-admin");

fetch(productosRuta)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.name}" />
          <h3>${producto.name}</h3>
          <p>${producto.description}</p>
          <p><strong>Precio:</strong> S/ ${producto.price}</p>
          <button class="btn-editar" data-id="${producto.id}">Editar</button>
          <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        `;
      contenedorAdmin.appendChild(card);
    });
  });

// ELIMINAR PRODUCTO
contenedorAdmin.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-eliminar")) {
    const productoId = event.target.getAttribute("data-id");

    if (!confirm(`Eliminar producto ${productoId}?`)) return;

    fetch(`${productosRuta}${productoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  }
});

// -------------------------------
//      MODAL DE EDITAR
// -------------------------------

const modal = document.getElementById("modal-editar");
const cerrarModal = document.getElementById("cerrar-modal");

const formEditar = document.getElementById("form-edit-product");

const inputId = document.getElementById("edit-id");
const inputName = document.getElementById("edit-name");
const inputPrice = document.getElementById("edit-price");
const inputDescription = document.getElementById("edit-description");
const inputStock = document.getElementById("edit-stock");
const inputSku = document.getElementById("edit-sku");

// Abrir modal con datos
contenedorAdmin.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-editar")) {
    const id = event.target.getAttribute("data-id");

    const res = await fetch(`${productosRuta}${id}`);
    const producto = await res.json();

    inputId.value = producto.id;
    inputName.value = producto.name;
    inputPrice.value = producto.price;
    inputDescription.value = producto.description;
    inputStock.value = producto.stock;
    inputSku.value = producto.sku;

    modal.style.display = "flex";
  }
});

// Cerrar modal
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Guardar cambios
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = inputId.value;

  const datosActualizar = {
    name: inputName.value,
    price: parseFloat(inputPrice.value),
    description: inputDescription.value,
    stock: parseInt(inputStock.value),
    sku: inputSku.value,
  };

  const res = await fetch(`${productosRuta}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizar),
  });

  const data = await res.json();
  console.log("Actualizado:", data);

  modal.style.display = "none";
  location.href = "#productos";
});



// btnListaProductos.addEventListener("click", function() {
//     let elementosDeLista = `<ul>`
//     productosFrutas.forEach(element => {
//         elementosDeLista += `<li>${element}</li>`
//     });
//     elementosDeLista += `</ul>`
//     listaProductos.innerHTML = elementosDeLista
// })

