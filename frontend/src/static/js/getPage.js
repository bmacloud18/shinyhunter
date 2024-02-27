export default function getPage(url) {
    const lastSlash = url.lastIndexOf('/');
    const q = url.lastIndexOf('?');
    if (q > lastSlash && lastSlash !== -1) {
        return url.slice(lastSlash + 1, q);
    }
    else if (lastSlash !== -1) {
        return url.slice(lastSlash + 1);
    }
    else {
        return url;
    }
}