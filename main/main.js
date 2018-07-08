'use strict';

const {loadAllItems,loadPromotions} = require('../main/fixtures')

function printReceipt(tags){
  const splitBarcode=splitBarcodeAndAmounts(tags);
  const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);
  const shoppingDetails = addShoppingDetailsWithSubtotal(calculateGoodsCount,loadAllItems());
  let discount=calculateDiscount(shoppingDetails,loadPromotions());
  let total=calculateTotal(shoppingDetails);
  let str=generateReceipt(shoppingDetails,discount,total);
  console.log(str);
}

/*将商品条码分割成{barcode: xx , amounts: xx}格式*/
function splitBarcodeAndAmounts(tags) {
  let formatByNum=[];
  for (let i of tags){
    let formatItemNum={};
    if (i.indexOf('-')!==-1){
      
      let div=i.split('-');
      formatItemNum.barcode=div[0];
      formatItemNum.goodsNum=parseFloat(div[1]);
    }else{
      formatItemNum.barcode=i;
      formatItemNum.goodsNum=1;
    }
    formatByNum.push(formatItemNum);
  }
  return formatByNum;
}
/*将商品条码按照数量进行统计*/
function calculateGoodsNumByBarcode(splitBarcode){
  let s=new Set();//去重
  const calculateGoodsCounts=[];
  for (let splitBarcodeObj of splitBarcode){
    if(s.has(splitBarcodeObj.barcode)){//如果已经有这个条码了
      for(let i of calculateGoodsCounts){
        if(splitBarcodeObj.barcode === i.barcode){
          i.goodsNum+=splitBarcodeObj.goodsNum;
        }
      }
    }else{
      s.add(splitBarcodeObj.barcode);
      calculateGoodsCounts.push(splitBarcodeObj);
    }
  }
  return calculateGoodsCounts;
}

/*购物详细信息小计*/
function addShoppingDetailsWithSubtotal(calculateGoodsCount,allItems){
  const shoppingDetails=[];
  for (let calculateObj of calculateGoodsCount) {
    for (let itemDetail of allItems){
      if(calculateObj.barcode === itemDetail.barcode){
        shoppingDetails.push({
          "barcode":itemDetail.barcode,
          "name":itemDetail.name,
          "count":calculateObj.goodsNum,
          "price":itemDetail.price,
          "unit":itemDetail.unit,
          "subTotal":parseFloat(itemDetail.price)*calculateObj.goodsNum
        });
      }
    }
  }
  return shoppingDetails;
}

/*计算折扣*/
function calculateDiscount(shoppingDetails,promotions){
  let discount=0;
  let promotionMessage=promotions[0];
  for (let shoppingDetailsObj of shoppingDetails){
    for (let barcode of promotionMessage.barcodes){
      if(shoppingDetailsObj.barcode === barcode) {
        shoppingDetailsObj.subTotal-=shoppingDetailsObj.price;
        discount+=shoppingDetailsObj.price;
      }
    }
  }
  return discount;
}

/*计算总计*/
function calculateTotal(shoppingDetails){
  let total=0;
  for(let shoppingDetailsObj of shoppingDetails){
    total+=shoppingDetailsObj.subTotal;
  }
  return total;
}
/*生成订单详情*/
function generateReceipt(shoppingDetails,discount,total){
  let goodsDetails="";
  for (let item of shoppingDetails){
    goodsDetails += `\n名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.subTotal.toFixed(2)}(元)`;
  }
  let str=`***<没钱赚商店>收据***${goodsDetails}
----------------------
总计：${total.toFixed(2)}(元)
节省：${discount.toFixed(2)}(元)
**********************`;
  return str;
}
module.exports={
    splitBarcodeAndAmounts,
    calculateGoodsNumByBarcode,
    addShoppingDetailsWithSubtotal,
    calculateDiscount,
    calculateTotal,
    generateReceipt,
    printReceipt
}