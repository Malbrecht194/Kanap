// récupération de l'orderId dans l'URL
const orderId = new URL(window.location.href).searchParams.get("id")

document
    .getElementById('orderId')
    .innerHTML = orderId

localStorage.clear()