var indexSum = 0
var lastSearchedPokeSpecie;
var imageSelection = "sprites"
const shinnyAudio = new Audio("Sounds/shiny-pokemon.mp3")

async function showPokemon() {

    for (let i = 1 + 30 * indexSum; i <= 30 + 30 * indexSum; i++) {

        if (i > 1025) {
            document.getElementById("showMorePokesButton").remove()
            break
        }

        let shinyProb = Math.floor(Math.random() * (4096)) // Calcular probabilidad de Pokemon Shinny

        const URL = `https://pokeapi.co/api/v2/pokemon/${i}`

        console.log(URL)
        console.log(shinyProb)

        await fetch(URL)
            .then(response => {

                if (!response.ok) throw new Error("Pokemon not found")

                return response.json()
            })

            .then(data => {

                let pokeName = data.name.toUpperCase()

                let pokeImage

                if (imageSelection == "sprites") {

                    if (shinyProb == 1000) {

                        pokeImage = data.sprites.front_shiny
                        shinnyAudio.play()

                    } else {

                        pokeImage = data.sprites.front_default

                    }

                } else if (imageSelection == "artworks") {

                    if (shinyProb == 1000) {

                        pokeImage = data.sprites.other['official-artwork'].front_shiny
                        shinnyAudio.play()

                    } else {

                        pokeImage = data.sprites.other['official-artwork'].front_default

                    }

                }


                let pokeCry = data.cries.latest

                let pokeID = data.id

                document.getElementById("pokeCardContainer").innerHTML += `
                    <div class="col-md-4 col-12" id="pokeCard">
                        <div class="card mx-auto">
                            <div class="card-body">
                                <h3 class="card-title" id="pokeName">${pokeName}</h3>
                                <img src="${pokeImage}" id="pokeImage${i}" width="300px"><br>
                                <audio controls src="${pokeCry}"></audio>
                                <p class="card-text" id="pokeID"><strong>Pokedex nº</strong>${pokeID}</p>
                                <p class="card-text" id="pokeType"><strong>Types:</strong></p>
                                <div id="typeIMGcontainer${i}">
                                </div>
                            </div>
                        </div>
                    </div>
                    `

                const types = data.types.map(t => t.type.name)
                let pokeType1 = types[0].toLowerCase()

                document.getElementById(`typeIMGcontainer${i}`).innerHTML += `
                <img src="TypesIMG/${pokeType1}.png" id=typeIMG>`

                if (types.length > 1) {
                    let pokeType2 = types[1].toLowerCase()
                    document.getElementById(`typeIMGcontainer${i}`).innerHTML += `
                    <img src="TypesIMG/${pokeType2}.png" id=typeIMG>`
                }



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

    let search = document.getElementById("search").value.toLowerCase()

    let search_array = search.split(" ")

    search = search_array.join("-")

    const URL = `https://pokeapi.co/api/v2/pokemon/${search}`

    let shinyProb = Math.floor(Math.random() * (4096)) // Calcular probabilidad de Pokemon Shinny

    console.log(search)
    console.log(URL)
    console.log(shinyProb)

    fetch(URL)
        .then(response => {

            if (!response.ok) throw new Error("Pokemon not found")

            return response.json()
        })

        .then(data => {

            let pokeName = data.name.toUpperCase()

            let pokeImage;

            let pokeCry = data.cries.latest

            let pokeID = data.id
            if (pokeID == 201 && imageSelection == "sprites") { // Revisa si el pokemon es unown y elige al azar una de sus formas (A - Z, ! y ?) si estan los sprites seleccionados

                let forms = data.forms
                let formsLen = forms.length
                let randomForm = forms[Math.floor(Math.random() * formsLen)]
                fetch(randomForm.url).then(formResponse => formResponse.json()).then(formData => {

                    if (shinyProb == 1000) {

                        pokeImage = formData.sprites.front_shiny
                        shinnyAudio.play()

                    } else {

                        pokeImage = formData.sprites.front_default

                    }

                    document.getElementById("pokeImage").src = pokeImage

                })

            } else {


                if (imageSelection == "sprites") {

                    if (shinyProb == 1000) {

                        pokeImage = data.sprites.front_shiny
                        shinnyAudio.play()

                    } else {

                        pokeImage = data.sprites.front_default

                    }

                } else if (imageSelection == "artworks") {

                    if (shinyProb == 1000) {

                        pokeImage = data.sprites.other['official-artwork'].front_shiny
                        shinnyAudio.play()

                    } else {

                        pokeImage = data.sprites.other['official-artwork'].front_default

                    }

                }
            }

            let pokeHeight = data.height / 10
            let pokeWeight = data.weight / 10

            document.getElementById("pokeCardContainer").innerHTML = `
                <div class="col-md-11 col-12" id="pokeCard">
                    <div class="card mx-auto">
                        <div class="row" id="pokeCardHeader">
                            <h3 class="card-title" id="pokeName">${pokeName}</h3>
                        </div>
                        <div class="row" id="pokeCardBody">
                            <div class="col-md-6 col-12">
                                <img src="${pokeImage}" id="pokeImage" width="300px"><br>
                                <audio controls src="${pokeCry}"></audio>
                                <p class="card-text" id="pokeID"><strong>Pokedex nº</strong>${pokeID}</p>
                                <p class="card-text" id="dexEntry"></p>
                                <button onclick="showDesc()" id="showDescButton">Show Pokedex Entry</button>
                                <p><strong>Game Appearances:</strong></p>
                                <div id="gameList">
                                </div>
                                <p class="card-text" id="pokeType"><strong>Types:</strong></p>
                                <div id="typeIMGcontainer">
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <p><strong>Height: </strong>${pokeHeight} m</p>
                                <p><strong>Weight: </strong>${pokeWeight} Kg</p>
                                <div id="statsContainer">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

            const types = data.types.map(t => t.type.name)
            let pokeType1 = types[0].toLowerCase()

            document.getElementById("typeIMGcontainer").innerHTML += `
                <img src="TypesIMG/${pokeType1}.png" id=typeIMG>`

            if (types.length > 1) {
                let pokeType2 = types[1].toLowerCase()
                document.getElementById("typeIMGcontainer").innerHTML += `
                    <img src="TypesIMG/${pokeType2}.png" id=typeIMG>`
            }

            const games = data.game_indices.map(g => g.version.name)

            for (let i = 0; i < games.length; i++) {
                let currentGame = games[i].toUpperCase()
                document.getElementById("gameList").innerHTML += `
                    <label id="pokemon${currentGame}" class="gameName"><strong>${currentGame}</strong> </label>
                `
            }

            const stats = data.stats
            let statsHTML = ""

            for (let i = 0; i < stats.length; i++) {
                let currentStatName = stats[i].stat.name
                let currentStatValue = stats[i].base_stat

                let percentage = (currentStatValue / 255) * 100

                statsHTML += `
                    <div class="stat-item mb-2">
                        <div class="d-flex justify-content-between">
                            <strong>${currentStatName.toUpperCase()}</strong>
                            <span>${currentStatValue}</span>
                        </div>
                        <div class="progress" style="height: 12px; background-color: #333;">
                            <div id="${currentStatName}Stat" 
                                class="progress-bar" 
                                role="progressbar" 
                                style="width: ${percentage}%" 
                                aria-valuenow="${currentStatValue}" 
                                aria-valuemin="0" 
                                aria-valuemax="255">
                            </div>
                        </div>
                    </div>
                `
            }

            document.getElementById("statsContainer").innerHTML = statsHTML

            for (let i = 0; i < stats.length; i++) {
                updateStatBarColor(stats[i].base_stat, stats[i].stat.name)
            }

            lastSearchedPokeSpecie = data.species.name

            console.log(data)
        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })

}

function showDesc() {

    if (document.getElementById("showDescButton") != null) {
        document.getElementById("showDescButton").remove()
    }

    const URL = `https://pokeapi.co/api/v2/pokemon-species/${lastSearchedPokeSpecie}`

    console.log(lastSearchedPokeSpecie)
    console.log(URL)

    fetch(URL)
        .then(response => {

            if (!response.ok) throw new Error("Description not found")

            return response.json()
        })

        .then(data => {

            const entries = data.flavor_text_entries.map(e => e)

            for (let i = entries.length - 1; i >= 0; i--) { // Recorre todas las entradas de la pokedex del pokemon hasta encontrar la entrada en inglés más reciente

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

function updateStatBarColor(value, statId) {
    const barId = `${statId}Stat`
    const statBar = document.getElementById(barId)

    const maxHue = 175

    if (statBar) {
        let hue = Math.min(value * maxHue / 255, maxHue);

        statBar.style.backgroundColor = `hsl(${hue}, 90%, 45%)`

        statBar.style.boxShadow = `0 0 5px hsl(${hue}, 90%, 60%)`
    }
}

async function updateImages() {

    imageSelection = document.getElementById("artworkSelect").value

    if (document.getElementById("pokeImage") != null) { // Hay sólo 1 pokemon (se ha buscado)

        let currentSearch = document.getElementById("pokeName").innerHTML.toLowerCase()

        const URL = `https://pokeapi.co/api/v2/pokemon/${currentSearch}`

        let shinyProb = Math.floor(Math.random() * (4096))

        console.log(URL)
        console.log(shinyProb)

        fetch(URL)
            .then(response => {

                if (!response.ok) throw new Error("Pokemon not found")

                return response.json()
            })

            .then(data => {

                let pokeImage;

                let pokeID = data.id
                if (pokeID == 201 && imageSelection == "sprites") { // Revisa si el pokemon es unown y elige al azar una de sus formas (A - Z, ! y ?) si estan los sprites seleccionados

                    let forms = data.forms
                    let formsLen = forms.length
                    let randomForm = forms[Math.floor(Math.random() * formsLen)]
                    fetch(randomForm.url).then(formResponse => formResponse.json()).then(formData => {

                        if (shinyProb == 1000) {

                            pokeImage = formData.sprites.front_shiny
                            shinnyAudio.play()

                        } else {

                            pokeImage = formData.sprites.front_default

                        }

                        document.getElementById("pokeImage").src = pokeImage

                    })


                } else {


                    if (imageSelection == "sprites") {

                        if (shinyProb == 1000) {

                            pokeImage = data.sprites.front_shiny
                            shinnyAudio.play()

                        } else {

                            pokeImage = data.sprites.front_default

                        }

                    } else if (imageSelection == "artworks") {

                        if (shinyProb == 1000) {

                            pokeImage = data.sprites.other['official-artwork'].front_shiny
                            shinnyAudio.play()

                        } else {

                            pokeImage = data.sprites.other['official-artwork'].front_default

                        }

                    }

                    document.getElementById("pokeImage").src = pokeImage

                }

            })

            .catch(error => {
                alert(error.message)
                console.error("Error:", error)
            })

    } else { // Hay más de 1 pokemon (Se está en la vista de cuadrícula)

        for (let i = 1; i <= 30 + 30 * indexSum; i++) {

            if (i > 1025) {
                break
            }

            let shinyProb = Math.floor(Math.random() * (4096)) // Calcular probabilidad de Pokemon Shinny

            const URL = `https://pokeapi.co/api/v2/pokemon/${i}`

            console.log(URL)
            console.log(shinyProb)

            await fetch(URL)
                .then(response => {

                    if (!response.ok) throw new Error("Pokemon not found")

                    return response.json()
                })

                .then(data => {

                    let pokeImage


                    if (imageSelection == "sprites") {

                        if (shinyProb == 1000) {

                            pokeImage = data.sprites.front_shiny
                            shinnyAudio.play()

                        } else {

                            pokeImage = data.sprites.front_default

                        }

                    } else if (imageSelection == "artworks") {

                        if (shinyProb == 1000) {

                            pokeImage = data.sprites.other['official-artwork'].front_shiny
                            shinnyAudio.play()

                        } else {

                            pokeImage = data.sprites.other['official-artwork'].front_default

                        }

                    }

                    document.getElementById(`pokeImage${i}`).src = pokeImage

                })

                .catch(error => {
                    alert(error.message)
                    console.error("Error:", error)
                })
        }

    }

}