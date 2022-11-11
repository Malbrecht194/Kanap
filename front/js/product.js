async function main() { // Création de la page produit et envoie des informations rentré par l'utilisateur (couleur / quantité) dans le localStorage
    // hyper important
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const item = await response.json()
    console.log(item)
    document.querySelector('.item__img img').setAttribute('src', item.imageUrl)
    document.querySelector('.item__img img').setAttribute('alt', item.altTxt)
    document.querySelector('#title').innerText = item.name
    document.querySelector('#price').innerText = item.price
    document.querySelector('#description').innerText = item.description
    const colorsSelect = document.querySelector('#colors')
    for (let color of item.colors) {
        const option = document.createElement("option")
        option.setAttribute('value', color)
        option.innerText = color
        colorsSelect.appendChild(option)
    }
    // création de la div pour le message d'erreur
    const quantity = document.querySelector('#quantity')
    const colorErrorMsg = document.createElement("div")
    document.querySelector(".item__content__settings__color").appendChild(colorErrorMsg)
    colorErrorMsg.style.color = '#DBA9DB'
    const quantityErrorMsg = document.createElement("div")
    document.querySelector(".item__content__settings__quantity").appendChild(quantityErrorMsg)
    quantityErrorMsg.style.color = '#DBA9DB'

    addToCart.onclick = () => {
        // attention le 0 peut etre un caractère
        const quantiT = parseInt(quantity.value)
        // Message d'erreur
        if (!colorsSelect.value) {
            colorErrorMsg.innerHTML = "Veuillez sélectionner une couleur"
        } else {
            colorErrorMsg.innerHTML = ""
        }
        if (!quantiT) {
            quantityErrorMsg.innerHTML = "Veuillez sélectionner une quantité"
        } else {
            quantityErrorMsg.innerHTML = ""
        }
        if (!colorsSelect.value || !quantity.value) return
        // hyper important
        const cart = JSON.parse(localStorage.getItem("cart")) || []
        // le == est dangereux le === est mieux 
        let cartItem = cart.find(cartItem => cartItem.id === id && cartItem.couleur === colorsSelect.value)
        if (!cartItem) {
            cartItem = {
                quantiT: 0,
                couleur: colorsSelect.value,
                id
            }
            cart.push(cartItem)
        }
        cartItem.quantiT += quantiT
        localStorage.setItem("cart", JSON.stringify(cart))
    }

}
main();
