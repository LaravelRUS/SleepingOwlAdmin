/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/air-datepicker/air-datepicker.js":
/*!*******************************************************!*\
  !*** ./node_modules/air-datepicker/air-datepicker.js ***!
  \*******************************************************/
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){return function(){"use strict";var e={d:function(t,i){for(var s in i)e.o(i,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:i[s]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}},t={};e.d(t,{default:function(){return R}});var i={days:"days",months:"months",years:"years",day:"day",month:"month",year:"year",eventChangeViewDate:"changeViewDate",eventChangeCurrentView:"changeCurrentView",eventChangeFocusDate:"changeFocusDate",eventChangeSelectedDate:"changeSelectedDate",eventChangeTime:"changeTime",eventChangeLastSelectedDate:"changeLastSelectedDate",actionSelectDate:"selectDate",actionUnselectDate:"unselectDate",cssClassWeekend:"-weekend-"},s={classes:"",inline:!1,locale:{days:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],daysShort:["Вос","Пон","Вто","Сре","Чет","Пят","Суб"],daysMin:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthsShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],today:"Сегодня",clear:"Очистить",dateFormat:"dd.MM.yyyy",timeFormat:"HH:mm",firstDay:1},startDate:new Date,firstDay:"",weekends:[6,0],dateFormat:"",altField:"",altFieldDateFormat:"T",toggleSelected:!0,keyboardNav:!0,selectedDates:!1,container:"",isMobile:!1,visible:!1,position:"bottom left",offset:12,view:i.days,minView:i.days,showOtherMonths:!0,selectOtherMonths:!0,moveToOtherMonthsOnSelect:!0,showOtherYears:!0,selectOtherYears:!0,moveToOtherYearsOnSelect:!0,minDate:"",maxDate:"",disableNavWhenOutOfRange:!0,multipleDates:!1,multipleDatesSeparator:", ",range:!1,dynamicRange:!0,buttons:!1,monthsField:"monthsShort",showEvent:"focus",autoClose:!1,fixedHeight:!1,prevHtml:'<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',nextHtml:'<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',navTitles:{days:"MMMM, <i>yyyy</i>",months:"yyyy",years:"yyyy1 - yyyy2"},timepicker:!1,onlyTimepicker:!1,dateTimeSeparator:" ",timeFormat:"",minHours:0,maxHours:24,minMinutes:0,maxMinutes:59,hoursStep:1,minutesStep:1,onSelect:!1,onChangeViewDate:!1,onChangeView:!1,onRenderCell:!1,onShow:!1,onHide:!1,onClickDayName:!1};function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document;return"string"==typeof e?t.querySelector(e):e}function n(){let{tagName:e="div",className:t="",innerHtml:i="",id:s="",attrs:a={}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=document.createElement(e);return t&&n.classList.add(...t.split(" ")),s&&(n.id=s),i&&(n.innerHTML=i),a&&r(n,a),n}function r(e,t){for(let[i,s]of Object.entries(t))void 0!==s&&e.setAttribute(i,s);return e}function h(e){return new Date(e.getFullYear(),e.getMonth()+1,0).getDate()}function o(e){let t=e.getHours(),{hours:i,dayPeriod:s}=l(t);return{year:e.getFullYear(),month:e.getMonth(),fullMonth:e.getMonth()+1<10?"0"+(e.getMonth()+1):e.getMonth()+1,date:e.getDate(),fullDate:e.getDate()<10?"0"+e.getDate():e.getDate(),day:e.getDay(),hours:t,fullHours:d(t),hours12:i,dayPeriod:s,fullHours12:d(i),minutes:e.getMinutes(),fullMinutes:e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes()}}function l(e){return{dayPeriod:e>11?"pm":"am",hours:e%12==0?12:e%12}}function d(e){return e<10?"0"+e:e}function c(e){let t=10*Math.floor(e.getFullYear()/10);return[t,t+9]}function u(){let e=[];for(var t=arguments.length,i=new Array(t),s=0;s<t;s++)i[s]=arguments[s];return i.forEach((t=>{if("object"==typeof t)for(let i in t)t[i]&&e.push(i);else t&&e.push(t)})),e.join(" ")}function p(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.days;if(!e||!t)return!1;let a=o(e),n=o(t);return{[i.days]:a.date===n.date&&a.month===n.month&&a.year===n.year,[i.months]:a.month===n.month&&a.year===n.year,[i.years]:a.year===n.year}[s]}function m(e,t,i){let s=g(e,!1).getTime(),a=g(t,!1).getTime();return i?s>=a:s>a}function v(e,t){return!m(e,t,!0)}function g(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=new Date(e.getTime());return"boolean"!=typeof t||t||function(e){e.setHours(0,0,0,0)}(i),i}function D(e,t,i){e.length?e.forEach((e=>{e.addEventListener(t,i)})):e.addEventListener(t,i)}function y(e,t){return!(!e||e===document||e instanceof DocumentFragment)&&(e.matches(t)?e:y(e.parentNode,t))}function f(e,t,i){return e>i?i:e<t?t:e}function w(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];return i.filter((e=>e)).forEach((t=>{for(let[i,s]of Object.entries(t))if(void 0!==s&&"[object Object]"===s.toString()){let t=void 0!==e[i]?e[i].toString():void 0,a=s.toString(),n=Array.isArray(s)?[]:{};e[i]=e[i]?t!==a?n:e[i]:n,w(e[i],s)}else e[i]=s})),e}function b(e){let t=e;return e instanceof Date||("string"==typeof e&&/^\d{4}-\d{2}-\d{2}$/.test(e)&&(e+="T00:00:00"),t=new Date(e)),isNaN(t.getTime())&&(console.log(`Unable to convert value "${e}" to Date object`),t=!1),t}function $(e){let t="\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;";return new RegExp("(^|>|"+t+")("+e+")($|<|"+t+")","g")}function k(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class C{constructor(){let{type:e,date:t,dp:i,opts:s,body:a}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};k(this,"focus",(()=>{this.$cell.classList.add("-focus-"),this.focused=!0})),k(this,"removeFocus",(()=>{this.$cell.classList.remove("-focus-"),this.focused=!1})),k(this,"select",(()=>{this.$cell.classList.add("-selected-"),this.selected=!0})),k(this,"removeSelect",(()=>{this.$cell.classList.remove("-selected-","-range-from-","-range-to-"),this.selected=!1})),k(this,"onChangeSelectedDate",(()=>{this.isDisabled||(this._handleSelectedStatus(),this.opts.range&&this._handleRangeStatus())})),k(this,"onChangeFocusDate",(e=>{if(!e)return void(this.focused&&this.removeFocus());let t=p(e,this.date,this.type);t?this.focus():!t&&this.focused&&this.removeFocus(),this.opts.range&&this._handleRangeStatus()})),k(this,"render",(()=>(this.$cell.innerHTML=this._getHtml(),this._handleClasses(),this.$cell))),this.type=e,this.singleType=this.type.slice(0,-1),this.date=t,this.dp=i,this.opts=s,this.body=a,this.customData=!1,this.init()}init(){var e,t;let{onRenderCell:i}=this.opts;i&&(this.customData=i({date:this.date,cellType:this.singleType,datepicker:this.dp})),this._createElement(),this._bindDatepickerEvents(),null!==(e=this.customData)&&void 0!==e&&e.disabled?this.dp.disableDate(this.date):!1===(null===(t=this.customData)||void 0===t?void 0:t.disabled)&&this.dp.enableDate(this.date)}_bindDatepickerEvents(){this.dp.on(i.eventChangeSelectedDate,this.onChangeSelectedDate),this.dp.on(i.eventChangeFocusDate,this.onChangeFocusDate)}unbindDatepickerEvents(){this.dp.off(i.eventChangeSelectedDate,this.onChangeSelectedDate),this.dp.off(i.eventChangeFocusDate,this.onChangeFocusDate)}_createElement(){var e;let{year:t,month:i,fullMonth:s,date:a,fullDate:r}=o(this.date),h=(null===(e=this.customData)||void 0===e?void 0:e.attrs)||{};this.$cell=n({attrs:{"data-year":t,"data-month":i,"data-date":a,"data-iso-date":`${t}-${s}-${r}`,...h}}),this.$cell.adpCell=this}_getClassName(){var e;let t=new Date,{selectOtherMonths:s,selectOtherYears:a}=this.opts,{minDate:n,maxDate:r,isDateDisabled:h}=this.dp,{day:l}=o(this.date),d=this._isOutOfMinMaxRange(),c=h(this.date),m=u("air-datepicker-cell",`-${this.singleType}-`,{"-current-":p(t,this.date,this.type),"-min-date-":n&&p(n,this.date,this.type),"-max-date-":r&&p(r,this.date,this.type)}),v="";switch(this.type){case i.days:v=u({"-weekend-":this.dp.isWeekend(l),"-other-month-":this.isOtherMonth,"-disabled-":this.isOtherMonth&&!s||d||c});break;case i.months:v=u({"-disabled-":d});break;case i.years:v=u({"-other-decade-":this.isOtherDecade,"-disabled-":d||this.isOtherDecade&&!a})}return u(m,v,null===(e=this.customData)||void 0===e?void 0:e.classes).split(" ")}_getHtml(){var e;let{year:t,month:s,date:a}=o(this.date),{showOtherMonths:n,showOtherYears:r}=this.opts;if(null!==(e=this.customData)&&void 0!==e&&e.html)return this.customData.html;switch(this.type){case i.days:return!n&&this.isOtherMonth?"":a;case i.months:return this.dp.locale[this.opts.monthsField][s];case i.years:return!r&&this.isOtherDecade?"":t}}_isOutOfMinMaxRange(){let{minDate:e,maxDate:t}=this.dp,{type:s,date:a}=this,{month:n,year:r,date:h}=o(a),l=s===i.days,d=s===i.years,c=!!e&&new Date(r,d?e.getMonth():n,l?h:e.getDate()),u=!!t&&new Date(r,d?t.getMonth():n,l?h:t.getDate());return e&&t?v(c,e)||m(u,t):e?v(c,e):t?m(u,t):void 0}destroy(){this.unbindDatepickerEvents()}_handleRangeStatus(){const{selectedDates:e,focusDate:t,rangeDateTo:i,rangeDateFrom:s}=this.dp,a=e.length;if(this.$cell.classList.remove("-range-from-","-range-to-","-in-range-"),!a)return;let n=s,r=i;if(1===a&&t){const i=m(t,e[0]);n=i?e[0]:t,r=i?t:e[0]}let h=u({"-in-range-":n&&r&&(o=this.date,l=n,d=r,m(o,l)&&v(o,d)),"-range-from-":n&&p(this.date,n,this.type),"-range-to-":r&&p(this.date,r,this.type)});var o,l,d;h&&this.$cell.classList.add(...h.split(" "))}_handleSelectedStatus(){let e=this.dp._checkIfDateIsSelected(this.date,this.type);e?this.select():!e&&this.selected&&this.removeSelect()}_handleInitialFocusStatus(){p(this.dp.focusDate,this.date,this.type)&&this.focus()}_handleClasses(){this.$cell.setAttribute("class",""),this._handleInitialFocusStatus(),this.dp.hasSelectedDates&&(this._handleSelectedStatus(),this.dp.opts.range&&this._handleRangeStatus()),this.$cell.classList.add(...this._getClassName())}get isDisabled(){return this.$cell.matches(".-disabled-")}get isOtherMonth(){return this.dp.isOtherMonth(this.date)}get isOtherDecade(){return this.dp.isOtherDecade(this.date)}}function _(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}let M={[i.days]:`<div class="air-datepicker-body--day-names"></div><div class="air-datepicker-body--cells -${i.days}-"></div>`,[i.months]:`<div class="air-datepicker-body--cells -${i.months}-"></div>`,[i.years]:`<div class="air-datepicker-body--cells -${i.years}-"></div>`};const S=".air-datepicker-cell";class T{constructor(e){let{dp:t,type:s,opts:a}=e;_(this,"handleClick",(e=>{let t=e.target.closest(S).adpCell;if(t.isDisabled)return;if(!this.dp.isMinViewReached)return void this.dp.down();let i=this.dp._checkIfDateIsSelected(t.date,t.type);i?this.dp._handleAlreadySelectedDates(i,t.date):this.dp.selectDate(t.date)})),_(this,"handleDayNameClick",(e=>{let t=e.target.getAttribute("data-day-index");this.opts.onClickDayName({dayIndex:Number(t),datepicker:this.dp})})),_(this,"onChangeCurrentView",(e=>{e!==this.type?this.hide():(this.show(),this.render())})),_(this,"onMouseOverCell",(e=>{let t=y(e.target,S);this.dp.setFocusDate(!!t&&t.adpCell.date)})),_(this,"onMouseOutCell",(()=>{this.dp.setFocusDate(!1)})),_(this,"onClickBody",(e=>{let{onClickDayName:t}=this.opts,i=e.target;i.closest(S)&&this.handleClick(e),t&&i.closest(".air-datepicker-body--day-name")&&this.handleDayNameClick(e)})),_(this,"onMouseDown",(e=>{this.pressed=!0;let t=y(e.target,S),i=t&&t.adpCell;p(i.date,this.dp.rangeDateFrom)&&(this.rangeFromFocused=!0),p(i.date,this.dp.rangeDateTo)&&(this.rangeToFocused=!0)})),_(this,"onMouseMove",(e=>{if(!this.pressed||!this.dp.isMinViewReached)return;e.preventDefault();let t=y(e.target,S),i=t&&t.adpCell,{selectedDates:s,rangeDateTo:a,rangeDateFrom:n}=this.dp;if(!i||i.isDisabled)return;let{date:r}=i;if(2===s.length){if(this.rangeFromFocused&&!m(r,a)){let{hours:e,minutes:t}=o(n);r.setHours(e),r.setMinutes(t),this.dp.rangeDateFrom=r,this.dp.replaceDate(n,r)}if(this.rangeToFocused&&!v(r,n)){let{hours:e,minutes:t}=o(a);r.setHours(e),r.setMinutes(t),this.dp.rangeDateTo=r,this.dp.replaceDate(a,r)}}})),_(this,"onMouseUp",(()=>{this.pressed=!1,this.rangeFromFocused=!1,this.rangeToFocused=!1})),_(this,"onChangeViewDate",((e,t)=>{if(!this.isVisible)return;let s=c(e),a=c(t);switch(this.dp.currentView){case i.days:if(p(e,t,i.months))return;break;case i.months:if(p(e,t,i.years))return;break;case i.years:if(s[0]===a[0]&&s[1]===a[1])return}this.render()})),_(this,"render",(()=>{this.destroyCells(),this._generateCells(),this.cells.forEach((e=>{this.$cells.appendChild(e.render())}))})),this.dp=t,this.type=s,this.opts=a,this.cells=[],this.$el="",this.pressed=!1,this.isVisible=!0,this.init()}init(){this._buildBaseHtml(),this.type===i.days&&this.renderDayNames(),this.render(),this._bindEvents(),this._bindDatepickerEvents()}_bindEvents(){let{range:e,dynamicRange:t}=this.opts;D(this.$el,"mouseover",this.onMouseOverCell),D(this.$el,"mouseout",this.onMouseOutCell),D(this.$el,"click",this.onClickBody),e&&t&&(D(this.$el,"mousedown",this.onMouseDown),D(this.$el,"mousemove",this.onMouseMove),D(window.document,"mouseup",this.onMouseUp))}_bindDatepickerEvents(){this.dp.on(i.eventChangeViewDate,this.onChangeViewDate),this.dp.on(i.eventChangeCurrentView,this.onChangeCurrentView)}_buildBaseHtml(){this.$el=n({className:`air-datepicker-body -${this.type}-`,innerHtml:M[this.type]}),this.$names=a(".air-datepicker-body--day-names",this.$el),this.$cells=a(".air-datepicker-body--cells",this.$el)}_getDayNamesHtml(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.dp.locale.firstDay,t="",s=this.dp.isWeekend,{onClickDayName:a}=this.opts,n=e,r=0;for(;r<7;){let e=n%7;t+=`<div class="${u("air-datepicker-body--day-name",{[i.cssClassWeekend]:s(e),"-clickable-":!!a})}" data-day-index='${e}'>${this.dp.locale.daysMin[e]}</div>`,r++,n++}return t}renderDayNames(){this.$names.innerHTML=this._getDayNamesHtml()}_generateCell(e){let{type:t,dp:i,opts:s}=this;return new C({type:t,dp:i,opts:s,date:e,body:this})}_generateCells(){T.getDatesFunction(this.type)(this.dp,(e=>{this.cells.push(this._generateCell(e))}))}show(){this.isVisible=!0,this.$el.classList.remove("-hidden-")}hide(){this.isVisible=!1,this.$el.classList.add("-hidden-")}destroyCells(){this.cells.forEach((e=>e.destroy())),this.cells=[],this.$cells.innerHTML=""}destroy(){this.destroyCells(),this.dp.off(i.eventChangeViewDate,this.onChangeViewDate),this.dp.off(i.eventChangeCurrentView,this.onChangeCurrentView)}static getDaysDates(e,t){let{viewDate:i,opts:{fixedHeight:s},locale:{firstDay:a}}=e,n=h(i),{year:r,month:l}=o(i),d=new Date(r,l,1),c=new Date(r,l,n),u=d.getDay()-a,p=6-c.getDay()+a;u=u<0?u+7:u,p=p>6?p-7:p;let m=function(e,t){let{year:i,month:s,date:a}=o(e);return new Date(i,s,a-t)}(d,u),v=n+u+p,g=m.getDate(),{year:D,month:y}=o(m),f=0;s&&(v=42);const w=[];for(;f<v;){let e=new Date(D,y,g+f);t&&t(e),w.push(e),f++}return w}static getMonthsDates(e,t){let{year:i}=e.parsedViewDate,s=0,a=[];for(;s<12;){const e=new Date(i,s);a.push(e),t&&t(e),s++}return a}static getYearsDates(e,t){let i=c(e.viewDate),s=i[0]-1,a=i[1]+1,n=s,r=[];for(;n<=a;){const e=new Date(n,0);r.push(e),t&&t(e),n++}return r}static getDatesFunction(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.days;return{[i.days]:T.getDaysDates,[i.months]:T.getMonthsDates,[i.years]:T.getYearsDates}[e]}}function F(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class V{constructor(e){let{dp:t,opts:i}=e;F(this,"onClickNav",(e=>{let t=y(e.target,".air-datepicker-nav--action");if(!t)return;let i=t.dataset.action;this.dp[i]()})),F(this,"onChangeViewDate",(()=>{this.render(),this._resetNavStatus(),this.handleNavStatus()})),F(this,"onChangeCurrentView",(()=>{this.render(),this._resetNavStatus(),this.handleNavStatus()})),F(this,"onClickNavTitle",(()=>{this.dp.isFinalView||this.dp.up()})),F(this,"update",(()=>{let{prevHtml:e,nextHtml:t}=this.opts;this.$prev.innerHTML=e,this.$next.innerHTML=t,this._resetNavStatus(),this.render(),this.handleNavStatus()})),F(this,"renderDelay",(()=>{setTimeout(this.render)})),F(this,"render",(()=>{this.$title.innerHTML=this._getTitle(),function(e,t){for(let i in t)t[i]?e.classList.add(i):e.classList.remove(i)}(this.$title,{"-disabled-":this.dp.isFinalView})})),this.dp=t,this.opts=i,this.init()}init(){this._createElement(),this._buildBaseHtml(),this._defineDOM(),this.render(),this.handleNavStatus(),this._bindEvents(),this._bindDatepickerEvents()}_defineDOM(){this.$title=a(".air-datepicker-nav--title",this.$el),this.$prev=a('[data-action="prev"]',this.$el),this.$next=a('[data-action="next"]',this.$el)}_bindEvents(){this.$el.addEventListener("click",this.onClickNav),this.$title.addEventListener("click",this.onClickNavTitle)}_bindDatepickerEvents(){this.dp.on(i.eventChangeViewDate,this.onChangeViewDate),this.dp.on(i.eventChangeCurrentView,this.onChangeCurrentView),this.isNavIsFunction&&(this.dp.on(i.eventChangeSelectedDate,this.renderDelay),this.dp.opts.timepicker&&this.dp.on(i.eventChangeTime,this.render))}destroy(){this.dp.off(i.eventChangeViewDate,this.onChangeViewDate),this.dp.off(i.eventChangeCurrentView,this.onChangeCurrentView),this.isNavIsFunction&&(this.dp.off(i.eventChangeSelectedDate,this.renderDelay),this.dp.opts.timepicker&&this.dp.off(i.eventChangeTime,this.render))}_createElement(){this.$el=n({tagName:"nav",className:"air-datepicker-nav"})}_getTitle(){let{dp:e,opts:t}=this,i=t.navTitles[e.currentView];return"function"==typeof i?i(e):e.formatDate(e.viewDate,i)}handleNavStatus(){let{disableNavWhenOutOfRange:e}=this.opts,{minDate:t,maxDate:s}=this.dp;if(!t&&!s||!e)return;let{year:a,month:n}=this.dp.parsedViewDate,r=!!t&&o(t),h=!!s&&o(s);switch(this.dp.currentView){case i.days:t&&r.month>=n&&r.year>=a&&this._disableNav("prev"),s&&h.month<=n&&h.year<=a&&this._disableNav("next");break;case i.months:t&&r.year>=a&&this._disableNav("prev"),s&&h.year<=a&&this._disableNav("next");break;case i.years:{let e=c(this.dp.viewDate);t&&r.year>=e[0]&&this._disableNav("prev"),s&&h.year<=e[1]&&this._disableNav("next");break}}}_disableNav(e){a('[data-action="'+e+'"]',this.$el).classList.add("-disabled-")}_resetNavStatus(){!function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];e.length?e.forEach((e=>{e.classList.remove(...i)})):e.classList.remove(...i)}(this.$el.querySelectorAll(".air-datepicker-nav--action"),"-disabled-")}_buildBaseHtml(){let{prevHtml:e,nextHtml:t}=this.opts;this.$el.innerHTML=`<div class="air-datepicker-nav--action" data-action="prev">${e}</div><div class="air-datepicker-nav--title"></div><div class="air-datepicker-nav--action" data-action="next">${t}</div>`}get isNavIsFunction(){let{navTitles:e}=this.opts;return Object.keys(e).find((t=>"function"==typeof e[t]))}}var x={today:{content:e=>e.locale.today,onClick:e=>e.setViewDate(new Date)},clear:{content:e=>e.locale.clear,onClick:e=>e.clear()}};class H{constructor(e){let{dp:t,opts:i}=e;this.dp=t,this.opts=i,this.init()}init(){this.createElement(),this.render()}createElement(){this.$el=n({className:"air-datepicker-buttons"})}destroy(){this.$el.parentNode.removeChild(this.$el)}clearHtml(){return this.$el.innerHTML="",this}generateButtons(){let{buttons:e}=this.opts;Array.isArray(e)||(e=[e]),e.forEach((e=>{let t=e;"string"==typeof e&&x[e]&&(t=x[e]);let i=this.createButton(t);t.onClick&&this.attachEventToButton(i,t.onClick),this.$el.appendChild(i)}))}attachEventToButton(e,t){e.addEventListener("click",(()=>{t(this.dp)}))}createButton(e){let{content:t,className:i,tagName:s="button",attrs:a={}}=e;return n({tagName:s,innerHtml:`<span tabindex='-1'>${"function"==typeof t?t(this.dp):t}</span>`,className:u("air-datepicker-button",i),attrs:a})}render(){this.generateButtons()}}function E(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class L{constructor(){let{opts:e,dp:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};E(this,"toggleTimepickerIsActive",(e=>{this.dp.timepickerIsActive=e})),E(this,"onChangeSelectedDate",(e=>{let{date:t,updateTime:i=!1}=e;t&&(this.setMinMaxTime(t),this.setCurrentTime(!!i&&t),this.addTimeToDate(t))})),E(this,"onChangeLastSelectedDate",(e=>{e&&(this.setTime(e),this.render())})),E(this,"onChangeInputRange",(e=>{let t=e.target;this[t.getAttribute("name")]=t.value,this.updateText(),this.dp.trigger(i.eventChangeTime,{hours:this.hours,minutes:this.minutes})})),E(this,"onMouseEnterLeave",(e=>{let t=e.target.getAttribute("name"),i=this.$minutesText;"hours"===t&&(i=this.$hoursText),i.classList.toggle("-focus-")})),E(this,"onFocus",(()=>{this.toggleTimepickerIsActive(!0)})),E(this,"onBlur",(()=>{this.toggleTimepickerIsActive(!1)})),this.opts=e,this.dp=t;let{timeFormat:s}=this.dp.locale;s&&(s.match($("h"))||s.match($("hh")))&&(this.ampm=!0),this.init()}init(){this.setTime(this.dp.lastSelectedDate||this.dp.viewDate),this.createElement(),this.buildHtml(),this.defineDOM(),this.render(),this.bindDatepickerEvents(),this.bindDOMEvents()}bindDatepickerEvents(){this.dp.on(i.eventChangeSelectedDate,this.onChangeSelectedDate),this.dp.on(i.eventChangeLastSelectedDate,this.onChangeLastSelectedDate)}bindDOMEvents(){let e="input";navigator.userAgent.match(/trident/gi)&&(e="change"),D(this.$ranges,e,this.onChangeInputRange),D(this.$ranges,"mouseenter",this.onMouseEnterLeave),D(this.$ranges,"mouseleave",this.onMouseEnterLeave),D(this.$ranges,"focus",this.onFocus),D(this.$ranges,"mousedown",this.onFocus),D(this.$ranges,"blur",this.onBlur)}createElement(){this.$el=n({className:u("air-datepicker-time",{"-am-pm-":this.dp.ampm})})}destroy(){this.dp.off(i.eventChangeSelectedDate,this.onChangeSelectedDate),this.dp.off(i.eventChangeLastSelectedDate,this.onChangeLastSelectedDate),this.$el.parentNode.removeChild(this.$el)}buildHtml(){let{ampm:e,hours:t,displayHours:i,minutes:s,minHours:a,minMinutes:n,maxHours:r,maxMinutes:h,dayPeriod:o,opts:{hoursStep:l,minutesStep:c}}=this;this.$el.innerHTML=`<div class="air-datepicker-time--current">   <span class="air-datepicker-time--current-hours">${d(i)}</span>   <span class="air-datepicker-time--current-colon">:</span>   <span class="air-datepicker-time--current-minutes">${d(s)}</span>   `+(e?`<span class='air-datepicker-time--current-ampm'>${o}</span>`:"")+'</div><div class="air-datepicker-time--sliders">   <div class="air-datepicker-time--row">'+`      <input type="range" name="hours" value="${t}" min="${a}" max="${r}" step="${l}"/>   </div>   <div class="air-datepicker-time--row">`+`      <input type="range" name="minutes" value="${s}" min="${n}" max="${h}" step="${c}"/>   </div></div>`}defineDOM(){let e=e=>a(e,this.$el);this.$ranges=this.$el.querySelectorAll('[type="range"]'),this.$hours=e('[name="hours"]'),this.$minutes=e('[name="minutes"]'),this.$hoursText=e(".air-datepicker-time--current-hours"),this.$minutesText=e(".air-datepicker-time--current-minutes"),this.$ampm=e(".air-datepicker-time--current-ampm")}setTime(e){this.setMinMaxTime(e),this.setCurrentTime(e)}addTimeToDate(e){e&&(e.setHours(this.hours),e.setMinutes(this.minutes))}setMinMaxTime(e){if(this.setMinMaxTimeFromOptions(),e){let{minDate:t,maxDate:i}=this.dp;t&&p(e,t)&&this.setMinTimeFromMinDate(t),i&&p(e,i)&&this.setMaxTimeFromMaxDate(i)}}setCurrentTime(e){let{hours:t,minutes:i}=e?o(e):this;this.hours=f(t,this.minHours,this.maxHours),this.minutes=f(i,this.minMinutes,this.maxMinutes)}setMinMaxTimeFromOptions(){let{minHours:e,minMinutes:t,maxHours:i,maxMinutes:s}=this.opts;this.minHours=f(e,0,23),this.minMinutes=f(t,0,59),this.maxHours=f(i,0,23),this.maxMinutes=f(s,0,59)}setMinTimeFromMinDate(e){let{lastSelectedDate:t}=this.dp;this.minHours=e.getHours(),t&&t.getHours()>e.getHours()?this.minMinutes=this.opts.minMinutes:this.minMinutes=e.getMinutes()}setMaxTimeFromMaxDate(e){let{lastSelectedDate:t}=this.dp;this.maxHours=e.getHours(),t&&t.getHours()<e.getHours()?this.maxMinutes=this.opts.maxMinutes:this.maxMinutes=e.getMinutes()}updateSliders(){r(this.$hours,{min:this.minHours,max:this.maxHours}).value=this.hours,r(this.$minutes,{min:this.minMinutes,max:this.maxMinutes}).value=this.minutes}updateText(){this.$hoursText.innerHTML=d(this.displayHours),this.$minutesText.innerHTML=d(this.minutes),this.ampm&&(this.$ampm.innerHTML=this.dayPeriod)}set hours(e){this._hours=e;let{hours:t,dayPeriod:i}=l(e);this.displayHours=this.ampm?t:e,this.dayPeriod=i}get hours(){return this._hours}render(){this.updateSliders(),this.updateText()}}function A(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class O{constructor(e){let{dp:t,opts:i}=e;A(this,"pressedKeys",new Set),A(this,"hotKeys",new Map([[[["Control","ArrowRight"],["Control","ArrowUp"]],e=>e.month++],[[["Control","ArrowLeft"],["Control","ArrowDown"]],e=>e.month--],[[["Shift","ArrowRight"],["Shift","ArrowUp"]],e=>e.year++],[[["Shift","ArrowLeft"],["Shift","ArrowDown"]],e=>e.year--],[[["Alt","ArrowRight"],["Alt","ArrowUp"]],e=>e.year+=10],[[["Alt","ArrowLeft"],["Alt","ArrowDown"]],e=>e.year-=10],[["Control","Shift","ArrowUp"],(e,t)=>t.up()]])),A(this,"handleHotKey",(e=>{let t=this.hotKeys.get(e),i=o(this.getInitialFocusDate());t(i,this.dp);let{year:s,month:a,date:n}=i,r=h(new Date(s,a));r<n&&(n=r);let l=this.dp.getClampedDate(new Date(s,a,n));this.dp.setFocusDate(l,{viewDateTransition:!0})})),A(this,"isHotKeyPressed",(()=>{let e=!1,t=this.pressedKeys.size,i=e=>this.pressedKeys.has(e);for(let[s]of this.hotKeys){if(e)break;if(Array.isArray(s[0]))s.forEach((a=>{e||t!==a.length||(e=a.every(i)&&s)}));else{if(t!==s.length)continue;e=s.every(i)&&s}}return e})),A(this,"isArrow",(e=>e>=37&&e<=40)),A(this,"onKeyDown",(e=>{if(!this.dp.visible&&!this.dp.treatAsInline)return;let{key:t,which:i}=e,{dp:s,dp:{focusDate:a},opts:n}=this;this.registerKey(t);let r=this.isHotKeyPressed();if(r)return e.preventDefault(),void this.handleHotKey(r);if(this.isArrow(i))return e.preventDefault(),void this.focusNextCell(t);if("Enter"===t){if(s.currentView!==n.minView)return void s.down();if(a){let e=s._checkIfDateIsSelected(a);return void(e?s._handleAlreadySelectedDates(e,a):s.selectDate(a))}}"Escape"===t&&this.dp.hide()})),A(this,"onKeyUp",(e=>{this.removeKey(e.key)})),this.dp=t,this.opts=i,this.init()}init(){this.bindKeyboardEvents()}bindKeyboardEvents(){let{$el:e}=this.dp;e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}destroy(){let{$el:e}=this.dp;e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),this.hotKeys=null,this.pressedKeys=null}getInitialFocusDate(){let{focusDate:e,currentView:t,selectedDates:s,parsedViewDate:{year:a,month:n}}=this.dp,r=e||s[s.length-1];if(!r)switch(t){case i.days:r=new Date(a,n,(new Date).getDate());break;case i.months:r=new Date(a,n,1);break;case i.years:r=new Date(a,0,1)}return r}focusNextCell(e){let t=this.getInitialFocusDate(),{currentView:s}=this.dp,{days:a,months:n,years:r}=i,h=o(t),l=h.year,d=h.month,c=h.date;switch(e){case"ArrowLeft":s===a&&(c-=1),s===n&&(d-=1),s===r&&(l-=1);break;case"ArrowUp":s===a&&(c-=7),s===n&&(d-=3),s===r&&(l-=4);break;case"ArrowRight":s===a&&(c+=1),s===n&&(d+=1),s===r&&(l+=1);break;case"ArrowDown":s===a&&(c+=7),s===n&&(d+=3),s===r&&(l+=4)}let u=this.dp.getClampedDate(new Date(l,d,c));this.dp.setFocusDate(u,{viewDateTransition:!0})}registerKey(e){this.pressedKeys.add(e)}removeKey(e){this.pressedKeys.delete(e)}}let N={on(e,t){this.__events||(this.__events={}),this.__events[e]?this.__events[e].push(t):this.__events[e]=[t]},off(e,t){this.__events&&this.__events[e]&&(this.__events[e]=this.__events[e].filter((e=>e!==t)))},removeAllEvents(){this.__events={}},trigger(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];this.__events&&this.__events[e]&&this.__events[e].forEach((e=>{e(...i)}))}};function I(e,t,i){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var s=i.call(e,"string");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}let P="",j="",B=!1;class R{static buildGlobalContainer(e){B=!0,P=n({className:e,id:e}),a("body").appendChild(P)}constructor(e,t){var r=this;if(I(this,"viewIndexes",[i.days,i.months,i.years]),I(this,"next",(()=>{let{year:e,month:t}=this.parsedViewDate;switch(this.currentView){case i.days:this.setViewDate(new Date(e,t+1,1));break;case i.months:this.setViewDate(new Date(e+1,t,1));break;case i.years:this.setViewDate(new Date(e+10,0,1))}})),I(this,"prev",(()=>{let{year:e,month:t}=this.parsedViewDate;switch(this.currentView){case i.days:this.setViewDate(new Date(e,t-1,1));break;case i.months:this.setViewDate(new Date(e-1,t,1));break;case i.years:this.setViewDate(new Date(e-10,0,1))}})),I(this,"_finishHide",(()=>{this.hideAnimation=!1,this._destroyComponents(),this.$container.removeChild(this.$datepicker)})),I(this,"setPosition",(function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if("function"==typeof(e=e||r.opts.position))return void(r.customHide=e({$datepicker:r.$datepicker,$target:r.$el,$pointer:r.$pointer,isViewChange:t,done:r._finishHide}));let i,s,{isMobile:a}=r.opts,n=r.$el.getBoundingClientRect(),h=r.$el.getBoundingClientRect(),o=r.$datepicker.offsetParent,l=r.$el.offsetParent,d=r.$datepicker.getBoundingClientRect(),c=e.split(" "),u=window.scrollY,p=window.scrollX,m=r.opts.offset,v=c[0],g=c[1];if(a)r.$datepicker.style.cssText="left: 50%; top: 50%";else{if(o===l&&o!==document.body&&(h={top:r.$el.offsetTop,left:r.$el.offsetLeft,width:n.width,height:r.$el.offsetHeight},u=0,p=0),o!==l&&o!==document.body){let e=o.getBoundingClientRect();h={top:n.top-e.top,left:n.left-e.left,width:n.width,height:n.height},u=0,p=0}switch(v){case"top":i=h.top-d.height-m;break;case"right":s=h.left+h.width+m;break;case"bottom":i=h.top+h.height+m;break;case"left":s=h.left-d.width-m}switch(g){case"top":i=h.top;break;case"right":s=h.left+h.width-d.width;break;case"bottom":i=h.top+h.height-d.height;break;case"left":s=h.left;break;case"center":/left|right/.test(v)?i=h.top+h.height/2-d.height/2:s=h.left+h.width/2-d.width/2}r.$datepicker.style.cssText=`left: ${s+p}px; top: ${i+u}px`}})),I(this,"_setInputValue",(()=>{let{opts:e,$altField:t,locale:{dateFormat:i}}=this,{altFieldDateFormat:s,altField:a}=e;a&&t&&(t.value=this._getInputValue(s)),this.$el.value=this._getInputValue(i),this.$el.dispatchEvent(new Event("change"))})),I(this,"_getInputValue",(e=>{let{selectedDates:t,opts:i}=this,{multipleDates:s,multipleDatesSeparator:a}=i;if(!t.length)return"";let n="function"==typeof e,r=n?e(s?t:t[0]):t.map((t=>this.formatDate(t,e)));return r=n?r:r.join(a),r})),I(this,"_checkIfDateIsSelected",(function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.days,s=!1;return r.selectedDates.some((i=>{let a=p(e,i,t);return s=a&&i,a})),s})),I(this,"_scheduleCallAfterTransition",(e=>{this._cancelScheduledCall(),e&&e(!1),this._onTransitionEnd=()=>{e&&e(!0)},this.$datepicker.addEventListener("transitionend",this._onTransitionEnd,{once:!0})})),I(this,"_cancelScheduledCall",(()=>{this.$datepicker.removeEventListener("transitionend",this._onTransitionEnd)})),I(this,"setViewDate",(e=>{if(!((e=b(e))instanceof Date))return;if(p(e,this.viewDate))return;let t=this.viewDate;this.viewDate=e;let{onChangeViewDate:s}=this.opts;if(s){let{month:e,year:t}=this.parsedViewDate;s({month:e,year:t,decade:this.curDecade})}this.trigger(i.eventChangeViewDate,e,t)})),I(this,"setFocusDate",(function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};(!e||(e=b(e))instanceof Date)&&(r.focusDate=e,r.trigger(i.eventChangeFocusDate,e,t))})),I(this,"setCurrentView",(function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(r.viewIndexes.includes(e)){if(r.currentView=e,r.elIsInput&&r.visible&&r.setPosition(void 0,!0),r.trigger(i.eventChangeCurrentView,e),!r.views[e]){let t=r.views[e]=new T({dp:r,opts:r.opts,type:e});r.shouldUpdateDOM&&r.$content.appendChild(t.$el)}r.opts.onChangeView&&!t.silent&&r.opts.onChangeView(e)}})),I(this,"_updateLastSelectedDate",(e=>{this.lastSelectedDate=e,this.trigger(i.eventChangeLastSelectedDate,e)})),I(this,"destroy",(()=>{if(this.isDestroyed)return;let{showEvent:e,isMobile:t}=this.opts,i=this.$datepicker.parentNode;i&&i.removeChild(this.$datepicker),this.$el.removeEventListener(e,this._onFocus),this.$el.removeEventListener("blur",this._onBlur),window.removeEventListener("resize",this._onResize),t&&this._removeMobileAttributes(),this.keyboardNav&&this.keyboardNav.destroy(),this.views=null,this.nav=null,this.$datepicker=null,this.opts={},this.$customContainer=null,this.viewDate=null,this.focusDate=null,this.selectedDates=[],this.rangeDateFrom=null,this.rangeDateTo=null,this.isDestroyed=!0})),I(this,"update",(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=w({},r.opts),{silent:a}=t;w(r.opts,e);let{timepicker:n,buttons:h,range:o,selectedDates:l,isMobile:d}=r.opts,c=r.visible||r.treatAsInline;r._createMinMaxDates(),r._limitViewDateByMaxMinDates(),r._handleLocale(),l&&(r.selectedDates=[],r.selectDate(l,{silent:a})),e.view&&r.setCurrentView(e.view,{silent:a}),r._setInputValue(),s.range&&!o?(r.rangeDateTo=!1,r.rangeDateFrom=!1):!s.range&&o&&r.selectedDates.length&&(r.rangeDateFrom=r.selectedDates[0],r.rangeDateTo=r.selectedDates[1]),s.timepicker&&!n?(c&&r.timepicker.destroy(),r.timepicker=!1,r.$timepicker.parentNode.removeChild(r.$timepicker)):!s.timepicker&&n&&r._addTimepicker(),!s.buttons&&h?r._addButtons():s.buttons&&!h?(r.buttons.destroy(),r.$buttons.parentNode.removeChild(r.$buttons)):c&&s.buttons&&h&&r.buttons.clearHtml().render(),!s.isMobile&&d?(r.treatAsInline||j||r._createMobileOverlay(),r._addMobileAttributes(),r.visible&&r._showMobileOverlay()):s.isMobile&&!d&&(r._removeMobileAttributes(),r.visible&&(j.classList.remove("-active-"),"function"!=typeof r.opts.position&&r.setPosition())),c&&(r.nav.update(),r.views[r.currentView].render(),r.currentView===i.days&&r.views[r.currentView].renderDayNames())})),I(this,"disableDate",((e,t)=>{(Array.isArray(e)?e:[e]).forEach((e=>{let i=b(e);if(!i)return;let s=t?"delete":"add";this.disabledDates[s](this.formatDate(i,"yyyy-MM-dd"));let a=this.getCell(i,this.currentViewSingular);a&&a.adpCell.render()}),[])})),I(this,"enableDate",(e=>{this.disableDate(e,!0)})),I(this,"isDateDisabled",(e=>{let t=b(e);return this.disabledDates.has(this.formatDate(t,"yyyy-MM-dd"))})),I(this,"isOtherMonth",(e=>{let{month:t}=o(e);return t!==this.parsedViewDate.month})),I(this,"isOtherYear",(e=>{let{year:t}=o(e);return t!==this.parsedViewDate.year})),I(this,"isOtherDecade",(e=>{let{year:t}=o(e),[i,s]=c(this.viewDate);return t<i||t>s})),I(this,"_onChangeSelectedDate",(e=>{let{silent:t}=e;setTimeout((()=>{this._setInputValue(),this.opts.onSelect&&!t&&this._triggerOnSelect()}))})),I(this,"_onChangeFocusedDate",(function(e){let{viewDateTransition:t}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)return;let i=!1;t&&(i=r.isOtherMonth(e)||r.isOtherYear(e)||r.isOtherDecade(e)),i&&r.setViewDate(e),r.opts.onFocus&&r.opts.onFocus({datepicker:r,date:e})})),I(this,"_onChangeTime",(e=>{let{hours:t,minutes:i}=e,s=new Date,{lastSelectedDate:a,opts:{onSelect:n}}=this,r=a;a||(r=s);let h=this.getCell(r,this.currentViewSingular),o=h&&h.adpCell;o&&o.isDisabled||(r.setHours(t),r.setMinutes(i),a?(this._setInputValue(),n&&this._triggerOnSelect()):this.selectDate(r))})),I(this,"_onFocus",(e=>{this.visible||this.show()})),I(this,"_onBlur",(e=>{this.inFocus||!this.visible||this.opts.isMobile||this.hide()})),I(this,"_onMouseDown",(e=>{this.inFocus=!0})),I(this,"_onMouseUp",(e=>{this.inFocus=!1,this.$el.focus()})),I(this,"_onResize",(()=>{this.visible&&"function"!=typeof this.opts.position&&this.setPosition()})),I(this,"_onClickOverlay",(()=>{this.visible&&this.hide()})),I(this,"getViewDates",(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.days;return T.getDatesFunction(e)(r)})),I(this,"isWeekend",(e=>this.opts.weekends.includes(e))),I(this,"getClampedDate",(e=>{let{minDate:t,maxDate:i}=this,s=e;return i&&m(e,i)?s=i:t&&v(e,t)&&(s=t),s})),this.$el=a(e),!this.$el)return;this.$datepicker=n({className:"air-datepicker"}),this.opts=w({},s,t),this.$customContainer=!!this.opts.container&&a(this.opts.container),this.$altField=a(this.opts.altField||!1);let{view:h,startDate:l}=this.opts;l||(this.opts.startDate=new Date),"INPUT"===this.$el.nodeName&&(this.elIsInput=!0),this.inited=!1,this.visible=!1,this.viewDate=b(this.opts.startDate),this.focusDate=!1,this.initialReadonly=this.$el.getAttribute("readonly"),this.customHide=!1,this.currentView=h,this.selectedDates=[],this.disabledDates=new Set,this.isDestroyed=!1,this.views={},this.keys=[],this.rangeDateFrom="",this.rangeDateTo="",this.timepickerIsActive=!1,this.treatAsInline=this.opts.inline||!this.elIsInput,this.init()}init(){let{opts:e,treatAsInline:t,opts:{inline:i,isMobile:s,selectedDates:n,keyboardNav:r,onlyTimepicker:h}}=this,o=a("body");(!B||B&&P&&!o.contains(P))&&!i&&this.elIsInput&&!this.$customContainer&&R.buildGlobalContainer(R.defaultGlobalContainerId),!s||j||t||this._createMobileOverlay(),this._handleLocale(),this._bindSubEvents(),this._createMinMaxDates(),this._limitViewDateByMaxMinDates(),this.elIsInput&&(i||this._bindEvents(),r&&!h&&(this.keyboardNav=new O({dp:this,opts:e}))),n&&this.selectDate(n,{silent:!0}),this.opts.visible&&!t&&this.show(),s&&!t&&this.$el.setAttribute("readonly",!0),t&&this._createComponents()}_createMobileOverlay(){j=n({className:"air-datepicker-overlay"}),P.appendChild(j)}_createComponents(){let{opts:e,treatAsInline:t,opts:{inline:i,buttons:s,timepicker:a,position:n,classes:r,onlyTimepicker:h,isMobile:o}}=this;this._buildBaseHtml(),this.elIsInput&&(i||this._setPositionClasses(n)),!i&&this.elIsInput||this.$datepicker.classList.add("-inline-"),r&&this.$datepicker.classList.add(...r.split(" ")),h&&this.$datepicker.classList.add("-only-timepicker-"),o&&!t&&this._addMobileAttributes(),this.views[this.currentView]=new T({dp:this,type:this.currentView,opts:e}),this.nav=new V({dp:this,opts:e}),a&&this._addTimepicker(),s&&this._addButtons(),this.$content.appendChild(this.views[this.currentView].$el),this.$nav.appendChild(this.nav.$el)}_destroyComponents(){for(let e in this.views)this.views[e].destroy();this.views={},this.nav.destroy(),this.timepicker&&this.timepicker.destroy()}_addMobileAttributes(){j.addEventListener("click",this._onClickOverlay),this.$datepicker.classList.add("-is-mobile-"),this.$el.setAttribute("readonly",!0)}_removeMobileAttributes(){j.removeEventListener("click",this._onClickOverlay),this.$datepicker.classList.remove("-is-mobile-"),this.initialReadonly||""===this.initialReadonly||this.$el.removeAttribute("readonly")}_createMinMaxDates(){let{minDate:e,maxDate:t}=this.opts;this.minDate=!!e&&b(e),this.maxDate=!!t&&b(t)}_addTimepicker(){this.$timepicker=n({className:"air-datepicker--time"}),this.$datepicker.appendChild(this.$timepicker),this.timepicker=new L({dp:this,opts:this.opts}),this.$timepicker.appendChild(this.timepicker.$el)}_addButtons(){this.$buttons=n({className:"air-datepicker--buttons"}),this.$datepicker.appendChild(this.$buttons),this.buttons=new H({dp:this,opts:this.opts}),this.$buttons.appendChild(this.buttons.$el)}_bindSubEvents(){this.on(i.eventChangeSelectedDate,this._onChangeSelectedDate),this.on(i.eventChangeFocusDate,this._onChangeFocusedDate),this.on(i.eventChangeTime,this._onChangeTime)}_buildBaseHtml(){let{inline:e}=this.opts;var t,i;this.elIsInput?e?(t=this.$datepicker,(i=this.$el).parentNode.insertBefore(t,i.nextSibling)):this.$container.appendChild(this.$datepicker):this.$el.appendChild(this.$datepicker),this.$datepicker.innerHTML='<i class="air-datepicker--pointer"></i><div class="air-datepicker--navigation"></div><div class="air-datepicker--content"></div>',this.$content=a(".air-datepicker--content",this.$datepicker),this.$pointer=a(".air-datepicker--pointer",this.$datepicker),this.$nav=a(".air-datepicker--navigation",this.$datepicker)}_handleLocale(){let{locale:e,dateFormat:t,firstDay:i,timepicker:s,onlyTimepicker:a,timeFormat:n,dateTimeSeparator:r}=this.opts;var h;this.locale=(h=e,JSON.parse(JSON.stringify(h))),t&&(this.locale.dateFormat=t),void 0!==n&&""!==n&&(this.locale.timeFormat=n);let{timeFormat:o}=this.locale;if(""!==i&&(this.locale.firstDay=i),s&&"function"!=typeof t){let e=o?r:"";this.locale.dateFormat=[this.locale.dateFormat,o||""].join(e)}a&&"function"!=typeof t&&(this.locale.dateFormat=this.locale.timeFormat)}_setPositionClasses(e){if("function"==typeof e)return void this.$datepicker.classList.add("-custom-position-");let t=(e=e.split(" "))[0],i=`air-datepicker -${t}-${e[1]}- -from-${t}-`;this.$datepicker.classList.add(...i.split(" "))}_bindEvents(){this.$el.addEventListener(this.opts.showEvent,this._onFocus),this.$el.addEventListener("blur",this._onBlur),this.$datepicker.addEventListener("mousedown",this._onMouseDown),this.$datepicker.addEventListener("mouseup",this._onMouseUp),window.addEventListener("resize",this._onResize)}_limitViewDateByMaxMinDates(){let{viewDate:e,minDate:t,maxDate:i}=this;i&&m(e,i)&&this.setViewDate(i),t&&v(e,t)&&this.setViewDate(t)}formatDate(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.viewDate,t=arguments.length>1?arguments[1]:void 0;if(e=b(e),!(e instanceof Date))return;let i=t,s=this.locale,a=o(e),n=a.dayPeriod,r=c(e),h=R.replacer,l={T:e.getTime(),m:a.minutes,mm:a.fullMinutes,h:a.hours12,hh:a.fullHours12,H:a.hours,HH:a.fullHours,aa:n,AA:n.toUpperCase(),E:s.daysShort[a.day],EEEE:s.days[a.day],d:a.date,dd:a.fullDate,M:a.month+1,MM:a.fullMonth,MMM:s.monthsShort[a.month],MMMM:s.months[a.month],yy:a.year.toString().slice(-2),yyyy:a.year,yyyy1:r[0],yyyy2:r[1]};for(let[e,t]of Object.entries(l))i=h(i,$(e),t);return i}down(e){this._handleUpDownActions(e,"down")}up(e){this._handleUpDownActions(e,"up")}selectDate(e){let t,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{currentView:a,parsedViewDate:n,selectedDates:r}=this,{updateTime:h,silent:o}=s,{moveToOtherMonthsOnSelect:l,moveToOtherYearsOnSelect:d,multipleDates:c,range:u,autoClose:p,onBeforeSelect:v}=this.opts,g=r.length;if(Array.isArray(e))return e.forEach((e=>{this.selectDate(e,s)})),new Promise((e=>{setTimeout(e)}));if((e=b(e))instanceof Date){if(v&&!o&&!v({date:e,datepicker:this}))return Promise.resolve();if(a===i.days&&e.getMonth()!==n.month&&l&&(t=new Date(e.getFullYear(),e.getMonth(),1)),a===i.years&&e.getFullYear()!==n.year&&d&&(t=new Date(e.getFullYear(),0,1)),t&&this.setViewDate(t),c&&!u){if(g===c)return;this._checkIfDateIsSelected(e)||r.push(e)}else if(u)switch(g){case 1:r.push(e),this.rangeDateTo||(this.rangeDateTo=e),m(this.rangeDateFrom,this.rangeDateTo)&&(this.rangeDateTo=this.rangeDateFrom,this.rangeDateFrom=e),this.selectedDates=[this.rangeDateFrom,this.rangeDateTo];break;case 2:this.selectedDates=[e],this.rangeDateFrom=e,this.rangeDateTo="";break;default:this.selectedDates=[e],this.rangeDateFrom=e}else this.selectedDates=[e];return this.trigger(i.eventChangeSelectedDate,{action:i.actionSelectDate,silent:null==s?void 0:s.silent,date:e,updateTime:h}),this._updateLastSelectedDate(e),p&&!this.timepickerIsActive&&this.visible&&(c||u?u&&1===g&&this.hide():this.hide()),new Promise((e=>{setTimeout(e)}))}}unselectDate(e){let t=this.selectedDates,s=this;if((e=b(e))instanceof Date)return t.some(((a,n)=>{if(p(a,e))return t.splice(n,1),s.selectedDates.length?(s.rangeDateTo="",s.rangeDateFrom=t[0],s._updateLastSelectedDate(s.selectedDates[s.selectedDates.length-1])):(s.rangeDateFrom="",s.rangeDateTo="",s._updateLastSelectedDate(!1)),this.trigger(i.eventChangeSelectedDate,{action:i.actionUnselectDate,date:e}),!0}))}replaceDate(e,t){let s=this.selectedDates.find((t=>p(t,e,this.currentView))),a=this.selectedDates.indexOf(s);a<0||p(this.selectedDates[a],t,this.currentView)||(this.selectedDates[a]=t,this.trigger(i.eventChangeSelectedDate,{action:i.actionSelectDate,date:t,updateTime:!0}),this._updateLastSelectedDate(t))}clear(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.selectedDates=[],this.rangeDateFrom=!1,this.rangeDateTo=!1,this.lastSelectedDate=!1,this.trigger(i.eventChangeSelectedDate,{action:i.actionUnselectDate,silent:e.silent}),new Promise((e=>{setTimeout(e)}))}show(){let{onShow:e,isMobile:t}=this.opts;this._cancelScheduledCall(),this.visible||this.hideAnimation||this._createComponents(),this.setPosition(this.opts.position),this.$datepicker.classList.add("-active-"),this.visible=!0,e&&this._scheduleCallAfterTransition(e),t&&this._showMobileOverlay()}hide(){let{onHide:e,isMobile:t}=this.opts,i=this._hasTransition();this.visible=!1,this.hideAnimation=!0,this.$datepicker.classList.remove("-active-"),this.customHide&&this.customHide(),this.elIsInput&&this.$el.blur(),this._scheduleCallAfterTransition((t=>{!this.customHide&&(t&&i||!t&&!i)&&this._finishHide(),e&&e(t)})),t&&j.classList.remove("-active-")}_triggerOnSelect(){let e=[],t=[],{selectedDates:i,locale:s,opts:{onSelect:a,multipleDates:n,range:r}}=this,h=n||r,o="function"==typeof s.dateFormat;i.length&&(e=i.map(g),t=o?n?s.dateFormat(e):e.map((e=>s.dateFormat(e))):e.map((e=>this.formatDate(e,s.dateFormat)))),a({date:h?e:e[0],formattedDate:h?t:t[0],datepicker:this})}_handleAlreadySelectedDates(e,t){let{selectedDates:i,rangeDateFrom:s,rangeDateTo:a}=this,{range:n,toggleSelected:r}=this.opts,h=i.length,o="function"==typeof r?r({datepicker:this,date:t}):r,l=Boolean(n&&1===h&&e),d=l?g(t):t;n&&!o&&(2!==h&&this.selectDate(d),2===h&&p(s,a))||(o?this.unselectDate(d):this._updateLastSelectedDate(l?d:e))}_handleUpDownActions(e,t){if(!((e=b(e||this.focusDate||this.viewDate))instanceof Date))return;let i="up"===t?this.viewIndex+1:this.viewIndex-1;i>2&&(i=2),i<0&&(i=0),this.setViewDate(new Date(e.getFullYear(),e.getMonth(),1)),this.setCurrentView(this.viewIndexes[i])}getCell(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.day;if(!((e=b(e))instanceof Date))return;let{year:s,month:a,date:n}=o(e),r=`[data-year="${s}"]`,h=`[data-month="${a}"]`,l={[i.day]:`${r}${h}[data-date="${n}"]`,[i.month]:`${r}${h}`,[i.year]:`${r}`};return this.views[this.currentView]?this.views[this.currentView].$el.querySelector(l[t]):void 0}_showMobileOverlay(){j.classList.add("-active-")}_hasTransition(){return window.getComputedStyle(this.$datepicker).getPropertyValue("transition-duration").split(", ").reduce(((e,t)=>parseFloat(t)+e),0)>0}get shouldUpdateDOM(){return this.visible||this.treatAsInline}get parsedViewDate(){return o(this.viewDate)}get currentViewSingular(){return this.currentView.slice(0,-1)}get curDecade(){return c(this.viewDate)}get viewIndex(){return this.viewIndexes.indexOf(this.currentView)}get isFinalView(){return this.currentView===i.years}get hasSelectedDates(){return this.selectedDates.length>0}get isMinViewReached(){return this.currentView===this.opts.minView||this.currentView===i.days}get $container(){return this.$customContainer||P}static replacer(e,t,i){return e.replace(t,(function(e,t,s,a){return t+i+a}))}}var K;return I(R,"defaults",s),I(R,"version","3.6.0"),I(R,"defaultGlobalContainerId","air-datepicker-global-container"),K=R.prototype,Object.assign(K,N),t.default}()}));

