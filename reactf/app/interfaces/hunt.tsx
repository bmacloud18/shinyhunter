export default interface Hunt {
    id: number;
    pkm: String;
    nickname: String;
    user: number;
    game: String;
    method: number;
    start_date_string: String;
    start_date_display: String;
    end_date_string: String | null;
    end_date_display: String | null;
    hunt_time: number;
    hunt_time_display: String;
    count: number;
    increment: number;
    charm: String;
    sprite: String;
}