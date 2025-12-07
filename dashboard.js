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
