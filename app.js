const express = require('express');
const shortenUrl = require('./index');
const app = express();
const port = 8000;

// app.get('/sp/*', (req, res) => {
//     shortenUrl.getOriginal('http://localhost:8000/sp/'+req.params[0])
//     .then((result) => {
//         res.redirect(result);
//     }).catch((err) => {
//         res.send(err);
//     })
// });
// Or Use Middleware

const shortenUrlMiddleWare = function(req, res, next) {
  shortenUrl.middleWare(req, res, next);
};

app.use(shortenUrlMiddleWare);

app.get('/', (req, res) => {
  shortenUrl.getAllUrls().then((results) => {
    res.send(results);
  }).catch((err) => {
    res.send(err);
  });
});
app.get('/create', (req, res) => {
  // request: base url of your project.
  shortenUrl.create(
      'http://localhost:8000/', // base_url of your project or website
      'https://www.google.co.in/search?q=smiling+dog', // URl which you want to be short.
  ).then((results) => {
    console.log(results); // or res.send(results);
  }).catch((err) => {
    console.log(err); // or res.send(err);
    // res.send(err);
  });
});

app.get('/delete', (req, res) => {
  shortenUrl.deleteAllUrls('http://localhost:8000/sp/kwj91u1l').then((results) => {
    res.send(results);
  }).catch((err) => {
    res.send(err);
  });
});

app.get('/deleteByShortUrl', (req, res) => {
  shortenUrl.deleteByShortUrl('http://localhost:8000/sp/kwj91u1l').then((results) => {
    res.send(results);
  }).catch((err) => {
    res.send(err);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
