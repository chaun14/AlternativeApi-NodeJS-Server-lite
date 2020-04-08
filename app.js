const colors = require('colors'); // pour avoir une belle console

// instant publicité
console.log(" ╔══════════════════════════════════════════════════════════╗".brightCyan)
console.log(" ║   Trxyy's Alternative-api NodeJs server by chaun14 🐑    ║".brightCyan)
console.log(" ╚══════════════════════════════════════════════════════════╝".brightCyan)

const fs = require('fs');
const md5File = require('md5-file')
const recursiveReadSync = require('recursive-readdir-sync')

const express = require('express')
const app = express()
    // les middleware
app.use('/', express.static('public'));
app.use('/files', express.static('files'));



let launcherStatus;

/* ================================================== CONFIG ==================================================*/

// Set status as "Ok" if you want to activate the launcher. If it's something else, the launcher will be disabled.

launcherStatus = "Ok";
//example: launcherStatus = "Sorry the launcher is under maintenance";








/* ================================================== CODE ==================================================*/


// quand un launcher get la liste de téléchargement
app.get('/files', function(req, res) {

    // déclare quelques variables de fonctionnement
    let files;
    let xml;
    let items;
    let initialTime = Date.now()

    // log informatif dans la console
    console.log("[INFO] ".brightBlue + "Ip ".yellow + (req.connection.remoteAddress).magenta + (" has " + req.method + " the list of files to download").yellow)

    try {
        items = recursiveReadSync('./files'); // listage des fichiers


    } catch (err) { // on le laisse pas passer les erreur méchantes
        if (err.errno === 34) {
            res.send('Please create a folder named files');
        } else {
            //something unrelated went wrong, rethrow
            throw err;
        }
    }

    files = items // truc un chouilla inutile mais bon


    // on énumère les fichiers
    for (var i = 0; i < items.length; i++) {

        // on récup le hash md5 du fichier
        const hash = md5File.sync("./" + items[i])

        // on récup sa taille
        const stats = fs.statSync("./" + items[i]);

        // on build l'objet xml (si c'est le premier)
        if (xml == undefined) {
            xml = "<Contents>" +
                "<Key>" + items[i].slice(6).replace(/\\/g, "/") + "</Key>" +
                "<Size>" + stats.size + "</Size>" +
                "<ETag>" + hash + "</ETag>" +
                "</Contents>"
        } else { // on build l'objet xml (si c'est pas le premier)
            xml = xml + "<Contents>" +
                "<Key>" + items[i].slice(6).replace(/\\/g, "/") + "</Key>" +
                "<Size>" + stats.size + "</Size>" +
                "<ETag>" + hash + "</ETag>" +
                "</Contents>"
        }

    }
    // on get le timestamp final
    let finalTime = Date.now()
        // second log informatif
    console.log("[INFO] ".brightBlue + `Listing of `.yellow + `${files.length}`.rainbow + ` files in `.yellow + (finalTime - initialTime) + "ms for ".yellow + (req.connection.remoteAddress).magenta)

    // debug only
    // console.log("le xml est : "+xml)



    // pour que les navigateur et le launcher voient que c'est du xml
    res.set('Content-Type', 'text/xml');

    // on finalise nos balise et on envoie notre objet xml généré
    res.send('<?xml version="1.0"?>' + "<xml>" + "<ListBucketResult>" + xml + "</ListBucketResult>" + "</xml>")

})


// pour ne pas afficher une page vide moche
app.get('/', function(req, res) {

    res.send(`Trxyy's alternative lib download server by <a href="https://chaun14.fr/">chaun14</a>`)
})

// gestion de l'activation du launcher
app.get('/status.cfg', function(req, res) {
    res.send(launcherStatus)
})



// oui j'ai pris ce port wtf car c'est le tag discord de trxyy 
let port = (process.env.PORT || 2332)
app.listen(port)


// log informatif de démarrage terminé
console.log("[STARTING] App started".brightCyan)
