import TweetFetch from '../src/tweetFetch'

describe('test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('should exports a class', function() {
    expect(typeof TweetFetch).toBe('function')
  })
})
