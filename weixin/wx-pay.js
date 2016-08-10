var config = require('./config');

var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var client = new OAuth(config.wx_appid, config.wx_secret);

var middleware = require('wechat-pay').middleware;
var Payment = require('wechat-pay').Payment;
var initConfig = {
    appId: config.appid,
    mchId: config.mch_id,
    notifyUrl: "http://shop.km086.com/weixin/pay/notify/",
    pfx: fs.readFileSync("apiclient_cert.p12")

};
var payment = new Payment(initConfig);


/** 
 * 支付 
 **/
router.post('/info', function (req, res) {
    let cart = req.body.cart;
    var user = req.session.user;

    var order = {
        body: '微信支付',
        attach: '微信支付',
        out_trade_no: cart.no,
        total_fee: cart.totalPrice,
        spbill_create_ip: req.ip,
        openid: user.openId,
        trade_type: 'JSAPI'
    };
    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
        if (err) {
            log.error(err);
        }
        
        res.status(200).send({
            appId: payargs.appId,
            timeStamp: payargs.timeStamp,
            nonceStr: payargs.nonceStr,
            package: payargs.package,
            signType: payargs.signType,
            paySign: payargs.paySign,
            body: body,
            total: total,
            num: num,
            proname: project_name,
            state: state

        });
    });

});



/** 
* 微信支付回调 
*（点击支付后微信回调的目录） 
*/
router.post('/notify', middleware(initConfig).getNotify().done(function (message, req, res, next) {
    console.log('pay notify: '+message);//微信返回的数据  
    if (message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS') {

        //这里你可以写支付成功后的操作  

    }

}));


// 导出  
module.exports = router;  