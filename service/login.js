const request = require('request-promise-native')
class LoginService {
    constructor() {
        this.auth = "";
    }
    get url() {
        return `https://prod-www.emaotai.cn/huieryun-identity/api/v1/auth/XIANGLONG/user/b2cmember/auth?appCode=1&_t=${+new Date()}`;
    }

    get infoUrl() {
        return `https://prod-www.emaotai.cn/yundt-application-trade-core/api/v1/yundt/trade/member/account/detail/get?appCode=1&_t=${+new Date()}`;
    }

    get headers_other() {
        let originHeaders = Object.assign(this.headers, {
            'auth': this.auth || "",
            'Content-Type': 'application/x-www-form-urlencoded',
            'terminalType':'a1'
        });

        return originHeaders;
    }

    get headers() {
        return {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'appId': 1,
            'Cache-Control': 'no-cache',
            'channelCode': '01',
            'channelId': '01',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Flag': 1,
            'Origin': 'https://www.emaotai.cn',
            'Pragma': 'no-cache',
            'Referer': 'https://www.emaotai.cn/smartsales-b2c-web-pc/login',
            'Sign': 'd41d8cd98f00b204e9800998ecf8427e',
            'tenantId': 1,
            'Timestamp': +new Date(),
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
        };
    }
    async login() {
        let res = await request({
            url: this.url,
            method: 'post',
            headers: this.headers,
            form:{
                userCode: '15330066919',
                userPassword: 'MTEwNTIw',
                loginType: 'name',
                loginSource: 2,
                loginFlag: 1,
            },
            gzip:true,
            json:true,
        })
        if(res.resultCode === 0){
            this.auth = res.data.auth;
            console.log(this.auth);
        }
        console.log(res);
        return this;
    }

    async userInfo() {
        console.log(this.headers_other);
        let res = await request({
            url: this.infoUrl,
            method: 'get',
            headers: this.headers_other,
            gzip:true,
        })
        console.log(res);
        return this;
    }
}

module.exports = new LoginService();
