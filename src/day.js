// 日期处理工具

const full_ydm = (d, m, y) => {
    // 默认只需要传入 d; 数字
    let _date = new Date();
    if (!m) m = _date.getMonth() + 1;
    if (!y) y = _date.getFullYear();
    if (!d) return false;
    // 首先判断位数
    m = String(m);
    y = String(y);
    d = String(d);
    if (d.length == 1) {
        d = "0" + d;
    }
    if (m.length == 1) {
        m = "0" + m;
    }
    return `${y}-${m}-${d}`;
}

module.exports.full_ydm = (d, m, y) => {
    return full_ydm(d, m, y);
};