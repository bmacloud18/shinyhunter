export default interface Hunt {
    id: number;
    pkm: string;
    nickname: string;
    user: number;
    game: string;
    method: number;
    start_date_string: string;
    start_date_display: string;
    end_date_string: string | null;
    end_date_display: string | null;
    hunt_time: number;
    hunt_time_display: string;
    count: number;
    increment: number;
    charm: string;
    sprite: string;
}