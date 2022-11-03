// récupération de l'orderId dans le localstorage
const orderId = localStorage.getItem("orderId")

document
    .getElementById('orderId')
    .innerHTML = orderId

localStorage.clear()