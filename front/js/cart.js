let cart = JSON.parse(localStorage.getItem("cart")) || []
const requests = cart.reduce( //extraction unique des ID
    (requests, cartItem) => {
        if (!requests.includes(cartItem.id)) {
            requests.push(cartItem.id)
        }
        return requests
    },
    []
).map( // transformation des id en requêtes produit
    async (id) => {
        const request = await fetch(`http://localhost:3000/api/products/${id}`);
        return request.json()
    }
)
const products = await Promise.all(requests)


const itemSection = document.querySelector('#cart__items');
// Important d'utiliser le forEach
cart.forEach(cartItem => {
    let product = products.find(product => cartItem.id === product._id)
    const template = document.querySelector('#cartItem').content.cloneNode(true)
    template.querySelector('.cart__item').setAttribute('data-id', cartItem.id)
    template.querySelector('.cart__item').setAttribute('data-color', cartItem.couleur)
    template.querySelector('.cart__item').setAttribute('data-id', cartItem.id)
    template.querySelector('.nomProduit').innerText = product.name
    template.querySelector('.color').innerText = cartItem.couleur
    template.querySelector('.prix').innerText = product.price
    template.querySelector('.cartImg').setAttribute('src', product.imageUrl)
    template.querySelector('.cartImg').setAttribute('alt', product.altTxt)
    template.querySelector('.itemQuantity').setAttribute('value', cartItem.quantiT)
    template.querySelector('.itemQuantity').addEventListener('change', event => {
        const quantity = event.target.value
        if (quantity !== cartItem.quantiT) {
                cartItem.quantiT = parseInt(quantity)
                localStorage.setItem("cart", JSON.stringify(cart))
        }
        computeTotal()
    })
    
    template.querySelector('.deleteItem').onclick = (event) =>{ // supprimer 
        cart = cart.filter(_ci => _ci !== cartItem)
        localStorage.setItem("cart", JSON.stringify(cart))
        event.target.closest(".cart__item").remove()
        computeTotal()
        // window.location.reload() => à ne pas utiliser
    }
    itemSection.appendChild(template)
});
computeTotal()

function computeTotal() { //Prix total
    let totalQuantity = 0
    let totalPrice = 0
    for (let cartItem of cart) {
        const product = products.find(product => cartItem.id === product._id)
        totalQuantity += cartItem.quantiT
        totalPrice += product.price * cartItem.quantiT

    }
    document.querySelector('#totalQuantity').innerText = totalQuantity
    document.querySelector('#totalPrice').innerText = totalPrice
    disableSubmit()
}

function disableSubmit() { // vérification du form
    let disabled = false
    if (/^[A-Z][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž ,.'-]+$/.test(document.getElementById("firstName").value)) {
        document.querySelector('#firstNameErrorMsg').innerText = ""
    } else {
        document.querySelector('#firstNameErrorMsg').innerText = "Veuillez rentrer un prénom"
        disabled = true
    }

    if (/^[A-Z][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž ,.'-]+$/.test(document.getElementById("lastName").value)) {
        document.querySelector('#lastNameErrorMsg').innerText = ""
    } else {
        document.querySelector('#lastNameErrorMsg').innerText = "Veuillez rentrer un nom"
        disabled = true
    }

    if (/.+/.test(document.getElementById("address").value)) {
        document.querySelector('#addressErrorMsg').innerText = ""
    } else {
        document.querySelector('#addressErrorMsg').innerText = "Veuillez rentrer une adresse"   
        disabled = true  
    }
    
    if (/.+/.test(document.getElementById("city").value)) {
        document.querySelector('#cityErrorMsg').innerText = ""
    } else {
        document.querySelector('#cityErrorMsg').innerText = "Veuillez rentrer une ville"    
        disabled = true
    }

    if (/^[\w][\w-\.]+[\w]@([\w-]+\.)+[\w-]+$/.test(document.getElementById("email").value)) {
        document.querySelector('#emailErrorMsg').innerText = ""
    } else {
        document.querySelector('#emailErrorMsg').innerText = "Veuillez rentrer une adresse email"  
        disabled = true   
    }

    if (!cart.length){
        disabled = true
    }

    if (disabled) {
      document
        .getElementById("order")
        .setAttribute("disabled", true)
    } else {
      document
        .getElementById("order")
        .removeAttribute("disabled")
    }
}

document
.getElementById("firstName")
.addEventListener("input", disableSubmit)

document
.getElementById("lastName")
.addEventListener("input", disableSubmit)

document
.getElementById("address")
.addEventListener("input", disableSubmit)

document
.getElementById("city")
.addEventListener("input", disableSubmit)

document
.getElementById("email")
.addEventListener("input", disableSubmit)

document
.querySelector('.cart__order__form')
.addEventListener("submit", submitCart)

function submitCart(event){
    event.preventDefault()
    const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }
    const products = cart.reduce( //extraction unique des ID
    (products, cartItem) => {
        for (let i = 0; i<cartItem.quantiT; i++) {
            products.push(cartItem.id)
        }
        return products
    },
    [])
    // Envoie des données à l'api
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({contact, products})
    }
    ).then(response => response.json()
    ).then(data => { 
    // lien vers page confirmation 
    document.location.href = 'confirmation.html?id='+ data.orderId
    })
    localStorage.removeItem('cart')
}
