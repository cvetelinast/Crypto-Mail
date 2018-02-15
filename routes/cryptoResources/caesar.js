function replace(input, key) {
    return input.replace(/([a-z])/g,
        ($1) => String.fromCharCode(($1.charCodeAt(0) + key + 26 - 97) % 26 + 97)
    ).replace(/([A-Z])/g,
        ($1) => String.fromCharCode(($1.charCodeAt(0) + key + 26 - 65) % 26 + 65));
}

function encode(input) {
    return replace(input, 3);
}
var decode = function (input) {
    return replace(input, -3);
}
exports.decode = decode;
