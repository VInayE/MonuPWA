export { setP2PParams, setBodyProperty, removeBodyProperty, calculateRedemmedAmount ,formP2PCabsOption}

function setP2PParams (getP2PSearchParams) {
 let selectedPosition = {
   'pickupLatitude': getP2PSearchParams.pickupLatitude,
   'dropLatitude': getP2PSearchParams.dropLatitude,
   'pickUpLongitude': getP2PSearchParams.pickUpLongitude,
   'dropLongitude': getP2PSearchParams.dropLongitude,
   'pickUpLocation': getP2PSearchParams.pickUpLocation,
   'dropLocation': getP2PSearchParams.dropLocation,
   'currentLatitude': getP2PSearchParams.currentLatitude,
   'currentLongitude': getP2PSearchParams.currentLongitude
 }
 return selectedPosition
}

function setBodyProperty () {
 var d = document.getElementsByTagName('body')
 d[0].style.overflow = 'hidden'
}

function removeBodyProperty () {
 var d = document.getElementsByTagName('body')
 d[0].style.overflow = 'auto'
}

function calculateRedeemAmt(amt,expirableNode,non_expirableNode){
 var finalRedeemAmt =0
 var amntRedmed = 0;
 var maxLimit = 250;
 var amtInRs = parseInt(amt*.05);
 if(expirableNode != null && non_expirableNode != null) {
     if((parseInt(non_expirableNode.redeemableECashInPaisa))/100 > 1) {
            if(amtInRs>=expirableNode.redeemableECashInPaisa*.01){
                amtInRs=expirableNode.redeemableECashInPaisa*.01
            }else{
                amtInRs = amtInRs
            }
            
            if(amtInRs<maxLimit) {
                 amntRedmed = amtInRs
             }else if(amt>maxLimit || parseInt(expirableNode.redeemableECashInPaisa*.01) >= maxLimit){
                 amntRedmed = maxLimit
             }
         var calAmt = amntRedmed+parseInt(non_expirableNode.redeemableECashInPaisa*.01);
         var tempAmnt = 0;
         /*if(amntRedmed<amt) {
            tempAmnt=amt;    
         }else{
             tempAmnt=amntRedmed
         }*/
         finalRedeemAmt = calAmt<=amt?calAmt:amntRedmed
     } else {
         if(amtInRs>=expirableNode.redeemableECashInPaisa*.01){
            amtInRs=expirableNode.redeemableECashInPaisa*.01
        } else {
            amtInRs = amtInRs
        }
         if(amtInRs<maxLimit) {
                 amntRedmed = amtInRs
             }else if(amt>maxLimit || parseInt(expirableNode.redeemableECashInPaisa*.01) >= maxLimit){
                 amntRedmed = maxLimit
             }
         var calAmt = amntRedmed+parseInt(non_expirableNode.redeemableECashInPaisa*.01);
         finalRedeemAmt = calAmt<=amt?calAmt:amntRedmed
     }
 } else if(expirableNode != null && non_expirableNode == null){
         finalRedeemAmt = amt*.05
 } else if(expirableNode == null && non_expirableNode != null) {
         amntRedmed = parseInt(expirableNode.redeemableECashInPaisa*.01) + parseInt(non_expirableNode.redeemableECashInPaisa*.01)     
         finalRedeemAmt = amntRedmed > amt ? amt : amntRedmed
 }
   return parseInt(finalRedeemAmt)
}

function calculateRedemmedAmount(amt,eCashNode){
   var expirableNodeIndex =  eCashNode.ECashList.findIndex(x => x.eCashType === "EXPIRABLE")
   var expirableNode = expirableNodeIndex >= 0 ? eCashNode.ECashList[expirableNodeIndex] : null
   var non_expirableNodeIndex =  eCashNode.ECashList.findIndex(x => x.eCashType === "NON_EXPIRABLE")
   var non_expirableNode = non_expirableNodeIndex >= 0 ? eCashNode.ECashList[non_expirableNodeIndex] : null
   var redeemAmt = calculateRedeemAmt(amt,expirableNode,non_expirableNode)
   return redeemAmt
}

function formP2PCabsOption (list) {
   let cabAvailityOption = {},i=0,j=0
   for (i = 0 ; i< list.sub_categories.length ; i++) {
     cabAvailityOption[list.sub_categories[i].id] = {
         id : list.sub_categories[i].id,
         name : list.sub_categories[i].name,
         selected :0,
         order : list.sub_categories[i].order,
         id : list.sub_categories[i].id,
         products:[]
     } 
   }
   for(j=0;j< list.products.length ; j++){
     cabAvailityOption[list.products[j].sub_category_id].products.push(list.products[j])
   }
   return cabAvailityOption
}