import { List } from "postcss/lib/list";

export default interface Pokemon {
    id: number,
    name: string,
    sprite: string,
    types: List,
    games: List,
    color: string
  }