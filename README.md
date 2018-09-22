# Tweet-Fetch 
[![GitHub license](https://img.shields.io/github/license/jalalazimi/tweet-fetch.svg)](https://github.com/jalalazimi/tweet-fetch/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.com/jalalazimi/tweet-fetch.svg?branch=master)](https://travis-ci.com/jalalazimi/tweet-fetch) 
[![Coveralls github](https://img.shields.io/coveralls/github/jekyll/jekyll.svg)](https://github.com/jalalazimi/tweet-fetch)


Get Tweet data by URL and ID from Twitter in NodeJS with using the twitter token.

```javascript

const TweetFetch = require("tweet-fetch")

const tweetFetch = new TweetFetch({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
})

tweetFetch.get('TWEET_URL')
  .then(res => {
    console.log(res)
  })

```

## Installation

```bash
npm install tweet-fetch
```
or
```bash
yan add tweet-fetch
```

## Quick Start
You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys.  You can get these [here](https://apps.twitter.com/).


```javascript
const TweetFetch = require('tweet-fetch');
```

## For User based authentication:

```javascript
const tweetFetch = new TweetFetch({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
```
Add your credentials accordingly.  I would use environment variables to keep your private info safe.  So something like:

```javascript
const tweetFetch = new TweetFetch({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
```

## Usage

### Get tweet 
Returns Tweet full text with data

```javascript
tweetFetch.get('TWEET_URL')
  .then(res => {
    console.log(res)
  })
```

### Get embedded tweet
Returns a single Tweet, specified by either a Tweet web URL or the Tweet ID, in an oEmbed-compatible format. 

```javascript
tweetFetch.getOembed('TWEET_URL')
  .then(res => {
  console.log(res)
  })
```

### Get tweet data
Return Tweet JSON. Each Tweet has an author, a message, a unique ID, a timestamp of when it was posted, and sometimes geo metadata shared by the user. Each User has a Twitter name, an ID, a number of followers, and most often an account bio.With each Tweet we also generate "entity" objects, which are arrays of common Tweet contents such as hashtags, mentions, media, and links. If there are links, the JSON payload can also provide metadata such as the fully unwound URL and the webpage’s title and description.
 
```javascript
tweetFetch.getData('TWEET_URL')
  .then(res => {
    console.log(res)
  })
```