/***/ }),

/***/ "./node_modules/air-datepicker/index.es.js":
/*!*************************************************!*\
  !*** ./node_modules/air-datepicker/index.es.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _air_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./air-datepicker */ "./node_modules/air-datepicker/air-datepicker.js");
/* harmony import */ var _air_datepicker__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_air_datepicker__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_air_datepicker__WEBPACK_IMPORTED_MODULE_0___default()));

/***/ }),

/***/ "./node_modules/air-datepicker/locale/de.js":
/*!**************************************************!*\
  !*** ./node_modules/air-datepicker/locale/de.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  daysShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
  daysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  today: 'Heute',
  clear: 'Löschen',
  dateFormat: 'dd.MM.yyyy',
  timeFormat: 'HH:mm',
  firstDay: 1
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/air-datepicker/locale/en.js":
/*!**************************************************!*\
  !*** ./node_modules/air-datepicker/locale/en.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today: 'Today',
  clear: 'Clear',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: 'hh:mm aa',
  firstDay: 0
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/air-datepicker/locale/ru.js":
/*!**************************************************!*\
  !*** ./node_modules/air-datepicker/locale/ru.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  daysShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
  daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  today: 'Сегодня',
  clear: 'Очистить',
  dateFormat: 'dd.MM.yyyy',
  timeFormat: 'HH:mm',
  firstDay: 1
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/air-datepicker/locale/uk.js":
/*!**************************************************!*\
  !*** ./node_modules/air-datepicker/locale/uk.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  days: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
  daysShort: ['Нед', 'Пнд', 'Вів', 'Срд', 'Чтв', 'Птн', 'Сбт'],
  daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
  monthsShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  today: 'Сьогодні',
  clear: 'Очистити',
  dateFormat: 'dd.MM.yyyy',
  timeFormat: 'HH:mm',
  firstDay: 1
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/air-datepicker/locale/zh.js":
/*!**************************************************!*\
  !*** ./node_modules/air-datepicker/locale/zh.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  daysShort: ['日', '一', '二', '三', '四', '五', '六'],
  daysMin: ['日', '一', '二', '三', '四', '五', '六'],
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  today: '今天',
  clear: '清除',
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm',
  firstDay: 1
};
exports["default"] = _default;

/***/ }),

