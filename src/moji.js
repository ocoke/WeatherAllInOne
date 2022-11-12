// https://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=%E5%B9%BF%E5%B7%9E&needMoreData=true&pageNo=1&pageSize=7

const fetch = require("node-fetch");

const getMojiToday = async (city) => {
    var wdata = await fetch(`https://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=${city}&needMoreData=true&pageNo=1&pageSize=1`).then(res => res.json());
    wdata = wdata.data.list[0];
    var data = {};
    try {
        var wind = wdata["wind"].split("风");
        wind[0] += "风";
        data = {
            weather: wdata.weather,
            temp: {
                now: wdata.temp ? String(wdata.temp) : null,
                day: String(wdata.high),
                night: String(wdata.low),
            },
            wind,
            aq: [wdata.airData, wdata.airQuality],
            humidity: wdata.humidity,
            sun: {
                sunrise: wdata.moreData.sunrise.split(wdata.date+" ")[1].split(":00")[0],
                sunset: wdata.moreData.sunset.split(wdata.date+" ")[1].split(":00")[0],
            }
        };
    } catch (e) {}
    return data;
}
const getMoji7days = async (city) => {
    var wdata = await fetch(`https://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=${city}&needMoreData=true&pageNo=1&pageSize=7`).then(res => res.json());
    var w_data = wdata.data.list;
    var data = [];
    try {
        for(i in w_data) {
            wdata = w_data[i];
            var wind = wdata["wind"].split("风");
            wind[0] += "风";
            day = {
                date: wdata.date,
                weather: wdata.weather,
                temp: {
                    now: wdata.temp ? String(wdata.temp) : null,
                    day: String(wdata.high),
                    night: String(wdata.low),
                },
                wind,
                aq: [wdata.airData, wdata.airQuality],
                humidity: wdata.humidity,
                sun: {
                    sunrise: wdata.moreData.sunrise.split(wdata.date+" ")[1].split(":00")[0],
                    sunset: wdata.moreData.sunset.split(wdata.date+" ")[1].split(":00")[0],
                }
            };
            data.push(day)
        }
    } catch (e) {
        
    }
    return data;
}

module.exports.getMojiToday = async (city) => {
    return await getMojiToday(city);
};
module.exports.getMoji7days = async (city) => {
    return await getMoji7days(city);
};