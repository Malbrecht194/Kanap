async function main() {
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
    const quantity = document.querySelector('#quantity')
    addToCart.onclick = () => {
        if (!quantity.value || !colorsSelect.value) {
            alert('Veuillez selectionner une quantité et une couleur')
            return
        }
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
        cartItem.quantiT += parseInt(quantity.value)
        localStorage.setItem("cart", JSON.stringify(cart))
    }

}
main();