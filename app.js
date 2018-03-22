// Coinbase
var Client = require('coinbase').Client;
var client = new Client({'apiKey': 'API KEY',
                         'apiSecret': 'API SECRET'});
//Coinmarketcap
var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

var express = require("express");
var app = express();

// variables
var btc = 0;
var eth = 0;
var iot = 0;

var btcshare = .028644;
var ethshare = .25;
var iotshare = 100; 

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("./public"));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address);
console.log( "Listening on " + server_ip_address + ", port " + server_port )

// server.listen(server_port, server_ip_address, function () {
//   console.log( "Listening on " + server_ip_address + ", port " + server_port )
// });

app.get("/", function(req, res) {

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
  var btcval = (btc*btcshare).toFixed(2);
  var ethval = (eth*ethshare).toFixed(2);
  var iotval = (iot*iotshare).toFixed(2);
  var total = (Number(btcval)+Number(ethval)+Number(iotval)).toFixed(2);
  
  res.render('index', {BTC: btc, ETH: eth, IOT: iot, 
                       BTCSHR: btcshare, ETHSHR: ethshare, IOTSHR: iotshare,
                       BTCVAL: btcval, ETHVAL: ethval, IOTVAL: iotval,
                       TOTAL: total});
});



