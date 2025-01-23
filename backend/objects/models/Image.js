export default class Image {
    id = null;
    path = null;

    constructor(data) {
        this.id = data.img_id;
        this.path = data.img_path;
    }
}