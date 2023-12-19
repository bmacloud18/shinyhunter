export default class Hunt {
    id = null;
    pkm = null;
    nickname = null;
    user = null;
    game = null;
    method = null;
    start_date_string = null;
    start_date_display= null;
    end_date_string = null;
    end_date_display = null;
    hunt_time = null;
    count = null;
    increment = null;
    charm = null;

    constructor (data) {
        this.id = data.hnt_id;
        this.pkm = data.pkm_id;
        this.nickname = data.hnt_nnm;
        this.user = data.usr_id;
        this.game = data.gam_id;
        this.start_date_string = data.hnt_start_date_string;
        this.start_date_display = convertDate(data.hnt_start_date_string);
        this.end_date_string = data.hnt_end_date_string;
        this.end_date_display = convertDate(data.hnt_end_date_string);
        this.hunt_time = data.hnt_time_ms;
        this.count = data.hnt_count;
        this.increment = data.hnt_inc;
        this.charm = data.hnt_charm;
    }
};

function convertDate(date) {
    let eventdate = new Date(date)
    let datestring = eventdate.toDateString();
    let timestring = eventdate.toLocaleTimeString();
  
    let dws = 0;
    let idx = 0;
    let fullstring = "";
    let dcc = datestring.charAt(idx);
    while (dws < 3)
    {
        if (dcc == " ") {
            dws++;
        }
        fullstring = fullstring + dcc;
        idx++;
        dcc = datestring.charAt(idx);
    }
  
    fullstring = fullstring.substring(0, fullstring.length - 1) + ", ";
  
    idx = 0;
    let tcol = 0;
    let tcc = timestring.charAt(idx);
    while (tcol < 2)
    {
        if (tcc == ":") {
            tcol++;
        }
        fullstring = fullstring + tcc;
        idx++;
        tcc = timestring.charAt(idx);
    }
  
    let timesuffix = timestring.substring(timestring.length - 2, timestring.length) == "PM" ? "pm" : "am";
    return fullstring.substring(0, fullstring.length - 1) + timesuffix;
};