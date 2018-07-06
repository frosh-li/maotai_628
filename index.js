// const LoginService = require('./service/login.js');
// (async ()=>{
//     await LoginService.login();
//     await LoginService.userInfo();
// })()

const WatchService = require('./service/watch.js');
const networks = require('../maotaiServer/networks/110000.json');
const networks_320000 = require('../maotaiServer/networks/320000.json');
const networks_420000 = require('../maotaiServer/networks/420000.json');
(async ()=>{
    try{
        await WatchService.scan(require('../maotaiServer/networks/'), '湖北');
        // await WatchService.watchMaster('北京');
    }catch(e){
        console.log(e.message);
    }

})()
