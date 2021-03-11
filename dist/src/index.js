"use strict";

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

var _fs = require("fs");

var _fluture = require("fluture");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");

// encasing an axios propmise
var fetchAxios = (0, _fluture.encaseP)(_axios2.default);
// request post with curried function
var requestPosts = function requestPosts() {
    return fetchAxios("https://www.imdb.com/?ref_=nv_home");
};
// getting file content and pipe it to parse it
var getFileContent = function getFileContent(file) {
    return (0, _fluture.node)(function (done) {
        (0, _fs.readFile)(file, "utf8", done);
    }).pipe((0, _fluture.chain)((0, _fluture.encase)(JSON.parse)));
};

// getting values from DOM elements with help of cheerio
var getValuesFromCheerio = function getValuesFromCheerio(html) {
    var imdb = [];
    var $ = _cheerio2.default.load(html);
    var title = $('a[class="ipc-poster-card__title ipc-poster-card__title--clamp-2 ipc-poster-card__title--clickable"]').text().trim();
    var trailer = $('div[class="SlideCaptionWithPeekstyle__WithPeekCaptionSubHeading-sc-1v8fw6-2 kMejoQ"]').text().trim();
    var rating = $('div[class="ipc-poster-card__rating-star-group"]').text().slice(0, 3);
    imdb.push({
        title: title,
        rating: rating,
        trailer: trailer
    });
    var disc = JSON.stringify(imdb);
    fs.writeFile("output.json", disc, function (err, result) {
        if (err) console.log("error", err);
    });
};

// get IMDB data with help of request and passing it to cheerio
var getImdbData = function getImdbData() {
    var get = {
        uri: "https://www.imdb.com/?ref_=nv_home",
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"
        },
        gzip: true
    };
    (0, _request2.default)(get, function (error, res, html) {
        if (error) {
            console.log(error);
        } else {
            getValuesFromCheerio(html);
        }
    });
};

requestPosts().pipe((0, _fluture.fork)(function (rej) {
    return console.log("reject", rej);
})(function (res) {
    return console.log("resolve", getImdbData());
}));

getFileContent("output.json").pipe((0, _fluture.fork)(console.error)(console.log));