const yaml = require("js-yaml");
const fs = require("fs");
const CONFIG = yaml.load(fs.readFileSync("./_config.yml"));
const http = require("http");
const {getMojiToday, getMoji7days} = require("./src/moji");
const { getWeatherComCN, getWeatherComCN7days } = require("./src/weather_com_cn");
const METHODS = {
    moji: {
        
    }
};
const serve = async (req, res) => {
    function returnRes(code, text, http_code) {
        res.writeHead(http_code || 200,{'Content-type':'application/json'});
        res.end(JSON.stringify({code,data: text}));
    }
    function param(path) {
        try {
            var param = req.url.split(path+"?");
            param = param[1].split("&");
            var list = {};
            for (i in param) {
                list[param[i].split("=")[0]] = param[i].split("=")[1];
            }
            return list;
        } catch (e) {
            return null;
        }
    }
    if (req.method != "GET") {
        // 仅接收 GET 请求
        returnRes(405, "Error!", 405);
        return false;
    }
    console.log(`[INFO] Req: ${req.url};`);
    if (req.url.startsWith("/api/today")) {
        var city = param("/api/today").city || CONFIG.defaultCity;
        // 默认 API: [0]
        let data;
        if (CONFIG.enable[0] == "moji") {
            data = await getMojiToday(city);
        } else if (CONFIG.enable[0] == "weather_com_cn") {
            data = await getWeatherComCN(city);
        }
        returnRes(200, (data));
        return true;
    }
    if (req.url.startsWith("/api/7d")) {
        var city = param("/api/7d").city || CONFIG.defaultCity;
        let data;
        if (CONFIG.enable[0] == "moji") {
            data = await getMoji7days(city);
        } else if (CONFIG.enable[0] == "weather_com_cn") {
            data = await getWeatherComCN7days(city);
        }
        returnRes(200, (data));
        return true;
    }
};

http.createServer(async (req, res) => {
    serve(req, res);
}).listen(CONFIG.port, CONFIG.hostname, () => {
    console.log(`[INFO] Serve at http://${CONFIG.hostname}:${CONFIG.port}/`);
});