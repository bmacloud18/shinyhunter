export default class Image {
    id = null;
    path = null;

    constructor(data) {
        this.id = data.img_id || null;
        this.path = data.img_path || null;
    }
}