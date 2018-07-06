const request = require('request-promise-native');
class WatchService {
    constructor() {
        this.auth = "";
        this.itemId = '1179926380333332484';
        this.skuId = '1179926380340672519';
        this.maxRequest = 10; //每次最多请求数量;
        this.queues = [];
    }
    get url() {
        return `https://prod-www.emaotai.cn/huieryun-identity/api/v1/auth/XIANGLONG/user/b2cmember/auth?appCode=1&_t=${+new Date()}`;
    }

    infoUrl(shopId, province) {
        let url =  `https://prod-wap.cmaotai.com/yundt-application-trade-core/api/v1/yundt/trade/item/detail/get?itemId=${this.itemId}&skuId=${this.skuId}&shopId=${shopId}&province=${encodeURIComponent(province)}&city=undefined&area=undefined`;
        console.log(url);
        return url;
    }

    infoUrlForMaster(province) {
        return `https://prod-wap.cmaotai.com/yundt-application-trade-core/api/v1/yundt/trade/item/detail/get?itemId=1178122054978857991&skuId=1178122055015558152&shopId=1173861555817843712&province=${encodeURIComponent(province)}&city=undefined&area=undefined`
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
            'appCode':2,
            'channelCode': '02',
            'auth': '',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'acw_tc=AQAAAImk+BfLCQcA6l5H35+gtYicRXAZ',
            'Host': 'prod-wap.cmaotai.com',
            'Referer': 'https://prod-wap.cmaotai.com/smartsales-o2o-h5/?from=singlemessage&isappinstalled=0',
            'tenantId': 1,
            'terminalType': 'c1',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.4; LA2-SN Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[android/1.0.23/8bf81d40806ffb9614867197b8e33243/2418a0720cacab1cb0f7cb7ef8490ff2]',
            'Cache-Control': 'no-cache',

        };
    }
    async info(network, province) {
        let res = await request({
            url: this.infoUrl(network, province),
            method: 'get',
            headers: this.headers,
            json:true,
            gzip: true,
        })

        // console.log(res);
        if(res && res.data && res.data.shopInfo && res.data.minStockCount > 0) {
            console.log('该网点有货',network, province, res.data.shopInfo.address, '库存', res.data.minStockCount, '限购', res.data.limitNum[0].maxNum);
        }
        if(this.queues.length > 0) {
            this.queues.shift()();
        }
        return this;
    }

    async scan(networks, province) {
        let promises = [];
        networks.forEach((item, index) => {
            if(index < this.maxRequest) {
                promises.push(this.info(item.id, province));
            }else{
                promises.push(new Promise((resolve, reject) => {
                    const task = () => {
                        this.info(item.id, province)
                        .then(() => {
                            return resolve(true);
                        }).catch(e => {
                            return reject(e);
                        })
                    }

                    this.queues.push(task);
                }));
            }

        })
        await Promise.all(promises);
    }

    async watchMaster(province){

        let res = await request({
            url: this.infoUrlForMaster(province),
            method: 'get',
            headers: this.headers,
            json:true,
            gzip: true,
        })

        console.log(res.data);
        if(res && res.data && res.data.shopInfo && res.data.minStockCount > 0) {
            console.log('该网点有货',network, province, res.data.shopInfo.address, '库存', res.data.minStockCount, '限购', res.data.limitNum[0].maxNum);

        }
        return this;
    }
}

module.exports = new WatchService();
