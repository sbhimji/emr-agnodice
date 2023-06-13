module.exports = function(texts = []) {
    var retText = '';
    texts.forEach(function(text) {
        console.log(text)
        if (text !== undefined) {
            if (retText.length == 0) {
                retText += text;
            } else {
                retText = retText + ", " + text;
            }
            console.log(retText)
        }
    })
    if (retText === '') {
        retText = "Within normal limits."
    }
    return retText;
}