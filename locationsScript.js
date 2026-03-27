
const shinnyAudio = new Audio("Sounds/shiny-pokemon.mp3")

async function showLocations() {

    for (let i = 1; i <= 9; i++) {

        const URL = `https://pokeapi.co/api/v2/pokemon-habitat/${i}`

        console.log(URL)

        await fetch(URL)
            .then(response => {

                if (!response.ok) throw new Error("Location not found")

                return response.json()
            })

            .then(data => {

                let locName = data.name.toUpperCase()

                let locID = data.id

                document.getElementById("locCardContainer").innerHTML += `
                    <div class="col-md-4 col-12" id="locCard">
                        <div class="card mx-auto">
                            <div class="card-body">
                                <h3 class="card-title" id="locName">${locName}</h3>
                                <label class="card-text"><strong>Location ID: </strong></label>
                                <label id="locID">${locID}</label><br>
                                <button id="${locName}" onclick="showLocationsPoke(event)">Show Pokemon</button>
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

function showLocationsPoke(clickedLocation) {

    document.getElementById("pokeCardContainer").innerHTML = ""

    const Location = clickedLocation.target.id
    console.log("Clicked location:", Location)

    const locURL = `https://pokeapi.co/api/v2/pokemon-habitat/${Location}`

    fetch(locURL)
        .then(response => {

            if (!response.ok) throw new Error("Location not found")

            return response.json()
        })

        .then(async data => {

            let locPokes = data.pokemon_species.map(p => p.url)

            for (let i = 0; i < locPokes.length; i++) {

                let locPokeURL = locPokes[i]

                let shinyProb = Math.floor(Math.random() * (4096)) // Calcular probabilidad de Pokemon Shinny

                console.log(shinyProb)

                await fetch(locPokeURL)
                    .then(response => {

                        if (!response.ok) throw new Error("Pokemon not found")

                        return response.json()
                    })

                    .then(async data => {

                        let pokeName = data.name.toUpperCase()
                        let pokeImage

                        let pokeVarieties = data.varieties.map(p => p)

                        let defaultVarietyURL

                        for (let i = 0; i < pokeVarieties.length; i++) {

                            if (pokeVarieties[i].is_default == true) {
                                defaultVarietyURL = pokeVarieties[i].pokemon.url
                                break

                            }

                        }

                        const pokemonRes = await fetch(defaultVarietyURL)
                        const pokemonData = await pokemonRes.json()

                        if (shinyProb === 1000) {
                            pokeImage = pokemonData.sprites.front_shiny
                            shinnyAudio.play();
                        } else {
                            pokeImage = pokemonData.sprites.front_default
                        }

                        document.getElementById("pokeCardContainer").innerHTML += `
                            <div class="col-md-2 col-12" id="pokeCard">
                                <div class="card mx-auto">
                                    <div class="card-body">
                                        <h4 class="card-title" id="pokeName">${pokeName}</h3>
                                        <img src="${pokeImage}" id="pokeImage" width="100px">
                                    </div>
                                </div>
                            </div>                        
                        `

                    })

            }

            console.log(data)
        })

        .catch(error => {
            alert(error.message)
            console.error("Error:", error)
        })

}
