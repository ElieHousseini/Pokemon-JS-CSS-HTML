// importing elements
const pokemonContainer = document.querySelector('.pokemon-container')
const buttons = document.querySelectorAll('.button-container button')
const pagination = document.querySelectorAll('.pagination')
const heading = document.querySelector('#heading')
const searchBoxContainer = document.querySelector('.search-box-container')

// number of elements in each page
const generations = [
  // page 1
  ['Kanto', 1, 50],
  // page 2
  ['Johto', 51, 101],
  // page 3
  ['Hoenn', 102, 152],
  // page 4
  ['Sinnoh', 153, 203],
  // page 5
  ['Unova', 204, 254],
]

// pokemon current generation
let currentGen = 0

// first time fetching the data
let firstTime = true

//list of used colors
const colors = {
  grass: '#d2f2c2',
  poison: '#f7cdf7',
  fire: '#ffd1b5',
  flying: '#eae3ff',
  water: '#c2f3ff',
  bug: '#e0e8a2',
  normal: '#e6e6c3',
  electric: '#fff1ba',
  ground: '#e0ccb1',
  fighting: '#fcada9',
  psychic: '#ffc9da',
  rock: '#f0e09c',
  fairy: '#ffdee5',
  steel: '#e6eaf0',
  ice: '#e8feff',
  ghost: '#dbbaff',
  dragon: '#c4bdff',
  dark: '#a9abb0',
}

// optional idea instead of using async await
// function fetchKantoPokemon() {
//   fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
//     .then((response) => response.json())
//     .then((allpokemon) => console.log(allpokemon.results))
// }

// Fetching data from pokeapi
async function getPokemons(pokemonStartID, pokemonEndID) {
  // Adding the loader
  pokemonContainer.innerHTML = `<span class="loader"></span>`

  // Restricting Clicking on Buttons
  buttons.forEach((el) => {
    el.classList.add('restrict-click')
  })

  const responses = []

  // URL used to fetch the data
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

  // fetching pokemons from the api. one by one.
  for (let id = pokemonStartID; id <= pokemonEndID; id++) {
    const response = fetch(`${BASE_URL}/${id}`)
    // Pushing each element to the array "responses"
    responses.push(response)
  }

  // await: wait for the the fetch to finish adding to the array
  // promise.all:  takes an iterable of promises as an input,
  // and returns a single Promise that resolves to an array of the results of the input promises
  // meaning: proms is now an array that is iterable
  const proms = await Promise.all(responses)

  // resolving the single promise using .json
  // now promises contains an array of actual useful data
  const promises = await Promise.all(proms.map((el) => el.json()))

  // Removing the loader
  pokemonContainer.innerHTML = ''

  if (firstTime) {
    // insert searchBoxContainer inside pokemonContainer
    document.body.insertBefore(searchBoxContainer, pokemonContainer)
    firstTime = false
  }

  promises.forEach((el, ind) => {
    // adding the names of the pokemons
    const pokemonName = el.name

    // array which will be filled with pokemon types
    const pokemonTypes = []

    // adding the types of the pokemons to the array pokemonTypes
    el.types.forEach((item) => {
      pokemonTypes.push(item.type.name)
    })

    // adding the layout of each pokemon (pic, stats, ...)
    const imageURL = el.sprites.other['official-artwork'].front_default
    pokemonContainer.innerHTML += `
    <div class="pc-container">
      <div class="pokemon-card">
        <div class="card_front">
          <img src=${imageURL}></img>
          <div class="circle"></div>
          <h5 class="poke-id"> #${el.id} </h5>
          <h5 class="poke-name"> ${pokemonName.replace(/\w/, (ch) =>
            ch.toUpperCase()
          )} </h5>
          <h5> ${pokemonTypes
            .join(' / ')
            .replace(/\b\w/g, (ch) => ch.toUpperCase())} 
          </h5>
        </div>
        <div class="card_back">
          <div class="poke-stats-name">HP: ${el.stats[0].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[0].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[0].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Attack: ${el.stats[1].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[1].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[1].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Defense: ${el.stats[2].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[2].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[2].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Special-Attack: ${
            el.stats[3].base_stat
          }</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[3].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[3].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Special-Defense: ${
            el.stats[4].base_stat
          }</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[4].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[4].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Speed: ${el.stats[5].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
            colors[pokemonTypes[0]]
          } ${el.stats[5].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[5].base_stat}%"
          >
          </div>
        </div>
      </div>
    </div>
    `

    const pokemonCards = document.querySelectorAll('.card_front')
    const pokemonCard = pokemonCards[pokemonCards.length - 1]

    // adding background colors according to pokemon type
    if (pokemonTypes[1]) {
      pokemonCard.style.background =
        'linear-gradient(150deg,' +
        colors[el.types[0].type.name] +
        ' 50%,' +
        colors[el.types[1].type.name] +
        ' 50%)'
    } else {
      pokemonCard.style.background = colors[pokemonTypes[0]]
    }
  })

  // Enabling Clicking on Buttons
  setTimeout(() => {
    buttons.forEach((el) => {
      el.classList.remove('restrict-click')
    })
  }, 500)

  instantiateListener()
}

// searching feature for pokemons

function instantiateListener() {
  const pokemons = document.querySelectorAll('.pokemon-card .poke-name')
  const searchBox = document.querySelector('.search-box')

  searchBox.addEventListener('keyup', (e) => {
    const inp = searchBox.value.toLowerCase()

    pokemons.forEach((pokemon) => {
      const name = pokemon.textContent.toLowerCase()
      if (name.indexOf(inp) !== -1) {
        // item found
        pokemon.parentElement.parentElement.parentElement.style.display = 'flex'
      } else {
        // item not found
        pokemon.parentElement.parentElement.parentElement.style.display = 'none'
      }
    })
  })
}

// Adding buttons features

buttons.forEach((el) => {
  el.addEventListener('click', (e) => {
    const searchBox = document.querySelector('.search-box')
    if (searchBox) {
      searchBox.value = ''
    }
    if (
      e.target.id === 'right-btn' &&
      !e.target.classList.contains('restrict-click')
    ) {
      pagination[currentGen].classList.remove('current-page')
      currentGen = (currentGen + 1) % generations.length
      pagination[currentGen].classList.add('current-page')
      heading.innerText = generations[currentGen][0] + ' Pokédex'
      getPokemons(generations[currentGen][1], generations[currentGen][2])
    } else if (
      e.target.id === 'left-btn' &&
      !e.target.classList.contains('restrict-click')
    ) {
      pagination[currentGen].classList.remove('current-page')
      currentGen = (currentGen - 1 + generations.length) % generations.length
      pagination[currentGen].classList.add('current-page')
      heading.innerText = generations[currentGen][0] + ' Pokédex'
      getPokemons(generations[currentGen][1], generations[currentGen][2])
    }
  })
})

pagination.forEach((el) => {
  el.addEventListener('click', (e) => {
    if (!buttons[0].classList.contains('restrict-click')) {
      pagination[currentGen].classList.remove('current-page')
      currentGen = el.textContent - 1
      pagination[currentGen].classList.add('current-page')
      heading.innerText = generations[currentGen][0] + ' Pokédex'
      getPokemons(generations[currentGen][1], generations[currentGen][2])
    }
  })
})

getPokemons(generations[0][1], generations[0][2])
