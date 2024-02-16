//import for the poke-api client-side js wrapper, imported by the APIClient of this project
import Pokedex from "pokeapi-js-wrapper"
const customOptions = {
  protocol: "https",
  hostName: "localhost:443",
  versionPath: "/api/v2/",
  cache: true,
  timeout: 5 * 1000, // 5s
  cacheImages: true
}

export const pokedex = new Pokedex.Pokedex(customOptions)