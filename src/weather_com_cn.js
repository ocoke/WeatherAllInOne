const puppeteer = require('puppeteer');
const getWeatherComCN = async () => {
    var data = {};
    const url = "http://www.weather.com.cn/weather1d/101280101.shtml";
    var browser = await puppeteer.launch({
        'headless': true,
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
    await page.waitForSelector(".sk > .tem > span");
    // 现在温度
    var tempNow = await page.$eval(".sk > .tem > span", el => {
        return el.innerText;
    });
    // 日夜气温
    var tempDayNight = await page.$$eval("li > .tem > span", el => {
        return {
            day: el[0].innerText,
            night: el[1].innerText,
        };
    });
    // 当前天气
    var weatherNow = await page.$eval(".wea", el => {
        return el.innerText;
    });
    // 当前风向/风力
    var wind = await page.$eval(".zs.w", el => {
        return el.innerText.split("\n");
    });
    // 当前空气质量
    var aq = await page.$eval(".zs.pol > span", el => {
        return [el.innerText.match(/(\d{1,3})+(?:\.\d+)?/g)[0]];
    });
    // 当前湿度
    var humidity = await page.$eval(".zs.h > em", el => {
        return el.innerText;
    });
    // 日出日落
    var sunset = await page.$eval(".sunDown > span", el => {
        return el.innerText.split("日落 ")[1];
    });
    var sunrise = await page.$eval(".sunUp > span", el => {
        return el.innerText.split("日出 ")[1];
    });
    data.temp = {
        now: tempNow,
        day: tempDayNight.day,
        night: tempDayNight.night,
    }
    data.weather = weatherNow;
    data.wind = wind;
    data.aq = aq;
    data.humidity = humidity;
    data.sun = {
        sunrise,
        sunset,
    }
    data.source = "中国天气网";
    await browser.close();
    return data;
};

const getWeatherComCN7days = async () => {
    
}
(async() => {
    console.log("__Start;");
    var d1=new Date().getTime();
    console.log(await getWeatherComCN());
    console.log("__End; Total: "+String(new Date().getTime()-d1));
})();