(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2170f8"],{c4b3:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"CircleMMDMesh-container"},[n("MMD-number",{attrs:{title:"平面半径",min:0},model:{value:t.config.radius,callback:function(e){t.$set(t.config,"radius",e)},expression:"config.radius"}}),n("MMD-number",{attrs:{title:"半径段数",min:1,step:1},model:{value:t.config.radialSegments,callback:function(e){t.$set(t.config,"radialSegments",e)},expression:"config.radialSegments"}}),n("MMD-slider",{attrs:{title:"起始角度",min:0,max:360},model:{value:t.config.thetaStart,callback:function(e){t.$set(t.config,"thetaStart",e)},expression:"config.thetaStart"}}),n("MMD-slider",{attrs:{title:"扇区角度",min:0,max:360},model:{value:t.config.thetaLength,callback:function(e){t.$set(t.config,"thetaLength",e)},expression:"config.thetaLength"}})],1)},i=[],c={props:{config:{}},data:function(){return{}},computed:{currentObject:function(){return this.$store.getters.getCurrentObject}}},r=c,s=n("2877"),o=Object(s["a"])(r,a,i,!1,null,"c0ccadba",null);e["default"]=o.exports}}]);