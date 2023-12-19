export class Pokemon {
    id = null;
    name = null;
    avatar = null;
    type = null;

    constructor (data) {
        this.id = data.pkm_id;
        this.name = data.pkm_name;
        this.avatar = data.pkm_avatar;
        this.type = data.pkm_type;
    }

}