/***/ "./resources/frontend/core/dom/forms.js":
/*!**********************************************!*\
  !*** ./resources/frontend/core/dom/forms.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPostForm": () => (/* binding */ createPostForm),
/* harmony export */   "submitForm": () => (/* binding */ submitForm),
/* harmony export */   "submitPostForm": () => (/* binding */ submitPostForm)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function createPostForm(document, url) {
  var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  assertDocument(document);
  assertUrl(url);
  assertParameters(parameters);
  var form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', url);
  Object.entries(parameters).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      value = _ref2[1];
    form.appendChild(createHiddenInput(document, name, value));
  });
  return form;
}
function submitPostForm(document, url) {
  var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var form = createPostForm(document, url, parameters);
  document.body.appendChild(form);
  submitForm(form);
  return form;
}
function submitForm(form) {
  if (typeof (form === null || form === void 0 ? void 0 : form.requestSubmit) === 'function') {
    return form.requestSubmit();
  }
  if (typeof (form === null || form === void 0 ? void 0 : form.submit) === 'function') {
    return form.submit();
  }
  throw new TypeError('Form submission requires requestSubmit() or submit().');
}
function createHiddenInput(document, name, value) {
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', name);
  input.setAttribute('value', String(value));
  return input;
}
function assertDocument(document) {
  if (!(document !== null && document !== void 0 && document.body) || typeof document.createElement !== 'function') {
    throw new TypeError('Form creation requires a document with a body element.');
  }
}
function assertUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('Form action URL must be a non-empty string.');
  }
}
function assertParameters(parameters) {
  if (!parameters || _typeof(parameters) !== 'object' || Array.isArray(parameters)) {
    throw new TypeError('Form parameters must be an object.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/dom/listeners.js":
/*!**************************************************!*\
  !*** ./resources/frontend/core/dom/listeners.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delegate": () => (/* binding */ delegate),
/* harmony export */   "listen": () => (/* binding */ listen)
/* harmony export */ });
function listen(target, type, listener, options) {
  assertEventTarget(target);
  assertEventType(type);
  assertListener(listener);
  target.addEventListener(type, listener, options);
  return function () {
    return target.removeEventListener(type, listener, options);
  };
}
function delegate(root, type, selector, listener, options) {
  assertDelegationRoot(root);
  assertSelector(selector);
  assertListener(listener);
  return listen(root, type, function (event) {
    return invokeDelegate(event, root, selector, listener);
  }, options);
}
function invokeDelegate(event, root, selector, listener) {
  var matched = findDelegateTarget(event.target, root, selector);
  if (matched) {
    listener.call(matched, event, matched);
  }
}
function findDelegateTarget(target, root, selector) {
  var element = closestElement(target);
  var matched = element === null || element === void 0 ? void 0 : element.closest(selector);
  return matched && root.contains(matched) ? matched : null;
}
function closestElement(target) {
  var _target$parentElement;
  if (typeof (target === null || target === void 0 ? void 0 : target.closest) === 'function') {
    return target;
  }
  return (_target$parentElement = target === null || target === void 0 ? void 0 : target.parentElement) !== null && _target$parentElement !== void 0 ? _target$parentElement : null;
}
function assertEventTarget(target) {
  if (typeof (target === null || target === void 0 ? void 0 : target.addEventListener) !== 'function' || typeof (target === null || target === void 0 ? void 0 : target.removeEventListener) !== 'function') {
    throw new TypeError('Event target must support addEventListener and removeEventListener.');
  }
}
function assertDelegationRoot(root) {
  assertEventTarget(root);
  if (typeof root.contains !== 'function') {
    throw new TypeError('Delegation root must support contains().');
  }
}
function assertEventType(type) {
  if (typeof type !== 'string' || type.length === 0) {
    throw new TypeError('Event type must be a non-empty string.');
  }
}
function assertSelector(selector) {
  if (typeof selector !== 'string' || selector.length === 0) {
    throw new TypeError('Delegated selector must be a non-empty string.');
  }
}
function assertListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('Event listener must be a function.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/lifecycle/component-lifecycle.js":
/*!******************************************************************!*\
  !*** ./resources/frontend/core/lifecycle/component-lifecycle.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentLifecycle": () => (/* binding */ ComponentLifecycle),
