'use strict';
function printReceipt(tags){
    let sameItems =countNumByBarcode(tags);
    let detailItems=itemDetail(sameItems);
    let detailItemsForDis= discount(detailItems);
    console.log(print(detailItemsForDis));
};

function countNumByBarcode(collection) {
    let map = new Map();
    // 遍历集合中所有字符串
    for(let i=0;i<collection.length;i++){
      // 判断字符串， 如果不含有‘-’，直接做统计，否则做特殊处理统计
      if(collection[i].indexOf('-') == -1) {
        let ele = collection[i];
        // 判断是否已有存在的key
        if(!map.has(ele)) {
          map.set(ele, 0);
        }
        // 取出value加一
        map.set(ele,map.get(ele) + 1);
      } else {
        // 取‘-’前面的字符串作为key
        let ele = collection[i].substring(0,collection[i].indexOf('-'));
        if(!map.has(ele)) {
          map.set(ele, 0);
        }
        // 取字符串中的数字并做类型转换
        let nums= Number(collection[i].substring(collection[i].indexOf('-')+1));
        map.set(ele,map.get(ele) + nums);
      }
    }
    let sameItems=[];
    map.forEach(function(value,key){
      sameItems.push({
        barcode:key,
        goodsNum:value
      });
    })
  return sameItems;
}

function itemDetail(sameItems){
    let detailItems=[];
    let wholeItems=loadAllItems();
    for(let i=0;i<sameItems.length;i++){
        for(let j=0;j<wholeItems.length;j++){
            if(sameItems[i].barcode===wholeItems[j].barcode){
                    detailItems.push({ 
                                    barcode:sameItems[i].barcode, 
                                    name:wholeItems[j].name,
                                    unit:wholeItems[j].unit,
                                    price:wholeItems[j].price,
                                    goodsNum:sameItems[i].goodsNum,
                                    subtotal:sameItems[i].goodsNum*wholeItems[j].price})
                 }
        }
    }
    return detailItems;
}

function discount(detailItems){
    let discountItem=loadPromotions();
    let discount=0;
    for(let i=0;i< discountItem[0].barcodes.length;i++){
        for(let j=0; j<detailItems.length;j++){
            if(discountItem[0].barcodes[i]===detailItems[j].barcode){
                if(parseInt(detailItems[j].goodsNum/2)!=0){
                    detailItems[j].subtotal-=detailItems[j].price;
                    discount+=detailItems[j].price;
                }
            }
        }
        
    }
    detailItems.push({discou:discount});
    return detailItems;
}

function print(detailItemsForDis){
    let sum=0;
    let title="***<没钱赚商店>收据***\n";
    let content="";
    for(let i=0;i<detailItemsForDis.length-1;i++){
        sum+=detailItemsForDis[i].subtotal;
        let price=detailItemsForDis[i].price.toFixed(2);//设置精度

        content+="名称："+detailItemsForDis[i].name+'，'+'数量：'+detailItemsForDis[i].goodsNum+detailItemsForDis[i].unit+'，' +
                 '单价：'+price+'(元)，'+'小计：'+detailItemsForDis[i].subtotal.toFixed(2)+'(元)\n';
    }

    let total='----------------------\n总计：'+sum.toFixed(2)+'(元)'+'\n';
    let subtotal='节省：'+detailItemsForDis[3].discou.toFixed(2)+'(元)'+'\n**********************';
    return title+content+total+subtotal;
}