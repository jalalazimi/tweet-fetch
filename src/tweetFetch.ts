const OAuth = require('oauth-request')
const crypto = require('crypto')
const Joi = require('joi')
const stripHtml = require('string-strip-html')

const TokenSchema = Joi.object().keys({
  consumer_key: Joi.string().required(),
  consumer_secret: Joi.string().required(),
  access_token_key: Joi.string().required(),
  access_token_secret: Joi.string().required()
})

export default class TweetFetch {
  twitter: any

  constructor(TOKEN: any) {
    Joi.validate(TOKEN, TokenSchema, (err: any) => {
      if (err)
        throw 'Error: Token is not valid! It should contains consumer_key,consumer_secret,access_token_key and access_token_secret'
    })

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

  /**
   * Check twitter URL validation
   * @param {string} url
   * @returns {boolean}
   */
  private isValidTwitterUrl(url: string): boolean {
    return /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/.test(url)
  }

  /**
   * Extract tweet id from URL
   * @param {string} url
   * @returns {string}
   */
  private extractingTweetIdFromURL(url: string): string {
    if (!this.isValidTwitterUrl(url)) {
      throw new Error('not valid')
    }
    const arr = url.split('/')
    return arr[arr.length - 1]
  }

  /**
   * Remove user data from tweet text
   * @param {string} tweet
   * @returns {string}
   */
  private removeUserDataFromTweet(tweet: string): string {
    return tweet.substr(0, tweet.lastIndexOf('—'))
  }

  /**
   * Returns a single Tweet, specified by either a Tweet web URL or the Tweet ID, in an oEmbed-compatible format.
   * @param {string} url
   * @returns {Promise<object>}
   */
  getOembed(url: string): Promise<object> {
    const options = {
      url: 'https://publish.twitter.com/oembed',
      qs: { url: url },
      json: true
    }
    return new Promise<object>((resolve: any, reject: any) => {
      this.twitter.get(options, async (err: any, response: object, tweets: any) => {
        if (err) return reject(err)
        resolve(tweets)
      })
    })
  }

  /**
   * Return Tweet JSON
   * @param {string} req
   * @returns {Promise<object>}
   */
  getData(req: string): Promise<object> {
    const id = this.isValidTwitterUrl(req) ? this.extractingTweetIdFromURL(req) : req
    const options = {
      url: 'https://api.twitter.com/1.1/statuses/show.json',
      qs: { id },
      json: true
    }
    return new Promise<object>((resolve, reject) => {
      this.twitter.get(options, async (err: any, response: object, tweets: any) => {
        if (err) return reject(err)
        resolve(tweets)
      })
    })
  }

  /**
   * Returns Tweet full text with data
   * @param {string} req
   * @returns {Promise<object>}
   */
  get(req: string): Promise<object> {
    return Promise.all([this.getData(req), this.getOembed(req)])
      .then((tweet: any) => {
        return Object.assign(tweet[0], {
          full_text: this.removeUserDataFromTweet(stripHtml(tweet[1].html))
        })
      })
      .catch(err => {
        throw new Error(err)
      })
  }
}