/* harmony export */   "componentMountSkipped": () => (/* binding */ componentMountSkipped),
/* harmony export */   "createComponentLifecycle": () => (/* binding */ createComponentLifecycle)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var componentMountSkipped = Symbol["for"]('sleepingowl.component-mount-skipped');
var ComponentLifecycle = /*#__PURE__*/function () {
  function ComponentLifecycle() {
    _classCallCheck(this, ComponentLifecycle);
    this.definitions = [];
    this.definitionsByName = new Map();
    this.records = new Set();
    this.recordsByElement = new WeakMap();
  }
  return _createClass(ComponentLifecycle, [{
    key: "register",
    value: function register(definition) {
      var _this = this;
      var normalized = normalizeDefinition(definition);
      if (this.definitionsByName.has(normalized.name)) {
        throw new Error("Component ".concat(normalized.name, " is already registered."));
      }
      this.definitions.push(normalized);
      this.definitionsByName.set(normalized.name, normalized);
      return function () {
        return _this.unregister(normalized.name);
      };
    }
  }, {
    key: "unregister",
    value: function unregister(name) {
      var definition = this.definitionsByName.get(name);
      if (!definition) return false;
      this.definitions = this.definitions.filter(function (item) {
        return item !== definition;
      });
      this.definitionsByName["delete"](name);
      this.destroyRecords(recordsForDefinition(this.records, definition));
      return true;
    }
  }, {
    key: "scan",
    value: function scan() {
      var _this2 = this;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis.document;
      var name = arguments.length > 1 ? arguments[1] : undefined;
      assertRoot(root);
      return this.resolveDefinitions(name).reduce(function (count, definition) {
        return count + matchingElements(root, definition.selector).reduce(function (mounted, element) {
          return mounted + _this2.mountDefinition(element, definition);
        }, 0);
      }, 0);
    }
  }, {
    key: "mount",
    value: function mount(element) {
      var _this3 = this;
      assertElement(element);
      return this.definitions.reduce(function (count, definition) {
        return count + (element.matches(definition.selector) ? _this3.mountDefinition(element, definition) : 0);
      }, 0);
    }
  }, {
    key: "destroy",
    value: function destroy(root, name) {
      assertRoot(root);
      return this.destroyRecords(recordsInside(this.records, root, name));
    }
  }, {
    key: "get",
    value: function get(element, name) {
      var _this$recordsByElemen;
      return (_this$recordsByElemen = this.recordsByElement.get(element)) === null || _this$recordsByElemen === void 0 || (_this$recordsByElemen = _this$recordsByElemen.get(name)) === null || _this$recordsByElemen === void 0 ? void 0 : _this$recordsByElemen.instance;
    }
  }, {
    key: "mountDefinition",
    value: function mountDefinition(element, definition) {
      var _this$recordsByElemen2;
      if ((_this$recordsByElemen2 = this.recordsByElement.get(element)) !== null && _this$recordsByElemen2 !== void 0 && _this$recordsByElemen2.has(definition.name)) return 0;
      var record = {
        definition: definition,
        element: element,
        instance: undefined
      };
      this.track(record);
      try {
        record.instance = definition.mount(element);
      } catch (error) {
        this.untrack(record);
        throw error;
      }
      if (record.instance === componentMountSkipped) {
        this.untrack(record);
        return 0;
      }
      return 1;
    }
  }, {
    key: "resolveDefinitions",
    value: function resolveDefinitions(name) {
      if (name === undefined) return this.definitions;
      var definition = this.definitionsByName.get(name);
      return definition ? [definition] : [];
    }
  }, {
    key: "destroyRecords",
    value: function destroyRecords(records) {
      var _this4 = this;
      var errors = [];
      records.forEach(function (record) {
        if (!_this4.records.has(record)) return;
        _this4.untrack(record);
        try {
          destroyRecord(record);
        } catch (error) {
          errors.push(error);
        }
      });
      throwCleanupErrors(errors);
      return records.length;
    }
  }, {
    key: "track",
    value: function track(record) {
      var _this$recordsByElemen3;
      var elementRecords = (_this$recordsByElemen3 = this.recordsByElement.get(record.element)) !== null && _this$recordsByElemen3 !== void 0 ? _this$recordsByElemen3 : new Map();
      elementRecords.set(record.definition.name, record);
      this.recordsByElement.set(record.element, elementRecords);
      this.records.add(record);
    }
  }, {
    key: "untrack",
    value: function untrack(record) {
      var elementRecords = this.recordsByElement.get(record.element);
      elementRecords === null || elementRecords === void 0 || elementRecords["delete"](record.definition.name);
      if ((elementRecords === null || elementRecords === void 0 ? void 0 : elementRecords.size) === 0) this.recordsByElement["delete"](record.element);
      this.records["delete"](record);
    }
  }]);
}();
function createComponentLifecycle() {
  return new ComponentLifecycle();
}
function normalizeDefinition(definition) {
  var _definition$destroy;
  if (!definition || _typeof(definition) !== 'object') {
    throw new TypeError('Component definition must be an object.');
  }
  assertNonEmptyString(definition.name, 'name');
  assertNonEmptyString(definition.selector, 'selector');
  if (typeof definition.mount !== 'function') {
    throw new TypeError('Component definition mount must be a function.');
  }
  if (definition.destroy !== undefined && typeof definition.destroy !== 'function') {
    throw new TypeError('Component definition destroy must be a function when provided.');
  }
  return Object.freeze({
    destroy: (_definition$destroy = definition.destroy) !== null && _definition$destroy !== void 0 ? _definition$destroy : null,
    mount: definition.mount,
    name: definition.name,
    selector: definition.selector
  });
}
function matchingElements(root, selector) {
  var descendants = _toConsumableArray(root.querySelectorAll(selector));
  if (typeof root.matches === 'function' && root.matches(selector)) descendants.unshift(root);
  return descendants;
}
function recordsInside(records, root, name) {
  return _toConsumableArray(records).filter(function (record) {
    return root === record.element || root.contains(record.element);
  }).filter(function (record) {
    return name === undefined || record.definition.name === name;
  }).reverse();
}
function recordsForDefinition(records, definition) {
  return _toConsumableArray(records).filter(function (record) {
    return record.definition === definition;
  }).reverse();
}
function destroyRecord(_ref) {
  var definition = _ref.definition,
    element = _ref.element,
    instance = _ref.instance;
  if (definition.destroy) return definition.destroy(element, instance);
  if (typeof instance === 'function') return instance();
  if (typeof (instance === null || instance === void 0 ? void 0 : instance.destroy) === 'function') return instance.destroy();
}
function throwCleanupErrors(errors) {
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) {
    throw new AggregateError(errors, 'Multiple component destroy callbacks failed.');
  }
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.querySelectorAll) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.contains) !== 'function') {
    throw new TypeError('Component lifecycle root must be a DOM query root.');
  }
}
function assertElement(element) {
  if (!element || element.nodeType !== 1 || typeof element.matches !== 'function') {
    throw new TypeError('Component lifecycle mount requires an Element.');
  }
}
function assertNonEmptyString(value, field) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError("Component definition ".concat(field, " must be a non-empty string."));
  }
}

