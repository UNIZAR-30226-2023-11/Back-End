### URL Despliegue Azure
https://monopoly-inoformatico.azurewebsites.net/

### Ejemplo de como hacer solicitudes tipo 'POST'
Invoke-WebRequest -Uri "monopoly-inoformatico.azurewebsites.net" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"nombre": "User1", "telefono": "123456789"}' -UseBasicParsing


Invoke-WebRequest -Uri "http://localhost:8080/users/create" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "nombreUser": "User", "correo": "user@gmail.com", "contraseña": "user", "imagen": "url", "monedas": 0, "victorias": 0, "partidasJugadas": 0, "productosComprados": 0, "partidasEnJuego": 0}' -UseBasicParsing
