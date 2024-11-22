import Timer from "easytimer.js";

export default function getSeconds(t: Timer) {

    return t.getTimeValues().seconds + (t.getTimeValues().minutes * 60) + 
        (t.getTimeValues().hours * 3600) + (t.getTimeValues().days * 86400);
}