/***/ }),

/***/ "./resources/frontend/features/forms/actions/form-buttons.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/forms/actions/form-buttons.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindFormButtons": () => (/* binding */ bindFormButtons)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
/* harmony import */ var _core_dom_forms_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/dom/forms.js */ "./resources/frontend/core/dom/forms.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


var BUTTON_SELECTOR = ['.form-buttons button.btn-delete', '.form-buttons button.btn-destroy', '.form-buttons button.btn-restore'].join(', ');
function bindFormButtons(_ref) {
  var document = _ref.document,
    events = _ref.events,
    messages = _ref.messages,
    questions = _ref.questions,
    root = _ref.root,
    token = _ref.token;
  assertDependencies({
    document: document,
    events: events,
    messages: messages,
    questions: questions,
    token: token
  });
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(root, 'click', BUTTON_SELECTOR, function (event, button) {
    void handleFormButton(event, button, {
      document: document,
      events: events,
      messages: messages,
      questions: questions,
      token: token
    });
  });
}
function handleFormButton(_x, _x2, _x3) {
  return _handleFormButton.apply(this, arguments);
}
function _handleFormButton() {
  _handleFormButton = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event, button, dependencies) {
    var action, result;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          event.preventDefault();
          action = buttonAction(button, dependencies.questions);
          if (action.question) {
            _context.n = 1;
            break;
          }
          submitButtonAction(button, action, dependencies);
          return _context.a(2);
        case 1:
          _context.n = 2;
          return dependencies.messages.confirm(action.question, null, button);
        case 2:
          result = _context.v;
          if (result !== null && result !== void 0 && result.value) {
            _context.n = 3;
            break;
          }
          dependencies.events.fire('datatables::confirm::cancel', button);
          return _context.a(2);
        case 3:
          dependencies.events.fire('datatables::confirm::submitting', button);
          submitButtonAction(button, action, dependencies);
          dependencies.events.fire('datatables::confirm::submitted', button);
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _handleFormButton.apply(this, arguments);
}
function submitButtonAction(button, action, _ref2) {
  var document = _ref2.document,
    events = _ref2.events,
    token = _ref2.token;
  var parameters = {
    _token: token
  };
  if (action.method) {
    parameters._method = action.method;
  }
  if (button.dataset.redirect !== undefined) {
    parameters._redirectBack = button.dataset.redirect;
  }
  events.fire('datatables::confirm::submitting::data', parameters);
  var form = (0,_core_dom_forms_js__WEBPACK_IMPORTED_MODULE_1__.submitPostForm)(document, button.dataset.url, parameters);
  events.fire('datatables::confirm::submitted::data', parameters);
  return form;
}
function buttonAction(button, questions) {
  if (button.classList.contains('btn-delete')) {
    return {
      method: 'DELETE',
      question: questions["delete"]
    };
  }
  if (button.classList.contains('btn-destroy')) {
    return {
      method: 'DELETE',
      question: questions.destroy
    };
  }
  return {
    method: null,
    question: null
  };
}
function assertDependencies(_ref3) {
  var document = _ref3.document,
    events = _ref3.events,
    messages = _ref3.messages,
    questions = _ref3.questions,
    token = _ref3.token;
  if (!document || typeof (events === null || events === void 0 ? void 0 : events.fire) !== 'function') {
    throw new TypeError('Form buttons require document and event bus dependencies.');
  }
  if (typeof (messages === null || messages === void 0 ? void 0 : messages.confirm) !== 'function') {
    throw new TypeError('Form buttons require a confirmation service.');
  }
  if (!questions || typeof token !== 'string') {
    throw new TypeError('Form buttons require questions and a CSRF token.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/date-control.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-control.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DATE_CONTROL_COMPONENT": () => (/* binding */ DATE_CONTROL_COMPONENT),
/* harmony export */   "DATE_CONTROL_SELECTOR": () => (/* binding */ DATE_CONTROL_SELECTOR),
/* harmony export */   "createDateControlDefinition": () => (/* binding */ createDateControlDefinition),
/* harmony export */   "mountDateControl": () => (/* binding */ mountDateControl)
/* harmony export */ });
/* harmony import */ var _core_lifecycle_component_lifecycle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/lifecycle/component-lifecycle.js */ "./resources/frontend/core/lifecycle/component-lifecycle.js");
/* harmony import */ var _date_options_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./date-options.js */ "./resources/frontend/features/forms/date/date-options.js");


