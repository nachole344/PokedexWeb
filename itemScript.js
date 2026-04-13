var indexSum = 0

async function showItem() {

    for (let i = 1 + 30 * indexSum; i <= 30 + 30 * indexSum; i++) {
        if (i > 2175) {
            document.getElementById("showMoreItemsButton").remove()
            break
        }

        const URL = `https://pokeapi.co/api/v2/item/${i}`

        await fetch(URL)
            .then(response => {

                if (!response.ok) throw new Error("Item not found")

                return response.json()
            })

            .then(data => {

                let itemName = data.name.toUpperCase()

                let itemImage = data.sprites.default

                let itemID = data.id

                let itemCategory = data.category.name.toUpperCase()

                let itemEntries = data.effect_entries.map(e => e)

                let itemDescription

                for (let i = 0; i < itemEntries.length; i++) {
                    if (itemEntries[i].language.name == "en") { // Recorre todas las descripciones del objeto hasta encontrar la que está en inglés
                        itemDescription = itemEntries[i].short_effect
                        break

                    }
                }


                document.getElementById("itemCardContainer").innerHTML += `
                    <div class="col-md-4 col-12" id="itemCard">
                        <div class="card mx-auto">
                            <div class="card-body">
                                <h3 class="card-title" id="itemName">${itemName}</h3>
                                <img src="${itemImage}" id="itemImage" width="100px">
                                <p class="card-text" id="itemDescription">${itemDescription}</p>
                                <p class="card-text" id="itemID"><strong>Item nº</strong>${itemID}</p>
                                <p class="card-text" id="itemCategory"><strong>Category: </strong>${itemCategory}</p>
                            </div>
                        </div>
                    </div>
                    `

            })

            .catch(error => {
                alert(error.message)
                console.error("Error:", error)
            })


    }
}

function searchButton(search) {

    let searchArray = search.value.split(" ")

    search = searchArray.join("-")

    searchPokemon(search)

}

function showMoreItems() {

    indexSum++
    showItem()

}

function searchItem(search) {
    document.getElementById("itemCardContainer").innerHTML = ""

    if (document.getElementById("showMoreItemsButton") != null) {

        document.getElementById("showMoreItemsButton").remove()

    }
    
    const URL = `https://pokeapi.co/api/v2/item/${search}`

    console.log(search)
    console.log(URL)

    fetch(URL)
        .then(response => {

            if (!response.ok) throw new Error("Item not found")

            return response.json()
        })

        .then(data => {

            let itemName = data.name.toUpperCase()

            let itemImage = data.sprites.default

            let itemID = data.id

            let itemCategory = data.category.name

            let itemEntries = data.effect_entries.map(e => e.effect)
            let itemDescription = itemEntries[1]

            document.getElementById("itemCardContainer").innerHTML = `
                    <div class="col-md-4 col-12" id="itemCard">
                        <div class="card mx-auto">
                            <div class="card-body">
                                <h3 class="card-title" id="itemName">${itemName}</h3>
                                <img src="${itemImage}" id="itemImage" width="100px">
                                <p class="card-text" id="itemDescription">${itemDescription}</p>
                                <p class="card-text" id="itemID"><strong>Item nº</strong>${itemID}</p>
                                <p class="card-text" id="itemCategory"><strong>Category: </strong>${itemCategory}</p>
                            </div>
                        </div>
                    </div>
                    `

        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })

}

function randomSearch() {
    
    fetch('https://pokeapi.co/api/v2/item?limit=100000&offset=0')
        .then(response => {

            if (!response.ok) throw new Error("Item not found")

            return response.json()
        })

        .then(data => {

        let results = data.results.map(n => n)

        let randomItem = results[Math.floor(Math.random() * results.length)].name

        searchItem(randomItem)
        
        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })


}