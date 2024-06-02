import { List } from "postcss/lib/list";

export default interface Pokemon {
    id: number,
    name: String,
    sprite: String,
    types: List,
    games: List,
    color: String
  }