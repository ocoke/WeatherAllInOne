// Weather.com is unavaliable now.
const puppeteer = require('puppeteer');
const getWeatherComCN = async () => {
    var data = {};
    const url = "https://weather.com/zh-CN/weather/today/l/CHXX0037:1:CH";
    var browser = await puppeteer.launch({
        'headless': false,
    });
    let page = await browser.newPage();
    const UA = [

    ];
    await Promise.all([
        // page.setUserAgent(UA[0]),
        page.setJavaScriptEnabled(true),
        page.setViewport({ width: 1920, height: 1080 }),
    ]);
    await page.goto(url);
    await page.waitForSelector(".CurrentConditions--primary--2SVPh > span");
    var tempNow = await page.$eval(".CurrentConditions--primary--2SVPh > span", el => {
        return el.innerText;
    });
    var tempDayNight = await page.$eval(".CurrentConditions--tempHiLoValue--3SUHy", el => {
        return el.innerText;
    });
    var weatherNow = await page.$eval(".CurrentConditions--phraseValue--2Z18W", el => {
        return el.innerText;
    });
    // var wind = await page.$eval(".zs.w", el => {
    //     return el.innerText.split("\n");
    // });
    // var aq = await page.$eval(".zs.pol > span", el => {
    //     return [el.innerText.match(/(\d{1,3})+(?:\.\d+)?/g)[0]];
    // });
    // var humidity = await page.$eval(".zs.h > em", el => {
    //     return el.innerText;
    // });
    data.temp = {
        now: tempNow,
        day: tempDayNight
    }
    data.weather = weatherNow;
    // data.wind = wind;
    // data.aq = aq;
    // data.humidity = humidity;
    await browser.close();
    return data;
};

(async() => {
    console.log(await getWeatherComCN());
})();