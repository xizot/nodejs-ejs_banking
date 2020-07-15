var Crawler = require("crawler");
const ExchangeRate = require("./services/exchangeRate");

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: async function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            const rate = $(".text-success")['0'].children[0].data;
            if (rate) {
                const found = await ExchangeRate.findOne({
                    where: {
                        displayName: 'USD'
                    }
                })
                found.rate = rate;
                found.save();


                const foundVND = await ExchangeRate.findOne({
                    where: {
                        displayName: 'VND'
                    }
                })

                if (foundVND) {

                    foundVND.rate = 1 / rate;
                    foundVND.save();
                }
                else {
                    ExchangeRate.create({
                        rate: 1 / rate,
                        displayName: 'VND'
                    })

                }
            }
            else {
                ExchangeRate.create({
                    rate,
                    displayName: 'USD'
                })

                const foundVND = await ExchangeRate.findOne({
                    where: {
                        displayName: 'VND'
                    }
                })

                if (foundVND) {

                    foundVND.rate = 1 / rate;
                    foundVND.save();
                }
                else {
                    ExchangeRate.create({
                        rate: 1 / rate,
                        displayName: 'VND'
                    })

                }

            }

        }
        done();
    }
});

setInterval(() => {
    c.queue('https://transferwise.com/gb/currency-converter/usd-to-vnd-rate');

}, 60 * 60 * 6 * 1000)