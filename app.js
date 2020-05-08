const colors = require('colors'); // to get a nice console

// instant advertising
console.log(" ╔═══════════════════════════════════════════════════════════════╗".brightCyan)
console.log(" ║   Trxyy's Alternative-api NodeJs server v2.0 by chaun14 🐑    ║".brightCyan)
console.log(" ╚═══════════════════════════════════════════════════════════════╝".brightCyan)

const fs = require('fs');
const md5File = require('md5-file')
const config = require('./config');
const chokidar = require('chokidar');

const express = require('express')
const app = express()

// the middleware
app.use('/', express.static('public'));
app.use('/files', express.static('files'));
app.use('/bootstrap', express.static('bootstrap'));

let fileList = new Map()
const debug = config.debug

/* ================================================== files watcher ==================================================*/

const watcher = chokidar.watch('./files/', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});
watcher
// action when a new file is detected
    .on('add', async path => {
        const hash = md5File.sync(path)
        const stats = fs.statSync(path);

        fileList.set(path, { "hash": hash, "size": stats.size });
        if (debug) console.log(`File ${path} (${hash}) has been added ${stats.size}`)
    })
    // action when a file is changed
    .on('change', async path => {
        const hash = md5File.sync(path)
        const stats = fs.statSync(path);

        fileList.set(path, { "hash": hash, "size": stats.size });
        if (debug) console.log(`File ${path} has been changed`)
    })
    // action when a file is deleted
    .on('unlink', async path => {
        fileList.delete(path)
        if (debug) console.log(`File ${path} has been removed`)
    });


/* ================================================== Routes ==================================================*/

// when a launcher gets the download list
app.get('/files', async function(req, res) {

    const initialTime = Date.now()
    let xml = "";

    // list all Map elements
    for (var [path, values] of fileList) {

        // builder
        xml = xml + "<Contents>" +
            "<Key>" + path.slice(6).replace(/\\/g, "/") + "</Key>" +
            "<Size>" + values.size + "</Size>" +
            "<ETag>" + values.hash + "</ETag>" +
            "</Contents>"

    }

    // so that the browser and the launcher see that it's xml
    res.set('Content-Type', 'text/xml');

    // we finalize our tags and send our generated xml object
    const finalTime = Date.now()

    // info log
    console.log("[INFO] ".brightBlue + `Listing of `.yellow + `${fileList.size}`.rainbow + ` files in `.yellow + (finalTime - initialTime) + "ms for ".yellow + (req.connection.remoteAddress).magenta)

    // send list to launcher
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

// give the bootstrap hash to clients
app.get('/bootstrap/launcher.cfg', function(req, res) {
    try {
        // get a bootstrap hash
        let hash = md5File.sync("./bootstrap/launcher.jar")

        // give the bootstrap hash
        res.set('Content-Type', 'text/cfg');
        res.send(hash)

        console.log("[INFO] ".brightBlue + `Hashing the bootstrap for `.yellow + (req.connection.remoteAddress).magenta)

    } catch (error) {
        // handle errors
        console.error(error);
        res.status(500).send("Can't load or hash launcher.jar")
        console.log("[ERROR] ".brightRed + `Can't load or hash launcher.jar for `.brightRed + (req.connection.remoteAddress).brightRed)

    }
})


// yes I took this wtf port because it's trxyy's discord tag 
let port = (process.env.PORT || 2332)
app.listen(port, () => {
    console.log(`[`.brightCyan + `INFO`.white + `]`.brightCyan + ` Listening on port `.brightCyan + `${port}`.blue)
});


// startup completed information log 
console.log(`[`.brightCyan + `INFO`.white + `]`.brightCyan + " App started".brightCyan)