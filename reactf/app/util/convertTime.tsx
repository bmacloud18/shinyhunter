// timer library not working correctly with start values, so need to calculate here
export default function convertTime(s: number) {
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
        if (hours < 10) {
            formattedTime.push(`0${hours}`);
        }
        else {
            formattedTime.push(`${hours}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    if (minutes > 0) {
        if (minutes < 10) {
            formattedTime.push(`0${minutes}`);
        }
        else {
            formattedTime.push(`${minutes}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        if (seconds < 10) {
            formattedTime.push(`0${seconds}`);
        }
        else {
            formattedTime.push(`${seconds}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    return formattedTime.join(':');
};