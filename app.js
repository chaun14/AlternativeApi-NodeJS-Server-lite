const colors = require('colors'); // to get a nice console

// instant advertising
console.log(" ╔══════════════════════════════════════════════════════════╗".brightCyan)
console.log(" ║   Trxyy's Alternative-api NodeJs server by chaun14 🐑    ║".brightCyan)
console.log(" ╚══════════════════════════════════════════════════════════╝".brightCyan)

const fs = require('fs');
const md5File = require('md5-file')
const recursiveReadSync = require('recursive-readdir-sync')
const config = require('./config');

const express = require('express')
const app = express()

// the middleware
app.use('/', express.static('public'));
app.use('/files', express.static('files'));


/* ================================================== CODE ==================================================*/


// when a launcher gets the download list
app.get('/files', function(req, res) {

    // declaring some operating variables
    let files;
    let xml;
    let items;
    let initialTime = Date.now()


    // information log in the console

    console.log("[INFO] ".brightBlue + "Ip ".yellow + (req.connection.remoteAddress).magenta + (" has " + req.method + " the list of files to download").yellow)

    try {
        items = recursiveReadSync('./files'); // listage des fichiers


    } catch (err) { // on le laisse pas passer les erreur méchantes
        if (err.errno === 34) {
            res.status(400).send('Please create a folder named files');
        } else {
            //something unrelated went wrong, rethrow
            throw new Error("Error - Something went wrong : " + err);
        }
    }

    files = items // a useless but good thing.


    // we list the files
    for (let i = 0; i < items.length; i++) {

        //we get the md5 of the file
        const hash = md5File.sync("./" + items[i])

        // we get his size
        const stats = fs.statSync("./" + items[i]);

        // we build the xml object (if it's the first one)
        if (xml == undefined) {
            xml = "<Contents>" +
                "<Key>" + items[i].slice(6).replace(/\\/g, "/") + "</Key>" +
                "<Size>" + stats.size + "</Size>" +
                "<ETag>" + hash + "</ETag>" +
                "</Contents>"
        } else { // we build the xml object (if it's not the first one)
            xml = xml + "<Contents>" +
                "<Key>" + items[i].slice(6).replace(/\\/g, "/") + "</Key>" +
                "<Size>" + stats.size + "</Size>" +
                "<ETag>" + hash + "</ETag>" +
                "</Contents>"
        }

    }
    // we get the finql timestamp
    const finalTime = Date.now()

    // second informative log

    console.log("[INFO] ".brightBlue + `Listing of `.yellow + `${files.length}`.rainbow + ` files in `.yellow + (finalTime - initialTime) + "ms for ".yellow + (req.connection.remoteAddress).magenta)

    // debug only
    // console.log("the xml is : "+xml)



    // so that the browser and the launcher see that it's xml
    res.set('Content-Type', 'text/xml');

    // we finalize our tags and send our generated xml object
    res.send('<?xml version="1.0"?>' + "<xml>" + "<ListBucketResult>" + xml + "</ListBucketResult>" + "</xml>")

});


// not to display an ugly empty page
app.get('/', function(req, res) {
    res.send(`Trxyy's alternative lib download server by <a href="https://chaun14.fr/">chaun14</a>`)
});

// management of launcher activation
app.get('/status.cfg', function(req, res) {
    res.send(config.launcherStatus)
});


// yes I took this wtf port because it's trxyy's discord tag 
let port = (process.env.PORT || 2332)
app.listen(port, () => {
    console.log(`[`.brightCyan + `INFO`.white + `]`.brightCyan + ` Listening on port `.brightCyan + `${port}`.blue)
});


// startup completed information log 
console.log(`[`.brightCyan + `INFO`.white + `]`.brightCyan + " App started".brightCyan)