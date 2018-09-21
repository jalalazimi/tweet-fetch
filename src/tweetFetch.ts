const OAuth = require('oauth-request')
const crypto = require('crypto')

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

export default class TweetFetch {
  twitter: any

  constructor(TOKEN: any) {
    const {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret
    } = TOKEN

    this.twitter = OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function: function(baseString: string, key: string) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64')
      }
    })

    this.twitter.setToken({
      key: accessTokenKey,
      secret: accessTokenSecret
    })
  }

  isValidTwitterUrl(url: string): boolean {
    return /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/.test(url)
  }

  extractingTweetIdFromURL(url: string): string {
    if (!this.isValidTwitterUrl(url)) {
      throw new Error('not valid')
    }
    const arr = url.split('/')
    return arr[arr.length - 1]
  }

  removeUserDataFromTweet(t: string): string {
    return t.substr(0, t.lastIndexOf('—'))
  }

  getOembed(url: string) {
    const options = {
      url: 'https://publish.twitter.com/oembed',
      qs: { url: url },
      json: true
    }
    return new Promise((resolve, reject) => {
      this.twitter.get(options, async (err: object, response: object, tweets: object) => {
        if (err) return reject(err)
        resolve(tweets)
      })
    })
  }

  async tweetData(url: string) {
    const options = {
      url: 'https://api.twitter.com/1.1/statuses/show.json',
      qs: { id: this.extractingTweetIdFromURL(url) },
      json: true
    }
    return new Promise((resolve, reject) => {
      this.twitter.get(options, async (err: object, response: object, tweets: object) => {
        if (err) return reject(err)
        resolve(tweets)
      })
    })
  }
}
