import TweetFetch from '../src/tweetFetch'


const tweetFetch = new TweetFetch({
  consumer_key: 'uloHq83EUIjx32TSnqJUTWTXt',
  consumer_secret: 'FODNE2TyueQEDuwhPRUmbWyniKQgtCQKbbsjEddtLFMACRbFoM',
  access_token_key: '16341288-Z9c468O0OC3881egpFRN0i3yxDDakfCVTZ2UCLOWb',
  access_token_secret: 'wOuH1AKqiTazMLehaNvkLhZ8QHFmx755mKZXa69KhWE23'
})

tweetFetch.getOembed('https://twitter.com/farnazhoseini/status/1043388209206648832')
  .then(res => {
  console.log(res)
})

tweetFetch.getData('https://twitter.com/farnazhoseini/status/1043388209206648832')
  .then(res => {
    console.log(res)
  })


tweetFetch.get('https://twitter.com/farnazhoseini/status/1043388209206648832')
  .then(res => {
    console.log(res)
  })
