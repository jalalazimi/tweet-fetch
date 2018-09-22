"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var OAuth = require('oauth-request');
var crypto = require('crypto');
var Joi = require('joi');
var stripHtml = require('string-strip-html');
// app.get('/', (req, res): void => {
//   const {url} = req.query;
//   Promise
//     .all([tweetData(url), getOembed(url)])
//     .then((tweet: any) => {
//       res.json(Object.assign(tweet[0], {full_text: removeUserDataFromTweet(stripHtml(tweet[1].html))}));
//     })
//     .catch(err => {
//       throw new Error(err);
//     });
// });
//
// export default app;
var TokenSchema = Joi.object().keys({
    consumer_key: Joi.string().required(),
    consumer_secret: Joi.string().required(),
    access_token_key: Joi.string().required(),
    access_token_secret: Joi.string().required()
});
var TweetFetch = /** @class */ (function () {
    function TweetFetch(TOKEN) {
        Joi.validate(TOKEN, TokenSchema, function (err) {
            if (err)
                throw 'Error: Token is not valid! It should contains consumer_key,consumer_secret,access_token_key and access_token_secret';
        });
        var consumerKey = TOKEN.consumer_key, consumerSecret = TOKEN.consumer_secret, accessTokenKey = TOKEN.access_token_key, accessTokenSecret = TOKEN.access_token_secret;
        this.twitter = OAuth({
            consumer: {
                key: consumerKey,
                secret: consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: function (baseString, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(baseString)
                    .digest('base64');
            }
        });
        this.twitter.setToken({
            key: accessTokenKey,
            secret: accessTokenSecret
        });
    }
    TweetFetch.prototype.isValidTwitterUrl = function (url) {
        return /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/.test(url);
    };
    TweetFetch.prototype.extractingTweetIdFromURL = function (url) {
        if (!this.isValidTwitterUrl(url)) {
            throw new Error('not valid');
        }
        var arr = url.split('/');
        return arr[arr.length - 1];
    };
    TweetFetch.prototype.removeUserDataFromTweet = function (t) {
        return t.substr(0, t.lastIndexOf('—'));
    };
    TweetFetch.prototype.getOembed = function (url) {
        var _this = this;
        var options = {
            url: 'https://publish.twitter.com/oembed',
            qs: { url: url },
            json: true
        };
        return new Promise(function (resolve, reject) {
            _this.twitter.get(options, function (err, response, tweets) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, reject(err)];
                    resolve(tweets);
                    return [2 /*return*/];
                });
            }); });
        });
    };
    TweetFetch.prototype.getData = function (url) {
        var _this = this;
        var options = {
            url: 'https://api.twitter.com/1.1/statuses/show.json',
            qs: { id: this.extractingTweetIdFromURL(url) },
            json: true
        };
        return new Promise(function (resolve, reject) {
            _this.twitter.get(options, function (err, response, tweets) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, reject(err)];
                    resolve(tweets);
                    return [2 /*return*/];
                });
            }); });
        });
    };
    TweetFetch.prototype.get = function (url) {
        var _this = this;
        return Promise.all([this.getData(url), this.getOembed(url)])
            .then(function (tweet) {
            return Object.assign(tweet[0], {
                full_text: _this.removeUserDataFromTweet(stripHtml(tweet[1].html))
            });
        })["catch"](function (err) {
            throw new Error(err);
        });
    };
    return TweetFetch;
}());
exports["default"] = TweetFetch;