var DATE_CONTROL_COMPONENT = 'date-control';
var DATE_CONTROL_SELECTOR = 'input[data-soa-date-control]';
function createDateControlDefinition(Datepicker, locale) {
  if (typeof Datepicker !== 'function') {
    throw new TypeError('Date controls require an Air Datepicker constructor.');
  }
  return {
    name: DATE_CONTROL_COMPONENT,
    selector: DATE_CONTROL_SELECTOR,
    mount: function mount(input) {
      return mountDateControl(input, Datepicker, locale);
    }
  };
}
function mountDateControl(input, Datepicker, locale) {
  if (input.disabled || input.readOnly) return _core_lifecycle_component_lifecycle_js__WEBPACK_IMPORTED_MODULE_0__.componentMountSkipped;
  var picker = new Datepicker(input, (0,_date_options_js__WEBPACK_IMPORTED_MODULE_1__.createDatePickerOptions)(input, locale));
  var addon = findAddon(input);
  var show = function show(event) {
    event.preventDefault();
    input.focus();
    picker.show();
  };
  addon === null || addon === void 0 || addon.addEventListener('click', show);
  return {
    destroy: function destroy() {
      addon === null || addon === void 0 || addon.removeEventListener('click', show);
      picker.destroy();
    },
    picker: picker
  };
}
function findAddon(input) {
  var _input$closest;
  return (_input$closest = input.closest('.input-date')) === null || _input$closest === void 0 ? void 0 : _input$closest.querySelector('.input-group-addon, .input-group-prepend');
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/date-format.js":
/*!***************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-format.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatDateValue": () => (/* binding */ formatDateValue),
/* harmony export */   "parseDateValue": () => (/* binding */ parseDateValue),
/* harmony export */   "toAirDateFormat": () => (/* binding */ toAirDateFormat)
/* harmony export */ });
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var FORMAT_TOKENS = /\[[^\]]*]|YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a|./g;
var AIR_FORMAT_TOKENS = Object.freeze({
  D: 'd',
  DD: 'dd',
  M: 'M',
  MM: 'MM',
  MMM: 'MMM',
  MMMM: 'MMMM',
  YY: 'yy',
  YYYY: 'yyyy'
});
var DATE_PART_READERS = Object.freeze({
  D: ['day', numberValue],
  DD: ['day', numberValue],
  H: ['hour', numberValue],
  HH: ['hour', numberValue],
  h: ['hour', numberValue],
  hh: ['hour', numberValue],
  M: ['month', numberValue],
  MM: ['month', numberValue],
  MMM: ['month', function (value, locale) {
    return namedMonth(value, locale.monthsShort);
  }],
  MMMM: ['month', function (value, locale) {
    return namedMonth(value, locale.months);
  }],
  m: ['minute', numberValue],
  mm: ['minute', numberValue],
  s: ['second', numberValue],
  ss: ['second', numberValue],
  YY: ['year', function (value) {
    return 2000 + Number(value);
  }],
  YYYY: ['year', numberValue]
});
function formatDateValue(date, format) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!isValidDate(date)) return '';
  var values = dateTokenValues(date, locale);
  return tokenize(format).map(function (token) {
    var _values$token;
    return (_values$token = values[token]) !== null && _values$token !== void 0 ? _values$token : literalValue(token);
  }).join('');
}
function parseDateValue(value, format) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var input = String(value !== null && value !== void 0 ? value : '').trim();
  if (!input) return null;
  var parsed = parseFormattedDate(input, format, locale);
  if (parsed) return parsed;
  return parseIsoDate(input);
}
function toAirDateFormat(format) {
  return tokenize(format).map(function (token) {
    var _AIR_FORMAT_TOKENS$to;
    return (_AIR_FORMAT_TOKENS$to = AIR_FORMAT_TOKENS[token]) !== null && _AIR_FORMAT_TOKENS$to !== void 0 ? _AIR_FORMAT_TOKENS$to : literalValue(token);
  }).join('');
}
function parseFormattedDate(value, format, locale) {
  var captures = [];
  var source = tokenize(format).map(function (token) {
    return tokenPattern(token, captures, locale);
  }).join('');
  var match = new RegExp("^".concat(source, "$"), 'iu').exec(value);
  if (!match) return null;
  return dateFromCaptures(captures, match.slice(1), locale);
}
function tokenPattern(token, captures, locale) {
  var patterns = {
    A: '(AM|PM)',
    a: '(am|pm)',
    D: '(\\d{1,2})',
    DD: '(\\d{2})',
    H: '(\\d{1,2})',
    HH: '(\\d{2})',
    h: '(\\d{1,2})',
    hh: '(\\d{2})',
    M: '(\\d{1,2})',
    MM: '(\\d{2})',
    MMM: namedMonthPattern(locale.monthsShort),
    MMMM: namedMonthPattern(locale.months),
    m: '(\\d{1,2})',
    mm: '(\\d{2})',
    s: '(\\d{1,2})',
    ss: '(\\d{2})',
    YY: '(\\d{2})',
    YYYY: '(\\d{4})'
  };
  if (!patterns[token]) return escapeRegExp(literalValue(token));
  captures.push(token);
  return patterns[token];
}
function dateFromCaptures(tokens, values, locale) {
  var now = new Date();
  var parts = {
    day: 1,
    hour: 0,
    minute: 0,
    month: 1,
    second: 0,
    year: now.getFullYear()
  };
  var period = null;
  tokens.forEach(function (token, index) {
    var value = values[index];
    if (token === 'A' || token === 'a') period = value.toLowerCase();else assignDatePart(parts, token, value, locale);
  });
  parts.hour = normalizeTwelveHour(parts.hour, period);
  var date = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return matchesParts(date, parts) ? date : null;
}
function assignDatePart(parts, token, value, locale) {
  var _DATE_PART_READERS$to = _slicedToArray(DATE_PART_READERS[token], 2),
    field = _DATE_PART_READERS$to[0],
    read = _DATE_PART_READERS$to[1];
  parts[field] = read(value, locale);
}
function dateTokenValues(date, locale) {
  var _locale$monthsShort$d, _locale$monthsShort, _locale$months$date$g, _locale$months;
  var hour = date.getHours();
  var hour12 = hour % 12 || 12;
  return {
    A: hour >= 12 ? 'PM' : 'AM',
    a: hour >= 12 ? 'pm' : 'am',
    D: String(date.getDate()),
    DD: pad(date.getDate()),
    H: String(hour),
    HH: pad(hour),
    h: String(hour12),
    hh: pad(hour12),
    M: String(date.getMonth() + 1),
    MM: pad(date.getMonth() + 1),
    MMM: (_locale$monthsShort$d = (_locale$monthsShort = locale.monthsShort) === null || _locale$monthsShort === void 0 ? void 0 : _locale$monthsShort[date.getMonth()]) !== null && _locale$monthsShort$d !== void 0 ? _locale$monthsShort$d : pad(date.getMonth() + 1),
    MMMM: (_locale$months$date$g = (_locale$months = locale.months) === null || _locale$months === void 0 ? void 0 : _locale$months[date.getMonth()]) !== null && _locale$months$date$g !== void 0 ? _locale$months$date$g : pad(date.getMonth() + 1),
    m: String(date.getMinutes()),
    mm: pad(date.getMinutes()),
    s: String(date.getSeconds()),
    ss: pad(date.getSeconds()),
    YY: String(date.getFullYear()).slice(-2),
    YYYY: String(date.getFullYear())
  };
}
function matchesParts(date, parts) {
  return isValidDate(date) && date.getFullYear() === parts.year && date.getMonth() === parts.month - 1 && date.getDate() === parts.day && date.getHours() === parts.hour && date.getMinutes() === parts.minute && date.getSeconds() === parts.second;
}
function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}(?:[T ][0-2]\d:[0-5]\d(?::[0-5]\d)?)?$/.test(value)) return null;
  var date = new Date(value.replace(' ', 'T'));
  return isValidDate(date) ? date : null;
}
function namedMonthPattern() {
  var months = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return months.length ? "(".concat(months.map(escapeRegExp).join('|'), ")") : '([^\\d]+)';
}
function namedMonth(value) {
  var months = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return months.findIndex(function (month) {
    return month.toLocaleLowerCase() === value.toLocaleLowerCase();
  }) + 1;
}
function numberValue(value) {
  return Number(value);
}
function normalizeTwelveHour(hour, period) {
  if (!period) return hour;
  if (hour < 1 || hour > 12) return -1;
  if (period === 'am') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}
