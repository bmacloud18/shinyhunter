export default class Method {
    id = null;
    name = null;
    odds = null;
    charm_odds = null;

    constructor(data) {
        this.id = data.mtd_id;
        this.name = data.mtd_name;
        this.odds = data.mtd_odds;
        this.charm_odds = data.mtd_charm_odds;
    }
}