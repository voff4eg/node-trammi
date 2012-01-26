/*jslint node:true, sloppy:true, nomen: true, unparam:true */

var fs = require('fs'),
    util = require('util'),
    xml2js = require('xml2js');

var lines = {
    "1a": {file: "line_01_0", line: "1", type: "Tram",
        way: "Greco -> P.zza Castelli"},
    "1b": {file: "line_01_1", line: "1", type: "Tram",
        way: "Piazza Castelli -> Greco"},
    "2a": {file: "line_02_0", line: "2", type: "Tram",
        way: "P.le Bausan -> P.le Negrelli"},
    "2b": {file: "line_02_1", line: "2", type: "Tram",
        way: "P.le Negrelli -> P.le Bausan"},
    "3a": {file: "line_03_0", line: "3", type: "Tram",
        way: "Gratosoglio -> Duomo"},
    "3b": {file: "line_03_1", line: "3", type: "Tram",
        way: "Duomo -> Gratosoglio"},
    "4a": {file: "line_04_0", line: "4", type: "Tram",
        way: "Niguarda (Parco Nord) -> Cairoli M1"},
    "4b": {file: "line_04_1", line: "4", type: "Tram",
        way: "Cairoli M1 -> Niguarda (Parco Nord)"},
    "5a": {file: "line_05_0", line: "5", type: "Tram",
        way: "Ortica -> Niguarda (Parco Nord)"},
    "5b": {file: "line_05_1", line: "5", type: "Tram",
        way: "Niguarda (Parco Nord) -> Ortica"},
    "7a": {file: "line_07_0", line: "7", type: "Tram",
        way: "Precotto -> Messina"},
    "7b": {file: "line_07_1", line: "7", type: "Tram",
        way: "Messina -> Precotto"},
    "9a": {file: "line_09_0", line: "9", type: "Tram",
        way: "P.ta Genova FS M2 -> Centrale FS"},
    "9b": {file: "line_09_1", line: "9", type: "Tram",
        way: "Centrale FS -> P.ta Genova FS M2"},
    "12a": {file: "line_12_0", line: "12", type: "Tram",
        way: "Roserio -> V.le Molise"},
    "12b": {file: "line_12_1", line: "12", type: "Tram",
        way: "V.le Molise -> Roserio"},
    "14a": {file: "line_14_0", line: "14", type: "Tram",
        way: "Cimitero Maggiore -> Lorenteggio"},
    "14b": {file: "line_14_1", line: "14", type: "Tram",
        way: "Lorenteggio -> Cimitero Maggiore"},
    "15a": {file: "line_15_0", line: "15", type: "Tram",
        way: "Rozzano via Cabrini -> piazza Fontana"},
    "15b": {file: "line_15_1", line: "15", type: "Tram",
        way: "Piazza Fontana -> Rozzano via Cabrini"},
    "16a": {file: "line_16_0", line: "16", type: "Tram",
        way: "Monte Velino -> San Siro"},
    "16b": {file: "line_16_1", line: "16", type: "Tram",
        way: "San Siro -> Monte Velino"},
    "19a": {file: "line_19_0", line: "19", type: "Tram",
        way: "P.ta Genova -> Roserio"},
    "19b": {file: "line_19_1", line: "19", type: "Tram",
        way: "Roserio -> P.ta Genova"},
    "23a": {file: "line_23_0", line: "23", type: "Tram",
        way: "Lambrate FS M2 -> Piazza Fontana"},
    "23b": {file: "line_23_1", line: "23", type: "Tram",
        way: "Piazza Fontana -> Lambrate FS M2"},
    "24a": {file: "line_24_0", line: "24", type: "Tram",
        way: "Vigentino -> Duomo"},
    "24b": {file: "line_24_1", line: "24", type: "Tram",
        way: "Duomo -> Vigentino"},
    "27a": {file: "line_27_0", line: "27", type: "Tram",
        way: "P.za 6 Febbraio -> V.le Ungheria"},
    "27b": {file: "line_27_1", line: "27", type: "Tram",
        way: "V.le Ungheria -> P.za 6 Febbraio"},
    "31a": {file: "line_31_0", line: "31", type: "Tram",
        way: "Cinisello B. -> P.le Lagosta"},
    "31b": {file: "line_31_1", line: "31", type: "Tram",
        way: "P.le Lagosta -> Cinisello B."},
    "33a": {file: "line_33_0", line: "33", type: "Tram",
        way: "Rim.Lambrate -> Lunigiana"},
    "33b": {file: "line_33_1", line: "33", type: "Tram",
        way: "Lunigiana -> Rim.Lambrate"}

},
    stops = [];

var line, counter = 0, parser = new xml2js.Parser();

function afterLoading() {
    var fileLines = __dirname + '/trammiDBLines.js',
        fileStops = __dirname + '/trammiDBStops.js';

    fs.writeFile(fileLines, 'exports.lines = ' +
        util.inspect(lines, false, null), function (err) {
            if (err) {
                throw err;
            }
        });
    fs.writeFile(fileStops, 'exports.stops = ' +
        util.inspect(stops, false, null), function (err) {
            if (err) {
                throw err;
            }
        });
}

function readFile(l) {
    var filename = __dirname + '/db/' + lines[l].file + '.xml';

    fs.readFile(filename, function (err, data) {
        parser.parseString(data, function (err, result) {
            var ss, n, i, s;

            lines[l].info = result;
            ss = lines[l].info.stop;
            n = ss.length;

            for (i = 0; i < n; i += 1) {
                s = ss[i]["@"];
                stops.push({
                    acdescr: lines[l].type + ' ' + lines[l].line + ': ' +
                        lines[l].way + ' @ ' + s.sdescr,
                    sdescr: s.sdescr,
                    scode: s.scode,
                    snum: i + 1,
                    sline: l,
                    lcode: lines[l].line,
                    ltype: lines[l].type,
                    lway: lines[l].way
                });
            }

            counter -= 1;

            if (counter === 0) {
                afterLoading();
            }
        });
    });
}

for (line in lines) {
    if (lines.hasOwnProperty(line)) {
        counter += 1;
        readFile(line);
    }
}

exports.lines = lines;
exports.stops = stops;


