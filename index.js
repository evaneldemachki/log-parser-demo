const fs = require('fs');
const readline = require('readline');
const Reader = require('@maxmind/geoip2-node').Reader;
const Writer = require('csv-writer').createArrayCsvWriter;
const parser = require('ua-parser-js');
const path = require('path');

const dbBuffer = fs.readFileSync('city.mmdb');

const reader = Reader.openBuffer(dbBuffer);

const readInterface = readline.createInterface({
    input: fs.createReadStream('input.log'),
    output: false,
    console: false
});

const writer = Writer({
    path: 'output.csv',
    header: ['source', 'country', 'state', 'device', 'browser']
});

function extractUserAgent(rawRequest) {
    let uastring = rawRequest.split('"');
    uastring = uastring[uastring.length - 2];

    let ua = parser(uastring);

    return ua;
}

let data = [];

readInterface.on('line', function(line) {
    let row = line.split(' - - ');

    let IP = row[0];
    let response = reader.city(IP);

    let country = null;
    if (response.country) {
        country = response.country.isoCode;
    }

    let state = null;
    if (response.subdivisions) {
        state = response.subdivisions[0].names.en;
    }

    let ua = extractUserAgent(line);

    let device = null;
    if (ua.device.type) {
        device = ua.device.type;
    }

    let browser = null;
    if (ua.browser.name) {
        browser = ua.browser.name;
    }

    data.push([
        line,
        country,
        state,
        device,
        browser
    ])
});

readInterface.on('close', function(line) {
    writer.writeRecords(data)
    .then(()=> {
        console.log('Access logs parsed successfully')
    });
})

exports.extractUserAgent = extractUserAgent;