function tokenize(format) {
  var _String$match;
  return (_String$match = String(format !== null && format !== void 0 ? format : '').match(FORMAT_TOKENS)) !== null && _String$match !== void 0 ? _String$match : [];
}
function literalValue(token) {
  return token.startsWith('[') && token.endsWith(']') ? token.slice(1, -1) : token;
}
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function pad(value) {
  return String(value).padStart(2, '0');
}
function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/date-locales.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-locales.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveDatePickerLocale": () => (/* binding */ resolveDatePickerLocale)
/* harmony export */ });
/* harmony import */ var air_datepicker_locale_de__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! air-datepicker/locale/de */ "./node_modules/air-datepicker/locale/de.js");
/* harmony import */ var air_datepicker_locale_en__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! air-datepicker/locale/en */ "./node_modules/air-datepicker/locale/en.js");
/* harmony import */ var air_datepicker_locale_ru__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! air-datepicker/locale/ru */ "./node_modules/air-datepicker/locale/ru.js");
/* harmony import */ var air_datepicker_locale_uk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! air-datepicker/locale/uk */ "./node_modules/air-datepicker/locale/uk.js");
/* harmony import */ var air_datepicker_locale_zh__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! air-datepicker/locale/zh */ "./node_modules/air-datepicker/locale/zh.js");





