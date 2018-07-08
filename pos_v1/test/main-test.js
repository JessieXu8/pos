'use strict';
describe('total test', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe('unit test', () => {

  it('unit test of splitBarcodeAndAmounts()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    const splitBarcode = splitBarcodeAndAmounts(tags);

    let result=JSON.stringify([
      {"barcode":"ITEM000001","goodsNum":1},
      {"barcode":"ITEM000001","goodsNum":1},
			{"barcode":"ITEM000001","goodsNum":1},
			{"barcode":"ITEM000001","goodsNum":1},
			{"barcode":"ITEM000001","goodsNum":1},
			{"barcode":"ITEM000003","goodsNum":2.5},
      {"barcode":"ITEM000005","goodsNum":1},
      {"barcode":"ITEM000005","goodsNum":2}
    ]);
    expect(JSON.stringify(splitBarcode)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of calculateGoodsNumByBarcode()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const splitBarcode=splitBarcodeAndAmounts(tags)
    const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);

    let result=JSON.stringify([
      {"barcode":"ITEM000001","goodsNum":5},
      {"barcode":"ITEM000003","goodsNum":2.5},
      {"barcode":"ITEM000005","goodsNum":3}
    ]);
    expect(JSON.stringify(calculateGoodsCount)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of addShoppingDetailsWithSubtotal()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const splitBarcode=splitBarcodeAndAmounts(tags)
    const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);
    const shoppingDetails = addShoppingDetailsWithSubtotal(calculateGoodsCount,loadAllItems());

    let result=JSON.stringify([
      {"barcode":"ITEM000001","name":"雪碧","count":5,"price":3,"unit":"瓶","subTotal":15},
      {"barcode":"ITEM000003","name":"荔枝","count":2.5,"price":15,"unit":"斤","subTotal":37.5},
      {"barcode":"ITEM000005","name":"方便面","count":3,"price":4.5,"unit":"袋","subTotal":13.5}
    ]);
    expect(JSON.stringify(shoppingDetails)).toBe(result)
  });
});

describe('unit test', () => {

  it('unit test of calculateDiscount()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const splitBarcode=splitBarcodeAndAmounts(tags)
    const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);
    const shoppingDetails = addShoppingDetailsWithSubtotal(calculateGoodsCount,loadAllItems());
    let discount=calculateDiscount(shoppingDetails,loadPromotions());
    let result=JSON.stringify('7.50');
    expect(JSON.stringify(discount.toFixed(2))).toBe(result)
  });
});

describe('unit test', () => {

  it('unit test of calculateTotal()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const splitBarcode=splitBarcodeAndAmounts(tags)
    const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);
    const shoppingDetails = addShoppingDetailsWithSubtotal(calculateGoodsCount,loadAllItems());
    let discount=calculateDiscount(shoppingDetails,loadPromotions());
    let total=calculateTotal(shoppingDetails);
    let result=JSON.stringify('58.50');
    expect(JSON.stringify(total.toFixed(2))).toBe(result)
  });
});

describe('unit test', () => {

  it('unit test of generateReceipt()', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const splitBarcode=splitBarcodeAndAmounts(tags)
    const calculateGoodsCount = calculateGoodsNumByBarcode(splitBarcode);
    const shoppingDetails = addShoppingDetailsWithSubtotal(calculateGoodsCount,loadAllItems());
    let discount=calculateDiscount(shoppingDetails,loadPromotions());
    let total=calculateTotal(shoppingDetails);
    let str=generateReceipt(shoppingDetails,discount,total);

    let result=`***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
    expect(str).toBe(result);
  });
});