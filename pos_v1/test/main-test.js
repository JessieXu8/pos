'use strict';



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



describe('pos test', () => {



  it('it should print text', () => {



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



describe('function findKinds() test', () => {



  it('it should return the right result', () => {



    const buy_items = findKinds(tags);

    //console.info(buy_items);

    const temp = Array.from(buy_items)

    const expectText = '["ITEM000001","ITEM000003","ITEM000005"]';

    expect(JSON.stringify(temp)).toEqual(expectText);

  });

});
describe('function findCount() test', () => {



  it('it should return the right result', () => {

    const kinds = findKinds(tags);

    const items = findCount(tags,kinds);



    const expectText = '[{"barcode":"ITEM000001","count":5},{"barcode":"ITEM000003","count":2.5},{"barcode":"ITEM000005","count":3}]';

    expect(JSON.stringify(items)).toEqual(expectText);

  });

});

describe('function findTable() test', () => {

  it('it should return the right result', () => {

    const kinds = findKinds(tags);

    const items = findCount(tags,kinds);

    let itemList = findTable(items);

    const expectText = '[{"barcode":"ITEM000001","name":"雪碧","count":5,"unit":"瓶","price":3},{"barcode":"ITEM000003","name":"荔枝","count":2.5,"unit":"斤","price":15},{"barcode":"ITEM000005","name":"方便面","count":3,"unit":"袋","price":4.5}]';

    expect(JSON.stringify(itemList)).toEqual(expectText);

  });

});
describe('function getPromotion() test', () => {



  it('it should return the right result', () => {

    const kinds = findKinds(tags);

    const items = findCount(tags,kinds);

    let itemList = findTable(items);

    let receiptBase = getPromotion(itemList);

    const expectText = '[{"barcode":"ITEM000001","name":"雪碧","count":5,"unit":"瓶","price":3,"countAfterPromote":4,"subTotal":12},{"barcode":"ITEM000003","name":"荔枝","count":2.5,"unit":"斤","price":15,"countAfterPromote":2.5,"subTotal":37.5},{"barcode":"ITEM000005","name":"方便面","count":3,"unit":"袋","price":4.5,"countAfterPromote":2,"subTotal":9}]';

    expect(JSON.stringify(receiptBase)).toEqual(expectText);

  });

});