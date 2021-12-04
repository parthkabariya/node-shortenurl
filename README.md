# Simple URL Shortener Within Your Project
Shortenurl is a simple node js module for shortening your URLs within your project. You will not require any third-party service while using this package. The package creates short URLs and stores them in SQLite3 DB for you. When somebody comes to your website from that shortened URL, they will redirect to the original URL.

## Installation
You can install shortenurl and its dependencies with npm: `npm install shortenurl`

## Usage

#### Require Shrortenur
`const shortenUrl = require('node-shortenurl')`

#### Create a new Shrot URL
```
shortenUrl.create(
    'https://www.mywebsite.com', //base_url of your project or website
    'https://www.google.co.in/search?q=smiling+dog', //URL which you want to be short.
).then((results) => {
    console.log(results) //or res.send(results);
}).catch(err => {
    console.log(err) //or res.send(err);
});
```

#### Get an Original URL
```
shortenUrl.getOriginalUrl(
    `${req.protocol}://${req.headers.host}${req.originalUrl}` //or pass the requested URL
)
.then((result) => {
    res.redirect(result);
}).catch((err) => {
    res.send(err);
})
```

#### Using Middleware
If you are using express.js, you can use the middleware function to check if the URL is shortened or not.

```
const shortenUrlMiddleWare = function (req, res, next) {
    shortenUrl.middleWare(req, res, next);
}
  
app.use(shortenUrlMiddleWare);
```

#### Listing All Short URLs
```
shortenUrl.getAllUrls().then((results) => {
    res.send(results);
}).catch(err => {
    res.send(err);
});
```

### Delete All Short URLs

```
shortenUrl.deleteAllUrls().then((results) => {
    res.send(results);
}).catch(err => {
    res.send(err);
});
```

### Delete a Particular Short URL
```
shortenUrl.deleteByShortUrl('http://www.mywebsite.com/sp/kwj91u1l')
.then((result) => {
    res.send(result);
}).catch(err => {
    res.send(err);
});
```

## Use Cases
- When you are using some third-party service, gives you long authenticated URLs to log in to their service. You want to share such URLs with your customer in SMS but the URL is too long to share, resulting in a bad customer experience. You can short your URL within your project and share that URL with the customer in SMS. EX. Zoom Meeting Host Link or Forget Password Link.
- Email your customer about similar products links from your E-commerce Website where similar products links are too long.
- Even when you want to share some data-related base64 URL like any image, you can share the short URL, which gives a customer a good experience.
