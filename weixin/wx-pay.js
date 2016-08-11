var config = require('./config');

var express = require('express');
var router = express.Router();
var fs = require('fs');
var get_ip = require('ipware')().get_ip;

var middleware = require('wechat-pay').middleware;
var Payment = require('wechat-pay').Payment;

var initConfig = {
    appId: config.appid,
    mchId: config.mch_id,
    partnerKey: config.partnerKey,
    notifyUrl: config.notifyUrl,
    pfx: fs.readFileSync(config.payFile)

};
var payment = new Payment(initConfig);


/** 
 * 支付 
 **/
router.post('/info', function (req, res) {
    let cart = req.body.cart;
    var user = req.session.user;

    var order = {
        body: '订单支付',
        attach: '微信支付',
        out_trade_no: cart.no,
        total_fee: cart.totalPrice,
        spbill_create_ip: getClientIp4(req),
        openid: user.openId,
        trade_type: 'JSAPI'
    };
    console.log(order);
    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
        if (err) {
            console.log(err);
        }
        res.json(payargs);
    });

});



/** 
* 微信支付回调 
*（点击支付后微信回调的目录） 
*/
router.post('/notify', middleware(initConfig).getNotify().done(function (message, req, res, next) {
    console.log('pay notify: ' + message);//微信返回的数据  
    if (message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS') {

        //这里你可以写支付成功后的操作  

    }

}));

function getClientIp4(req) {
    var ip = get_ip(req).clientIp;
    return (ip.length < 15 ? ip : (ip.substring(0, 7) === '::ffff:' ? ip.substring(7) : undefined));
}


// 导出  
module.exports = router;  