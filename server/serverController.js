const baseURL = 'pwa/monuments'
module.exports = {
    postPaymentStatus : function(req,res) {
       res.redirect(`https://secure.yatra.com/${baseURL}/confirmation?ttid=`+req.query.ttid)
    },
    getPaymentStatus : function(req,res) {
       res.redirect(`http://www.yatra.com/${baseURL}/home`)
    },
}
