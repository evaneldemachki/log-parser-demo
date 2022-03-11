const index = require('./index');

test('Assure user agent is correctly extracted from raw string', () => {
    expect(
        index.extractUserAgent('24.15.211.147 - - [10/Jun/2015:18:18:33 +0000] "GET /system/uploads/2011/03/Credit-Union-1-300x78.png HTTP/1.1" 301 5 "http://tafema91.soup.io/post/405004826/Creditunion1" "Mozilla/5.0"')
    )
    .toBe('Mozilla/5.0');
});