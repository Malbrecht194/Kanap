async function main(){
    const response = await fetch('http://localhost:3000/api/products');
    const items = await response.json();
    console.log(items);
    const itemSection = document.querySelector('#items')
    for (let item of items){
        const template = document.querySelector('#item').content.cloneNode(true)
        /* Une autre façon de le faire : template.querySelector('.productLink').setAttribute('href','./product.html?id=' + item._id) */        
        // template.querySelector('.productLink').setAttribute('href',`./product.html?id=${item._id}`)
        template.querySelector('.productLink').setAttribute('href',`./product.html?id=${item._id}`)
        template.querySelector('.productImg').setAttribute('src', item.imageUrl)
        template.querySelector('.productImg').setAttribute('alt', item.altTxt)
        template.querySelector('.productName').innerText = item.name
        template.querySelector('.productDescription').innerText = item.description
        itemSection.appendChild(template)     
    }
}
main();

