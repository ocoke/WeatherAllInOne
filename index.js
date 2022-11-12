const yaml = require("js-yaml");
const fs = require("fs");
const CONFIG = yaml.load(fs.readFileSync("./_config.yml"));
const http = require("http");
const {getMojiToday, getMoji7days} = require("./src/moji");
const { getWeatherComCN, getWeatherComCN7days } = require("./src/weather_com_cn");
const ChinaCityList = JSON.parse(fs.readFileSync("./src/lib/ChinaCityList.json"));
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
    function getCity(data, from, to) {
        if (from == "code") {
            if (to == "code") return data;
            // 使用城市编码获取
            let _list = {};
            for (i of ChinaCityList) {
                for (o of i.city) {
                    for (j of o.county) {
                        if (j.code == data) {
                            _list = j;
                        }
                    }
                }
            }
            if (!to) return _list;
            if (to == "name") return _list.name || CONFIG.defaultCity;
            if (to == "name_en") return _list.name_en || getCity(CONFIG.defaultCity, "name", "name_en");
        } else if (from == "name") {
            if (to == "name") return data;
            // 使用城市编码获取
            let _list = {};
            for (i of ChinaCityList) {
                for (o of i.city) {
                    for (j of o.county) {
                        if (j.name == data) {
                            _list = j;
                        }
                    }
                }
            }
            if (!to) return _list;
            if (to == "code") return _list.code || getCity(CONFIG.defaultCity, "name", "code");
            if (to == "name_en") return _list.name_en || getCity(CONFIG.defaultCity, "name", "name_en");
        } else if (from == "name_en") {
            if (to == "name_en") return data;
            // 使用城市编码获取
            let _list = {};
            for (i of ChinaCityList) {
                for (o of i.city) {
                    for (j of o.county) {
                        if (j.name_en == data) {
                            _list = j;
                        }
                    }
                }
            }
            if (!to) return _list;
            if (to == "code") return _list.code || getCity(CONFIG.defaultCity, "name", "code");
            if (to == "name") return _list.name || CONFIG.defaultCity;
        }
        return "";
    }
    console.log(`[INFO] Req: ${req.url};`);
    if (req.url.startsWith("/api/today")) {
        var city = getCity(decodeURIComponent(param("/api/today").city) || CONFIG.defaultCity, param("/api/today").format || "name");
        // 默认 API: [0]
        let data;
        if (CONFIG.enable[0] == "moji") {
            data = await getMojiToday(city.name);
        } else if (CONFIG.enable[0] == "weather_com_cn") {
            data = await getWeatherComCN((city.code).split("CN")[1]);
        }
        returnRes(200, (data));
        return true;
    }
    if (req.url.startsWith("/api/7d")) {
        var city = getCity(decodeURIComponent(param("/api/7d")).city, param("/api/7d").format);
        let data;
        if (CONFIG.enable[0] == "moji") {
            data = await getMoji7days(city.name);
        } else if (CONFIG.enable[0] == "weather_com_cn") {
            data = await getWeatherComCN7days((city.code).split("CN")[1]);
        }
        returnRes(200, (data));
        return true;
    }
    if (req.url.startsWith("/api/geo")) {
        // 城市地理数据 包含城市编号 英文 中文
        var city = getCity(decodeURIComponent(param("/api/geo")).city, param("/api/geo").format);
        returnRes(200, (city));
        return true;
    }
    returnRes(200, "WeatherAllInOne(WAIO.js) is running.");
};

http.createServer(async (req, res) => {
    serve(req, res);
}).listen(CONFIG.port, CONFIG.hostname, () => {
    console.log(`[INFO] Serve at http://${CONFIG.hostname}:${CONFIG.port}/`);
});