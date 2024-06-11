
window.onload = function () {
    const hash = window.location.hash;
    if (hash.startsWith("#!/app/spots/spot/")) {
        const id = hash.split("/")[4];
        const newUrl = `/spots/${id}`;
        window.location.replace(newUrl);
    } else if (hash.startsWith("#!/app/resources/document/")) {
        const id = hash.split("/")[4];
        const newUrl = `/resources/${id}`;
        window.location.replace(newUrl);
    } else if (hash.startsWith("#!")) {
        const newUrl = `/`;
        window.location.replace(newUrl);
    }
};