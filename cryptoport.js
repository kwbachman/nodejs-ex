//  Based on OpenShift sample Node application
var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

var express = require('express'),
    app     = express();

app.set('view engine', 'ejs');    
//app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var btc = 0;
var eth = 0;
var iot = 0;
var btcshare = .028644;
var ethshare = .25;
var iotshare = 100;
var btcval = 0;
var ethval = 0;
var iotval = 0;
var total = 0;

app.get('/', function (req, res) {

  console.log(`${req.method} request for '${req.url}'`);

  // If you want to check multiple coins, use multi():
  coinmarketcap.multi(coins => {
    console.log(coins.get("BTC").price_usd); // Prints price of BTC in USD
    console.log(coins.get("ETH").price_usd); // Print price of ETH in USD
    console.log(coins.get("MIOTA").price_usd); // Print price of IOTA in USD
    btc = coins.get("BTC").price_usd;
    eth = coins.get("ETH").price_usd;
    iot = coins.get("MIOTA").price_usd
  });

  // Calculate values
  btcval = (btc*btcshare).toFixed(2);
  ethval = (eth*ethshare).toFixed(2);
  iotval = (iot*iotshare).toFixed(2);
  total = (Number(btcval)+Number(ethval)+Number(iotval)).toFixed(2);

  // res.render('index.ejs', {BTC: btc, ETH: eth, IOT: iot, 
  //                          BTCSHR: btcshare, ETHSHR: ethshare, IOTSHR: iotshare,
  //                          BTCVAL: btcval, ETHVAL: ethval, IOTVAL: iotval,
  //                          TOTAL: total});

  res.render('test');
  //res.render('Hello World');

});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
