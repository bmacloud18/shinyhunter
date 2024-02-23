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
    hunt_time_converted = null;
    count = null;
    increment = null;
    charm = null;

    constructor (data) {
        this.id = data.hnt_id;
        this.pkm = data.pkm_name;
        this.user = data.usr_id;
        this.game = data.gam_name;
        this.start_date_string = data.hnt_start_date_string;
        this.start_date_display = convertDate(data.hnt_start_date_string);
        this.end_date_string = data.hnt_end_date_string;
        this.end_date_display = convertDate(data.hnt_end_date_string);
        this.hunt_time = data.hnt_time_s;
        this.hunt_time_display = convertTime(data.hnt_time_s);
        this.count = data.hnt_count;
        this.increment = data.hnt_inc;
        this.charm = data.hnt_charm;
        this.nickname = data.hnt_nnm;
    }
};

function convertTime(s) {
    // Ensure the input is a non-negative number
    if (!Number.isFinite(s) || s < 0) {
        return 'Invalid input';
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    // Construct the formatted string
    const formattedTime = [];

    if (hours > 0) {
        formattedTime.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0) {
        formattedTime.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        formattedTime.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }

    return formattedTime.join(', ');
}

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