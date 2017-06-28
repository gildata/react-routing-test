/**
 * created by xgqfrms on 2017/06/28.
 * @version 1.0.0 
 */
"use strict";

// import json from './data.json';

const datas = (() => {
    // fetch data
    const url = `./data.json`;
    fetch(url)
    .then((response) => response.json())
    .then((json)=> {
        console.log(`json, ${json}`);
        return datas = json;
    })
})();


/* globals svd */

// 模拟商品数据
let GOODS = datas;

let el = svd.el;                // 创建虚拟元素
// let diff = svd.diff;            // 比对区别
// let patch = svd.patch;          // 更新不同，打补丁
let Root, Tree;// Dom树和虚拟树


// 价格计算
let Calc = (function () {
    // 合计价格数据
    let _;
    // 总计价格的重置
    let reset = function () {
        _ = {
            sum: 0,       // 商品总价
            activity: 0,    // 活动减价
            dd: 0        // 商品达豆总价
        };
    };
    // 金额条显示
    let render = function () {
        return el('div', {
            class: 'col-sm-12',
            style: 'text-align:right;'
        }, ['合计金额 ¥' + _.sum + ' 元']);
    };
    // 获取商品价格
    let getPrice = function (g) {
        return g.price;
    };
    // 商品类
    let Good = function (g) {
        this.price = Calc.getPrice(g);
        this.sum = g.quantity * this.price;
        this.dd = 'dadou' in g && g.dadou || 0;
        this.dc = this.dd * g.quantity;
        // 合计价格、达豆
        _.sum = parseFloat(_.sum) + this.sum;
        _.dc = parseInt(_.dc) + this.dc; //dadouCount
    };
    return {
        getPrice: getPrice
        , render: render
        , reset: reset
        , Good: Good
    };
}());

// Dom操作
let Dom = (function () {
    // 活动列表
    let _activityList = {}
        , _goodDomArray = []; // 非活动商品dom数组
    // 拼装商品
    let setGood = function (good) {
        let _opt = {class: 'col-sm-12 form-group good-group', 'data-gid': good.gid}
            , _g = new Calc.Good(good);
        if (good.quantity <= 0) { //fixme 删除商品，则隐藏，否则有个侦听的bug
            _opt['style'] = 'display:none;';
        }
        return el('div', _opt, [
            el('div', {class: 'col-sm-5'}, [good.name])
            , el('div', {class: 'col-sm-2'}, ['¥' + _g.price]
                + (_g.dd ? ' ( ' + _g.dd + '达豆 ) ' : '')
            )
            , el('div', {class: 'col-sm-3 input-group'}, [
                el('div', {class: 'input-group-addon good-sub', 'data-gid': good.gid}, ['-'])
                , el('input', {
                    class: 'form-control good-quantity',
                    type: 'text',
                    value: good.quantity,
                    style: 'width:3em;'
                })
                , el('div', {class: 'input-group-addon good-add'}, ['+'])
            ])
            , el('div', {class: 'col-sm-2'}, ['¥' + _g.sum]
                + (_g.dc ? ' ( ' + _g.dc + '达豆 ) ' : '')
            )
        ]);
    };
    // 重置活动信息
    let resetActivity = function () {
        _activityList = {};
        _goodDomArray = [];
    };
    // 写入活动信息
    let setActivity = function (good) {
        if ('activity' in good && good.activity) {
            let _act = good.activity
                , _aid = _act.aid
                , _good = new Calc.Good(good);
            if (_aid in _activityList) {// 当前活动已存在
                let __act = _activityList[_aid];
                __act.sum = parseFloat(__act.sum) + _good.sum;
                __act.goods.push(setGood(good));
            } else {
                _activityList[_aid] = {
                    sum: _good.sum
                    , baseLine: good.activity.baseLine
                    , off: good.activity.off
                    , goods: [setGood(good)]
                };
            }
        } else { // 非活动商品列表
            _goodDomArray.push(setGood(good));
        }
    };
    // 拼接活动信息
    let getActivity = function () {
        let _act = _activityList
            , _ = [];
        for (let a in _act) {
            if (_act.hasOwnProperty(a)) {
                let __act = _act[a], __dom;
                if (__act.sum >= __act.baseLine) {
                    __dom = ' 已满 ¥' + __act.baseLine + ' 元,减 ¥' + __act.off;
                } else if (__act.sum <= 0) {// 该活动总价为0
                    continue;//fixme   
                } else {
                    __dom = ' 还差 ¥' + (__act.baseLine - __act.sum) + ' 元满 ' + __act.baseLine;
                }
                _.push(el('div', {
                    class: 'col-sm-12 form-group activity-group',
                    'data-aid': a
                }, [__dom]));
                _ = _.concat(__act.goods);
            }
        }
        return _;
    };
    // 拼装商品列表
    let setList = function () {
        let _gld = [];//商品列表dom数组
        resetActivity();
        for (let g in GOODS) {
            if (GOODS.hasOwnProperty(g)) {
                let good = GOODS[g];
                setActivity(good);
            }
        }
        _gld = _gld.concat(getActivity());
        _gld = _gld.concat(_goodDomArray);
        _gld.push(Calc.render());
        return el('div', {
            class: 'col-sm-12 form-inline',
            style: 'margin:10px;border:1px #f00 dashed;padding:10px;'
        }, _gld);
    };
    return {
        set: setList
    };
}());
// 侦听
let Listener = (function () {
    // 内容拼接
    let container = function () {
        if (Tree) {                                 // 虚拟树存在则更新补丁
            let newTree = Dom.set()                     // 生成新的虚拟树
                , patches = svd.diff(Tree, newTree);    // 与已有虚拟树对比
            svd.patch(Root, patches);                   // 打补丁到原有Dom树中
            Tree = newTree;                             // 更新虚拟树
        } else {                                    // 无dom时构造
            Tree = Dom.set();                           // 构造虚拟树
            Root = Tree.render();                       // 将虚拟树构造为Dom树
            $('#cart_content').html(Root);              // 将Dom树写入html
        }
    };
    // 事件侦听
    let setListener = function () {
        let changeQuantity = function (e, qua) {
            let gid = $(e).parents('.good-group').data('gid')
                , good = GOODS[gid];
            good.quantity = parseInt(good.quantity) + qua;
            Calc.reset();
            container();
        };
        // fixme 监听事件错误
        $('#cart_content')
            .on('click', '.good-add', function () {// 增加数量
                changeQuantity($(this), 1);
            })
            .on('click', '.good-sub', function () {// 减少数量
                changeQuantity($(this), -1);
            });
    };
    // 初始化
    let init = function () {
        Calc.reset();
        container();
        setListener();
    };
    return {
        init: init
    };
}());

$(function () {
    Listener.init();
});






