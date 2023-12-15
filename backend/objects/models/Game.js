module.exports = class {
    id = null;
    name = null;
    avatar = null;

    constructor (data) {
        this.id = data.gam_id;
        this.name = data.gam_name;
        this.avatar = data.gam_avatar;
    }

}