var DATE_PICKER_LOCALES = Object.freeze({
  de: air_datepicker_locale_de__WEBPACK_IMPORTED_MODULE_0__["default"],
  en: air_datepicker_locale_en__WEBPACK_IMPORTED_MODULE_1__["default"],
  ru: air_datepicker_locale_ru__WEBPACK_IMPORTED_MODULE_2__["default"],
  uk: air_datepicker_locale_uk__WEBPACK_IMPORTED_MODULE_3__["default"],
  zh: air_datepicker_locale_zh__WEBPACK_IMPORTED_MODULE_4__["default"]
});
function resolveDatePickerLocale(locale) {
  var _DATE_PICKER_LOCALES$;
  var normalized = normalizeLocale(locale);
  return (_DATE_PICKER_LOCALES$ = DATE_PICKER_LOCALES[normalized]) !== null && _DATE_PICKER_LOCALES$ !== void 0 ? _DATE_PICKER_LOCALES$ : air_datepicker_locale_en__WEBPACK_IMPORTED_MODULE_1__["default"];
}
function normalizeLocale(locale) {
  var value = String(locale !== null && locale !== void 0 ? locale : 'en').toLowerCase();
  if (value.startsWith('zh')) return 'zh';
  return value.split(/[-_]/, 1)[0];
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/date-options.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-options.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DATE_CONTROL_TYPES": () => (/* binding */ DATE_CONTROL_TYPES),
/* harmony export */   "createDatePickerOptions": () => (/* binding */ createDatePickerOptions)
/* harmony export */ });
/* harmony import */ var _date_format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./date-format.js */ "./resources/frontend/features/forms/date/date-format.js");
/* harmony import */ var _date_range_options_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./date-range-options.js */ "./resources/frontend/features/forms/date/date-range-options.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var DATE_CONTROL_TYPES = Object.freeze(['date', 'datetime', 'time', 'daterange']);
function createDatePickerOptions(input, locale) {
  var type = input.dataset.soaDateControl;
  assertControlType(type);
  var format = input.dataset.dateFormat || defaultFormat(type);
  var selectedDate = (0,_date_format_js__WEBPACK_IMPORTED_MODULE_0__.parseDateValue)(input.value, format, locale);
  var options = {
    autoClose: type === 'date',
    dateFormat: function dateFormat(date) {
      return (0,_date_format_js__WEBPACK_IMPORTED_MODULE_0__.formatDateValue)(date, format, locale);
    },
    locale: locale,
    selectedDates: selectedDate ? [selectedDate] : false
  };
  if (type === 'daterange') {
    return _objectSpread(_objectSpread({}, options), (0,_date_range_options_js__WEBPACK_IMPORTED_MODULE_1__.createDateRangeOptions)(input, format, locale));
  }
  if (type === 'datetime' || type === 'time') options.timepicker = true;
  if (type === 'time') options.onlyTimepicker = true;
  return options;
}
function defaultFormat(type) {
  if (type === 'time') return 'HH:mm';
  if (type === 'datetime') return 'DD.MM.YYYY HH:mm';
  return 'DD.MM.YYYY';
}
function assertControlType(type) {
  if (!DATE_CONTROL_TYPES.includes(type)) {
    throw new TypeError("Unsupported date control type [".concat(type !== null && type !== void 0 ? type : '', "]."));
  }
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/date-range-options.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-range-options.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DATE_RANGE_SEPARATOR": () => (/* binding */ DATE_RANGE_SEPARATOR),
/* harmony export */   "createDateRangeOptions": () => (/* binding */ createDateRangeOptions),
/* harmony export */   "parseDateRangeValue": () => (/* binding */ parseDateRangeValue)
/* harmony export */ });
/* harmony import */ var _date_format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./date-format.js */ "./resources/frontend/features/forms/date/date-format.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

var DATE_RANGE_SEPARATOR = ' - ';
function createDateRangeOptions(input, format, locale) {
  var selectedDates = rangeDates(input, format, locale);
  var maxSpan = parseMaxSpan(input.dataset.maxSpan);
  return {
    autoClose: input.dataset.autoApply === 'true',
    dateFormat: (0,_date_format_js__WEBPACK_IMPORTED_MODULE_0__.toAirDateFormat)(format),
    maxDate: constraintDate(input.dataset.maxDate, format, locale),
    minDate: constraintDate(input.dataset.minDate, format, locale),
    multipleDatesSeparator: DATE_RANGE_SEPARATOR,
    onBeforeSelect: maxSpan ? withinMaxSpan(maxSpan) : undefined,
    position: pickerPosition(input.dataset.opens, input.dataset.drops),
    range: true,
    selectedDates: selectedDates.length ? selectedDates : false
  };
}
function parseDateRangeValue(value, format, locale) {
  return String(value !== null && value !== void 0 ? value : '').split(DATE_RANGE_SEPARATOR, 2).map(function (part) {
    return (0,_date_format_js__WEBPACK_IMPORTED_MODULE_0__.parseDateValue)(part, format, locale);
  }).filter(Boolean);
}
function rangeDates(input, format, locale) {
  var current = parseDateRangeValue(input.value, format, locale);
  if (current.length) return current;
  return [input.dataset.startDate, input.dataset.endDate].map(function (value) {
    return constraintDate(value, format, locale);
  }).filter(Boolean);
}
function constraintDate(value, format, locale) {
  return value ? (0,_date_format_js__WEBPACK_IMPORTED_MODULE_0__.parseDateValue)(value, format, locale) || false : false;
}
function parseMaxSpan(value) {
  if (!value) return null;
  try {
    var parsed = JSON.parse(value);
    return parsed && _typeof(parsed) === 'object' ? parsed : null;
  } catch (_unused) {
    return null;
  }
}
function withinMaxSpan(span) {
  return function (_ref) {
    var datepicker = _ref.datepicker,
      date = _ref.date;
    var start = datepicker.selectedDates[0];
    if (!start || datepicker.selectedDates.length > 1) return true;
    return date >= shiftDate(start, span, -1) && date <= shiftDate(start, span, 1);
  };
}
function shiftDate(value, span, direction) {
  var date = new Date(value.getTime());
  date.setFullYear(date.getFullYear() + number(span.years) * direction);
  date.setMonth(date.getMonth() + number(span.months) * direction);
  date.setDate(date.getDate() + (number(span.weeks) * 7 + number(span.days)) * direction);
  date.setHours(date.getHours() + number(span.hours) * direction);
  date.setMinutes(date.getMinutes() + number(span.minutes) * direction);
  date.setSeconds(date.getSeconds() + number(span.seconds) * direction);
  date.setMilliseconds(date.getMilliseconds() + number(span.milliseconds) * direction);
  return date;
}
function pickerPosition() {
  var opens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
  var drops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
  var vertical = drops === 'up' ? 'top' : 'bottom';
  if (opens === 'center') return vertical;
  return "".concat(vertical, " ").concat(opens === 'left' ? 'right' : 'left');
}
function number(value) {
  var parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/***/ }),

/***/ "./resources/frontend/features/forms/date/install-date-controls.js":
/*!*************************************************************************!*\
  !*** ./resources/frontend/features/forms/date/install-date-controls.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LEGACY_DATE_MODULES": () => (/* binding */ LEGACY_DATE_MODULES),
/* harmony export */   "installDateControls": () => (/* binding */ installDateControls)
/* harmony export */ });
/* harmony import */ var air_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! air-datepicker */ "./node_modules/air-datepicker/index.es.js");
/* harmony import */ var _date_control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./date-control.js */ "./resources/frontend/features/forms/date/date-control.js");
/* harmony import */ var _date_locales_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./date-locales.js */ "./resources/frontend/features/forms/date/date-locales.js");



var LEGACY_DATE_MODULES = Object.freeze(['form.elements.date', 'form.elements.datetime', 'form.elements.daterange']);
function installDateControls(admin) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$Datepicker = _ref.Datepicker,
    Datepicker = _ref$Datepicker === void 0 ? air_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"] : _ref$Datepicker,
    _ref$root = _ref.root,
    root = _ref$root === void 0 ? globalThis.document : _ref$root;
  assertAdminServices(admin);
  var definition = (0,_date_control_js__WEBPACK_IMPORTED_MODULE_1__.createDateControlDefinition)(Datepicker, (0,_date_locales_js__WEBPACK_IMPORTED_MODULE_2__.resolveDatePickerLocale)(admin.locale));
  admin.Components.register(definition);
  var scan = function scan() {
    return admin.Components.scan(root, _date_control_js__WEBPACK_IMPORTED_MODULE_1__.DATE_CONTROL_COMPONENT);
  };
  LEGACY_DATE_MODULES.forEach(function (name) {
    return admin.Modules.register(name, scan);
  });
  return definition;
}
function assertAdminServices(admin) {
  var _admin$Components, _admin$Modules;
  if (typeof (admin === null || admin === void 0 || (_admin$Components = admin.Components) === null || _admin$Components === void 0 ? void 0 : _admin$Components.register) !== 'function') {
    throw new TypeError('Date controls require Admin.Components.');
  }
  if (typeof (admin === null || admin === void 0 || (_admin$Modules = admin.Modules) === null || _admin$Modules === void 0 ? void 0 : _admin$Modules.register) !== 'function') {
    throw new TypeError('Date controls require Admin.Modules compatibility registry.');
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************!*\
  !*** ./resources/frontend/features/forms/index.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DATE_CONTROL_COMPONENT": () => (/* reexport safe */ _date_date_control_js__WEBPACK_IMPORTED_MODULE_1__.DATE_CONTROL_COMPONENT),
/* harmony export */   "DATE_CONTROL_SELECTOR": () => (/* reexport safe */ _date_date_control_js__WEBPACK_IMPORTED_MODULE_1__.DATE_CONTROL_SELECTOR),
/* harmony export */   "DATE_CONTROL_TYPES": () => (/* reexport safe */ _date_date_options_js__WEBPACK_IMPORTED_MODULE_4__.DATE_CONTROL_TYPES),
/* harmony export */   "DATE_RANGE_SEPARATOR": () => (/* reexport safe */ _date_date_range_options_js__WEBPACK_IMPORTED_MODULE_5__.DATE_RANGE_SEPARATOR),
/* harmony export */   "FORM_FEATURE_ID": () => (/* binding */ FORM_FEATURE_ID),
/* harmony export */   "LEGACY_DATE_MODULES": () => (/* reexport safe */ _date_install_date_controls_js__WEBPACK_IMPORTED_MODULE_6__.LEGACY_DATE_MODULES),
/* harmony export */   "bindFormButtons": () => (/* reexport safe */ _actions_form_buttons_js__WEBPACK_IMPORTED_MODULE_0__.bindFormButtons),
/* harmony export */   "createDateControlDefinition": () => (/* reexport safe */ _date_date_control_js__WEBPACK_IMPORTED_MODULE_1__.createDateControlDefinition),
/* harmony export */   "createDatePickerOptions": () => (/* reexport safe */ _date_date_options_js__WEBPACK_IMPORTED_MODULE_4__.createDatePickerOptions),
/* harmony export */   "createDateRangeOptions": () => (/* reexport safe */ _date_date_range_options_js__WEBPACK_IMPORTED_MODULE_5__.createDateRangeOptions),
/* harmony export */   "formatDateValue": () => (/* reexport safe */ _date_date_format_js__WEBPACK_IMPORTED_MODULE_2__.formatDateValue),
/* harmony export */   "installDateControls": () => (/* reexport safe */ _date_install_date_controls_js__WEBPACK_IMPORTED_MODULE_6__.installDateControls),
/* harmony export */   "mountDateControl": () => (/* reexport safe */ _date_date_control_js__WEBPACK_IMPORTED_MODULE_1__.mountDateControl),
/* harmony export */   "parseDateRangeValue": () => (/* reexport safe */ _date_date_range_options_js__WEBPACK_IMPORTED_MODULE_5__.parseDateRangeValue),
/* harmony export */   "parseDateValue": () => (/* reexport safe */ _date_date_format_js__WEBPACK_IMPORTED_MODULE_2__.parseDateValue),
/* harmony export */   "resolveDatePickerLocale": () => (/* reexport safe */ _date_date_locales_js__WEBPACK_IMPORTED_MODULE_3__.resolveDatePickerLocale),
/* harmony export */   "toAirDateFormat": () => (/* reexport safe */ _date_date_format_js__WEBPACK_IMPORTED_MODULE_2__.toAirDateFormat)
/* harmony export */ });
/* harmony import */ var _actions_form_buttons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/form-buttons.js */ "./resources/frontend/features/forms/actions/form-buttons.js");
/* harmony import */ var _date_date_control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./date/date-control.js */ "./resources/frontend/features/forms/date/date-control.js");
/* harmony import */ var _date_date_format_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./date/date-format.js */ "./resources/frontend/features/forms/date/date-format.js");
/* harmony import */ var _date_date_locales_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./date/date-locales.js */ "./resources/frontend/features/forms/date/date-locales.js");
/* harmony import */ var _date_date_options_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./date/date-options.js */ "./resources/frontend/features/forms/date/date-options.js");
/* harmony import */ var _date_date_range_options_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./date/date-range-options.js */ "./resources/frontend/features/forms/date/date-range-options.js");
/* harmony import */ var _date_install_date_controls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./date/install-date-controls.js */ "./resources/frontend/features/forms/date/install-date-controls.js");
var FORM_FEATURE_ID = 'forms';







})();

/******/ })()
;
//# sourceMappingURL=forms.js.map