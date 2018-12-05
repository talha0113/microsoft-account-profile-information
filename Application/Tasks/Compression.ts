import { readdirSync, createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";

let files = readdirSync("./Distributions");
for (var i = 0; i < files.length; i++) {
    if (files[i].lastIndexOf(".js") !== -1) {
        if (!(files[i].lastIndexOf(".json") >= 0)) {
            createReadStream('./Distributions/' + files[i]).pipe(createGzip()).pipe(createWriteStream('./Distributions/' + files[i] + '.gz'));
        }
    }
}