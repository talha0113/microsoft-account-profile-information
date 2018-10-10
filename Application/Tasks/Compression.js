let fs = require('fs');
let zlib = require('zlib');

let files = fs.readdirSync("./Distributions");
for (var i = 0; i < files.length; i++) {
    if (files[i].lastIndexOf(".js") !== -1) {
        if (!(files[i].lastIndexOf(".json") >= 0)) {
            fs.createReadStream('./Distributions/' + files[i]).pipe(zlib.createGzip()).pipe(fs.createWriteStream('./Distributions/' + files[i] + '.gz'));
        }
    }
}