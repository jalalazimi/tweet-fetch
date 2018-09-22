import TweetFetch from '../src/tweetFetch'

describe('test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('should exports a class', function() {
    expect(typeof TweetFetch).toBe('function')
  })

  it('throws when config is missing a required key', function() {
    expect(() => {
      new TweetFetch({})
    }).toThrow()
  })
})
