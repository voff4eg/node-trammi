/*jslint node:true, sloppy:true, nomen: true, unparam:true */

var fs = require('fs'),
    util = require('util'),
    xml2js = require('xml2js');

var lines = {
    "1a": {file: "line_01_0", line: "1",
        descr: "Tram 1 - Greco -> P.zza Castelli"},
    "1b": {file: "line_01_1", line: "1",
        descr: "Tram 1 - Piazza Castelli -> Greco"},
    "2a": {file: "line_02_0", line: "2",
        descr: "Tram 2 P.le Bausan -> P.le Negrelli"},
    "2b": {file: "line_02_1", line: "2",
        descr: "Tram 2 P.le Negrelli -> P.le Bausan"},
    "3a": {file: "line_03_0", line: "3",
        descr: "Tram 3 Gratosoglio -> Duomo"},
    "3b": {file: "line_03_1", line: "3",
        descr: "Tram 3 Duomo -> Gratosoglio"},
    "4a": {file: "line_04_0", line: "4",
        descr: "Tram 4 Niguarda (Parco Nord) -> Cairoli M1"},
    "4b": {file: "line_04_1", line: "4",
        descr: "Tram 4 Cairoli M1 -> Niguarda (Parco Nord)"},
    "5a": {file: "line_05_0", line: "5",
        descr: "Tram 5 Ortica -> Niguarda (Parco Nord)"},
    "5b": {file: "line_05_1", line: "5",
        descr: "Tram 5 Niguarda (Parco Nord) -> Ortica"},
    "7a": {file: "line_07_0", line: "7",
        descr: "Tram 7 Precotto -> Messina"},
    "7b": {file: "line_07_1", line: "7",
        descr: "Tram 7 Messina -> Precotto"},
    "9a": {file: "line_09_0", line: "9",
        descr: "Tram 9 P.ta Genova FS M2 -> Centrale FS"},
    "9b": {file: "line_09_1", line: "9",
        descr: "Tram 9 Centrale FS -> P.ta Genova FS M2"},
    "12a": {file: "line_12_0", line: "12",
        descr: "Tram 12 Roserio -> V.le Molise"},
    "12b": {file: "line_12_1", line: "12",
        descr: "Tram 12 V.le Molise -> Roserio"},
    "14a": {file: "line_14_0", line: "14",
        descr: "Tram 14 Cimitero Maggiore -> Lorenteggio"},
    "14b": {file: "line_14_1", line: "14",
        descr: "Tram 14 Lorenteggio -> Cimitero Maggiore"},
    "15a": {file: "line_15_0", line: "15",
        descr: "Tram 15 Rozzano via Cabrini -> piazza Fontana"},
    "15b": {file: "line_15_1", line: "15",
        descr: "Tram 15 Piazza Fontana -> Rozzano via Cabrini"},
    "16a": {file: "line_16_0", line: "16",
        descr: "Tram 16 Monte Velino -> San Siro"},
    "16b": {file: "line_16_1", line: "16",
        descr: "Tram 16 San Siro -> Monte Velino"},
    "19a": {file: "line_19_0", line: "19",
        descr: "Tram 19 P.ta Genova -> Roserio"},
    "19b": {file: "line_19_1", line: "19",
        descr: "Tram 19 Roserio -> P.ta Genova"},
    "23a": {file: "line_23_0", line: "23",
        descr: "Tram 23 Lambrate FS M2 -> Piazza Fontana"},
    "23b": {file: "line_23_1", line: "23",
        descr: "Tram 23 Piazza Fontana -> Lambrate FS M2"},
    "24a": {file: "line_24_0", line: "24",
        descr: "Tram 24 Vigentino -> Duomo"},
    "24b": {file: "line_24_1", line: "24",
        descr: "Tram 24 Duomo -> Vigentino"},
    "27a": {file: "line_27_0", line: "27",
        descr: "Tram 27 P.za 6 Febbraio -> V.le Ungheria"},
    "27b": {file: "line_27_1", line: "27",
        descr: "Tram 27 V.le Ungheria -> P.za 6 Febbraio"},
    "31a": {file: "line_31_0", line: "31",
        descr: "Tram 31 Cinisello B. -> P.le Lagosta"},
    "31b": {file: "line_31_1", line: "31",
        descr: "Tram 31 P.le Lagosta -> Cinisello B."},
    "33a": {file: "line_33_0", line: "33",
        descr: "Tram 33 Rim.Lambrate -> Lunigiana"},
    "33b": {file: "line_33_1", line: "33",
        descr: "Tram 33 Lunigiana -> Rim.Lambrate"}

},
    stops = [];

var line, parser = new xml2js.Parser();

function readFile(l) {
    var data = fs.readFileSync(__dirname + '/db/' + lines[l].file + '.xml');
    parser.parseString(data, function (err, result) {
        lines[l].info = result;
        // console.log(util.inspect(lines[l], false, null));
    });
}

function addingStops(l) {
    var ss = lines[l].info.stop, n = ss.length, i, s;

    for (i = 0; i < n; i += 1) {
        s = ss[i]["@"];
        stops.push({
            sdescr: lines[l].descr + " @ " + s.sdescr,
            scode: s.scode,
            snum: i + 1,
            sline: l,
            lcode: lines[l].line
        });
    }
}

for (line in lines) {
    if (lines.hasOwnProperty(line)) {
        readFile(line);
        addingStops(line);
    }
}

exports.lines = lines;
exports.stops = stops;


