(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dec83c1a"],{"08b9":function(t,e,n){},"2cb0":function(t,e,n){t.exports=n.p+"static/img/icon_qs1@3x.11046251.png"},6076:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"intro-container"},[t.showUpdate?[n("div",{staticClass:"update"},[n("img",{attrs:{src:t.updateimg,alt:""}}),n("p",[t._v(" 您目前使用的App版本低，请升级后体验")])])]:[n("div",{staticClass:"intro",domProps:{innerHTML:t._s(t.liveIntroduction)}}),t.nodatashow?n("div",{staticClass:"empty"},[n("img",{attrs:{src:t.nodataimg,alt:""}}),n("p",[t._v("该内容暂无简介")])]):t._e()]],2)},a=[],i=(n("5ab2"),n("6d57"),n("e10e"),n("419a"),n("e980")),c=n("ac9f"),o=n("365c"),s=n("4d5e"),u=n("cf45"),p=n("08c1");function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){Object(c["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var l={data:function(){return{liveIntroduction:"",nodataimg:n("2cb0"),updateimg:n("e2fd"),nodatashow:!1,showUpdate:!1,userInfo:{}}},created:function(){this.getIntroduce()},mounted:function(){document.title="简介"},methods:d({},Object(p["b"])({getUserInfo:"User/getUserInfo"}),{initData:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,this.nodatashow=!1,t.next=4,o["c"].liveIntroduction({liveId:u["a"].getUrl("liveId")});case 4:e=t.sent,this.liveIntroduction=e.liveIntroduction,t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),this.nodatashow=!0,console.log(t.t0);case 12:case"end":return t.stop()}}),t,this,[[0,8]])})));function e(){return t.apply(this,arguments)}return e}(),getIntroduce:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!s["c"]){t.next=10;break}return t.next=3,this.getUserInfo();case 3:if(this.userInfo=t.sent,1*u["a"].vCompare(this.userInfo.st.app_ver,"6.24.0")!==-1||1*u["a"].getUrl("screenType")!==2){t.next=7;break}return this.showUpdate=!0,t.abrupt("return");case 7:this.initData(),t.next=14;break;case 10:if("2"!==u["a"].getUrl("screenType")){t.next=13;break}return this.showUpdate=!0,t.abrupt("return");case 13:this.initData();case 14:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()})},b=l,h=(n("df189"),n("623f")),g=Object(h["a"])(b,r,a,!1,null,"6cb23b85",null);e["default"]=g.exports},df189:function(t,e,n){"use strict";var r=n("08b9"),a=n.n(r);a.a},e2fd:function(t,e,n){t.exports=n.p+"static/img/update_img.29f39c88.png"}}]);