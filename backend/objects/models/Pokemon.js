export default class Pokemon {
    id = null;
    name = null;
    sprite = null;
    type = null;
    past_types = null;
    gen_change = null;

    constructor (data) {
        this.id = data.id;
        this.name = data.name;
        this.sprite = data.sprites.front_shiny;
        this.types = data.types;
        setPastTypes(data.past_types);
    }

    setPastTypes (past_types) {
        if (past_types.length > 0) {
            this.past_types = past_types[0].types;
            this.gen_change = past_types[0].generation.name;
        }
    }

}

