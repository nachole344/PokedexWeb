var indexSum = 0
var lastSearchedLocSpecie;

async function showPokemon() {

    for (let i = 1 + 30 * indexSum; i <= 30 + 30 * indexSum; i++) {
        if (i > 1152) {
            document.getElementById("showMorePokesButton").remove()
            break
        }

        const URL = `https://pokeapi.co/api/v2/location/${i}`
        const areaURL = `https://pokeapi.co/api/v2/location-area/${i}`

        console.log(URL)

        await fetch(URL)
            .then(response => {

                if (!response.ok) throw new Error("Pokemon not found")

                return response.json()
            })

            .then(data => {

                let locName = data.name.toUpperCase()

                let locID = data.id

                let locRegion = data.region.name

                document.getElementById("locCardContainer").innerHTML += `
                    <div class="col-md-4 col-12" id="locCard">
                        <div class="card mx-auto">
                            <div class="card-body">
                                <h3 class="card-title" id="locName">${locName}</h3>
                                <p class="card-text" id="locID"><strong>Pokedex nº</strong>${locID}</p>
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

function showMorePokes() {

    indexSum++
    showPokemon()

}

function searchPokemon() {
    document.getElementById("pokeCardContainer").innerHTML = ""

    if (document.getElementById("showMorePokesButton") != null) {

        document.getElementById("showMorePokesButton").remove()

    }

    const search = document.getElementById("search").value.toLowerCase()
    const URL = `https://pokeapi.co/api/v2/pokemon/${search}`

    let shinnyProb = Math.floor(Math.random() * (4096)) // Calcular probabilidad de Pokemon Shinny

    console.log(search)
    console.log(URL)
    console.log(shinnyProb)

    fetch(URL)
        .then(response => {

            if (!response.ok) throw new Error("Pokemon not found")

            return response.json()
        })

        .then(data => {

            let locName = data.name.toUpperCase()

            let locImage;

            let locCry = data.cries.latest

            let locID = data.id
            if (locID == 201) { // Revisa si el pokemon es unown y elige al azar una de sus formas (A - Z, ! y ?)

                let forms = data.forms
                let formsLen = forms.length
                let randomForm = forms[Math.floor(Math.random() * formsLen)]
                fetch(randomForm.url).then(formResponse => formResponse.json()).then(formData => {


                    if (shinnyProb == 1000) {

                        locImage = formData.sprites.front_shiny

                    } else {

                        locImage = formData.sprites.front_default

                    }

                    document.getElementById("pokeImage").src = locImage
                })

            } else {

                if (shinnyProb == 67) {

                    locImage = data.sprites.front_shiny

                } else {

                    locImage = data.sprites.front_default

                }
            }

            document.getElementById("pokeCardContainer").innerHTML = `
                <div class="col-md-4 col-12" id="pokeCard">
                    <div class="card mx-auto">
                        <div class="card-body">
                            <h3 class="card-title" id="pokeName">${locName}</h3>
                            <img src="${locImage}" id="pokeImage" width="300px">
                            <audio controls src="${locCry}"></audio>
                            <p class="card-text" id="pokeID"><strong>Pokedex nº</strong>${locID}</p>
                            <p class?"card-text" id="dexEntry"></p>
                            <button onclick="showDesc()" id="showDescButton">Show Pokedex Entry</button>
                            <p><strong>Game Appearances:</strong></p>
                            <div id="gameList">
                            </div>
                            <p class="card-text" id="pokeType"><strong>Types:</strong></p>
                            <div id="typeIMGcontainer">
                            </div>
                        </div>
                    </div>
                </div>
                `

            const types = data.types.map(t => t.type.name)
            let locType1 = types[0].toLowerCase()

            document.getElementById("typeIMGcontainer").innerHTML += `
                <img src="TypesIMG/${locType1}.png" id=typeIMG>`

            if (types.length > 1) {
                let locType2 = types[1].toLowerCase()
                document.getElementById("typeIMGcontainer").innerHTML += `
                    <img src="TypesIMG/${locType2}.png" id=typeIMG>`
            }

            const games = data.game_indices.map(g => g.version.name)

            for (let i = 0; i < games.length; i++){
                let currentGame = games[i].toUpperCase()
                document.getElementById("gameList").innerHTML += `
                    <label id="pokemon${currentGame}" class="gameName"><strong>${currentGame}</strong> </label>
                `
            }

            lastSearchedLocSpecie = data.species.name

            console.log(data)
        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })

}

function showDesc(){

    if (document.getElementById("showDescButton") != null){
        document.getElementById("showDescButton").remove()
    }

    const URL = `https://pokeapi.co/api/v2/pokemon-species/${lastSearchedLocSpecie}`

    console.log(lastSearchedLocSpecie)
    console.log(URL)

    fetch(URL)
        .then(response => {

            if (!response.ok) throw new Error("Description not found")

            return response.json()
        })

        .then(data => {

            const entries = data.flavor_text_entries.map(e => e)

            for (let i = entries.length - 1; i >= 0;i--){ // Recorre todas las entradas de la pokedex del pokemon hasta encontrar la entrada en inglés más reciente

                let currentEntry = entries[i].flavor_text
                let currentLang = entries[i].language.name

                if (currentLang == "en") {
                    document.getElementById("dexEntry").innerHTML = currentEntry
                    break
                }

            }

            console.log(data)
        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })

}