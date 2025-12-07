const loginRuta = "http://localhost:3000/auth/login"

const formularioLogin = document.getElementById("login-form")

formularioLogin.addEventListener('submit', (e) => { 
    e.preventDefault();

    const username = e.target.elements['username'].value;
    const password = e.target.elements['password'].value;

    const datosEnviar = {
        username: username,
        password: password,
    };

    console.log(datosEnviar);

    fetch(loginRuta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            datosEnviar
        )
    })
    // .then((res) => res.json())
    
    .then((res) => {
        console.log("Datos del res:", res);
        // const datosJson = res.json();
        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contrasena incorrecta',
            })
            return
        }
        return res.json()
    })
    .then((data) => {
        console.log("Login exitoso:", data.message);
        location.href = "dashboard.html";
        localStorage.setItem("token", data.token)
    })
    .catch((error) => {
        console.error("Error:", error);
    });

})
