const productosRuta = "http://localhost:3000/products/"
const formularioProducto = document.getElementById("add-product-form")

const token = localStorage.getItem("token");


function estaTokenExpirado(token){
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);
        const expToken = payload.exp

        if (!expToken){
            return false;
        }
        const ahora = Math.floor(Date.now() / 1000);
        return ahora >= expToken;
    } catch (e) {
        return true;
    }   
}

function validarToken() {
    if(!token || estaTokenExpirado(token)){
        Swal.fire({
        icon: 'warning',
        title: 'Sesion expirada',
        text: 'Vuelve a iniciar sesion',
        confirmButtonText: 'Ir al login'
        }).then(() => {
            localStorage.removeItem("token");
            location.href = "login.html";
        });
        return;
    }
console.log("Autenticado");
}

validarToken();

// function cerrarSesion(){
//     localStorage.removeItem("token");
//     location.href = "login.html";
    
// }

const logoutBtn = document.getElementById("logout-btn")

logoutBtn.addEventListener('click', function() {
    localStorage.removeItem("token");
    location.href = "login.html";
});

// Toggle sidebar
  const toggleBtn = document.getElementById('toggleBtn');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
  });

  // Navigation
  const menuItems = document.querySelectorAll('.menu li a');
  const sections = document.querySelectorAll('.section');

  menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
          if (this.id !== 'logout-btn') {
              e.preventDefault();

              // Remove active class from all menu items
              menuItems.forEach(menuItem => {
                  menuItem.parentElement.classList.remove('active');
              });

              // Add active class to clicked menu item
              this.parentElement.classList.add('active');

              // Hide all sections
              sections.forEach(section => {
                  section.classList.add('hidden');
              });

              // Show the corresponding section
              const targetId = this.getAttribute('href').substring(1) + '-section';
              const targetSection = document.getElementById(targetId);
              if (targetSection) {
                  targetSection.classList.remove('hidden');
              }

              // On mobile, collapse sidebar after selection
              if (window.innerWidth <= 768) {
                  sidebar.classList.remove('expanded');
                  sidebar.classList.add('collapsed');
                  mainContent.classList.add('expanded');
              }
          }
      });
  });

  // Mobile sidebar toggle
  if (window.innerWidth <= 768) {
      toggleBtn.addEventListener('click', function() {
          sidebar.classList.toggle('expanded');
      });
  }


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
      card.className = "card-producto-admin";
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





