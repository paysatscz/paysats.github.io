var pay_server    = "https://pay.sats.cz/satspay/api/v1/charge"
var czk_api       = "https://api.coindesk.com/v1/bpi/currentprice/CZK.json"

var onchainwallet = "J847B58HsKWvVBSLHbwDrw"
var description   = "Firma a.b.c."
var webhook       = "false"
var time          = 60
var lnbitswallet  = "582a09484c874f67b3c6dc28907b61e3"
var xapikey       = "91c2958299dc4ff787ec9c63f7eae6f5"

function CallSatsPay(){
  amount = document.getElementById("satspaynumberczk").value
  var btcrateurl = czk_api
  var response = $.getJSON( btcrateurl , function() {
    var czk = response.responseJSON.bpi.CZK.rate_float
    amount = (amount * 100000000 / czk)
    amount = round(amount, 0)
    let JsonStringWithAmount = '{' + 
    '"onchainwallet":' + '"' + onchainwallet + '"' + 
    ', "amount":' + amount + 
    ', "description":' + '"' + description + '"' +
    ', "webook":' + '"' + webhook + '"' +
    ', "time":' + time  +
    ', "lnbitswallet":' + '"' + lnbitswallet + '"' +
    '}';

    var xhr = new XMLHttpRequest();
    var url = pay_server;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Api-Key", xapikey);
    xhr.onreadystatechange = function (invoice) {
      if (xhr.readyState === 4 && xhr.status === 201) {
        var jsonobject = JSON.parse(xhr.responseText)
        var invoice = jsonobject.payment_request
        var btcaddress = jsonobject.onchainaddress
        $("#lnqrlabel").show();
        $("#btcqrlabel").show();
        var QrLn = GenQrCodeFromData(invoice, 256, 3)
        var QrBc = GenQrCodeFromData(btcaddress, 256, 3)
        $("#lnqrcontent").html(QrLn);
        $("#btcqrcontent").html(QrBc);

      }
    };
    const data = JSON.stringify(JSON.parse(JsonStringWithAmount));
    xhr.send(data);
  })
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function GenQrCodeFromData (data, size, padding){
  var QR = QRCode({

    msg :  data
    ,dim :  size
    ,pad :  padding
    ,mtx :  -1
    ,ecl :  "L"
    ,ecb :   0
    ,pal : ["#000000", "#f2f4f8"]
    ,vrb :   1

  });
  return QR
}
