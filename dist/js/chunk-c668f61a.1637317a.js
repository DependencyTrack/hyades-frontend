(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c668f61a","chunk-2d0a512f"],{"08c4":function(t,e,n){"use strict";var a=n("a026");function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e,n){return(e=u(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t){var e=c(t,"string");return"symbol"==o(e)?e:e+""}function c(t,e){if("object"!=o(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var a=n.call(t,e||"default");if("object"!=o(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}e["a"]={data:function(){return{vueFormatters:[]}},methods:{vueFormatter:function(t){var e="_vue_formatter_".concat(this.vueFormatters.length);return this.vueFormatters.push(r({el:".".concat(e),name:e},t)),'<div class="'.concat(e,'"/>')},vueFormatterInit:function(){if(this.vueFormatters.length)for(var t=this.vueFormatters.length-1;t>=0;t--){var e=this.vueFormatters[t];document.getElementsByClassName(e.name)&&(new a["default"](e),this.vueFormatters.splice(t,1))}}}}},"192b":function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("b-form-group",{attrs:{id:t.id,label:t.label,"label-for":"".concat(t.id,"-input"),"label-class":t.labelClasses}},[e("b-input-group",{class:t.inputGroupSize},[t.icon?e("b-input-group-prepend",[e("b-input-group-text",[e("i",{class:t.icon})])],1):t._e(),e("b-form-input",t._g({class:t.inputClasses,attrs:{id:"".concat(t.id,"-input"),type:t.type,placeholder:t.label,state:t.feedbackState(),autocomplete:t.autocomplete,autofocus:t.isFocused,required:t.isRequired,readonly:t.readonly,disabled:t.isDisabled,trim:""},on:{blur:function(e){t.hadFocus=!0}},model:{value:t.innerValue,callback:function(e){t.innerValue=e},expression:"innerValue"}},t.inputListeners)),t.tooltip?e("b-input-group-append",[e("b-input-group-text",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:t.tooltip}},[e("i",{staticClass:"cui-info font-lg"})])],1):t._e()],1),"true"===this.feedback?e("b-form-invalid-feedback",{attrs:{state:t.feedbackState()}},[t._v("\n    "+t._s(t.feedbackText)+"\n  ")]):t._e()],1)},o=[],i=n("900c"),r={props:{id:String,label:String,value:String,inputGroupSize:String,icon:String,type:String,autocomplete:String,autofocus:String,tooltip:String,feedbackText:String,feedback:String,lazy:String,required:String,readonly:Boolean,disabled:String,state:{default:void 0,type:Boolean}},data:function(){return{isFocused:!1,isRequired:!1,isDisabled:!1,hadFocus:!1}},beforeMount:function(){this.isFocused=i["a"].toBoolean(this.autofocus),this.isRequired=i["a"].toBoolean(this.required),this.isDisabled=i["a"].toBoolean(this.disabled)},computed:{innerValue:{get:function(){return this.value&&this.value.length,this.value},set:function(t){return t}},inputListeners:function(){var t=this;return Object.assign({},this.$listeners,{input:function(e){t.$emit("input",e)}})},inputClasses:function(){return this.isRequired?"required":null},labelClasses:function(){return this.isRequired?"required":null}},methods:{feedbackState:function(){if(!this.isDisabled||this.isRequired)return void 0!==this.state?this.state:i["a"].toBoolean(this.lazy)&&i["a"].toBoolean(this.required)?!!(this.value&&this.value.length>0)||!this.hadFocus&&void 0:!!(this.value&&this.value.length>0)||void 0}}},s=r,u=n("2877"),c=Object(u["a"])(s,a,o,!1,null,null,null);e["a"]=c.exports},"7c15":function(t,e,n){"use strict";var a=n("a4c1");function o(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=i(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,s=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){u=!0,r=t},f:function(){try{s||null==n.return||n.return()}finally{if(u)throw r}}}}function i(t,e){if(t){if("string"==typeof t)return r(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=Array(e);n<e;n++)a[n]=t[n];return a}e["a"]={data:function(){return{PERMISSIONS:{BOM_UPLOAD:a["f"],VIEW_PORTFOLIO:a["A"],PORTFOLIO_MANAGEMENT:a["m"],PORTFOLIO_MANAGEMENT_CREATE:a["n"],PORTFOLIO_MANAGEMENT_READ:a["p"],PORTFOLIO_MANAGEMENT_UPDATE:a["q"],PORTFOLIO_MANAGEMENT_DELETE:a["o"],VIEW_VULNERABILITY:a["B"],VULNERABILITY_ANALYSIS:a["C"],VULNERABILITY_ANALYSIS_CREATE:a["D"],VULNERABILITY_ANALYSIS_READ:a["E"],VULNERABILITY_ANALYSIS_UPDATE:a["F"],VIEW_POLICY_VIOLATION:a["z"],VULNERABILITY_MANAGEMENT:a["G"],VULNERABILITY_MANAGEMENT_CREATE:a["H"],VULNERABILITY_MANAGEMENT_READ:a["J"],VULNERABILITY_MANAGEMENT_UPDATE:a["K"],VULNERABILITY_MANAGEMENT_DELETE:a["I"],POLICY_VIOLATION_ANALYSIS:a["l"],ACCESS_MANAGEMENT:a["a"],ACCESS_MANAGEMENT_CREATE:a["b"],ACCESS_MANAGEMENT_READ:a["d"],ACCESS_MANAGEMENT_UPDATE:a["e"],ACCESS_MANAGEMENT_DELETE:a["c"],SYSTEM_CONFIGURATION:a["s"],SYSTEM_CONFIGURATION_CREATE:a["t"],SYSTEM_CONFIGURATION_READ:a["v"],SYSTEM_CONFIGURATION_UPDATE:a["w"],SYSTEM_CONFIGURATION_DELETE:a["u"],PROJECT_CREATION_UPLOAD:a["r"],POLICY_MANAGEMENT:a["g"],POLICY_MANAGEMENT_CREATE:a["h"],POLICY_MANAGEMENT_READ:a["j"],POLICY_MANAGEMENT_UPDATE:a["k"],POLICY_MANAGEMENT_DELETE:a["i"],TAG_MANAGEMENT:a["x"],TAG_MANAGEMENT_DELETE:a["y"]}}},computed:{decodedToken:function(){return a["L"](a["M"]())}},methods:{isPermitted:function(t){if("string"==typeof t)return a["N"](t,this.decodedToken);if(Array.isArray(t)){var e,n=o(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;if(a["N"](i,this.decodedToken))return!0}}catch(r){n.e(r)}finally{n.f()}return!1}throw new Error("permission must be of type string or array")},isNotPermitted:function(t){if("string"==typeof t)return!a["N"](t,this.decodedToken);if(Array.isArray(t)){var e,n=o(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;if(a["N"](i,this.decodedToken))return!1}}catch(r){n.e(r)}finally{n.f()}return!0}throw new Error("permission must be of type string or array")}}}},"847e":function(t,e,n){"use strict";n("c02e")},b793:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t._self._c;return e("b-card",{attrs:{"no-body":"",header:t.header}},[e("b-card-body",[e("div",{attrs:{id:"customToolbar"}},[e("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.createOidcGroupModal",modifiers:{createOidcGroupModal:!0}}],attrs:{size:"md",variant:"outline-primary"}},[e("span",{staticClass:"fa fa-plus"}),t._v("\n        "+t._s(t.$t("admin.create_oidc_group"))+"\n      ")])],1),e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1),e("create-oidc-group-modal",{on:{refreshTable:t.refreshTable}})],1)},o=[],i=n("6c36"),r=n.n(i),s=n("900c"),u=n("12cb"),c=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"createOidcGroupModal",size:"md","hide-header-close":"","no-stacking":"",title:t.$t("admin.create_oidc_group")},on:{hide:function(e){return t.resetValues()}},scopedSlots:t._u([{key:"modal-footer",fn:function(n){var a=n.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return a()}}},[t._v(t._s(t.$t("message.close")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){return t.createGroup()}}},[t._v(t._s(t.$t("message.create")))])]}}])},[e("b-input-group-form-input",{attrs:{id:"name-input","input-group-size":"mb-3",type:"text",lazy:"true",required:"true",feedback:"true",autofocus:"false",label:t.$t("admin.oidc_group_name"),"feedback-text":t.$t("admin.required_oidc_group_name")},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}})],1)},l=[],d=n("7c15"),p=n("192b"),f={mixins:[d["a"]],components:{BInputGroupFormInput:p["a"]},data:function(){return{name:null}},methods:{createGroup:function(){var t=this,e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP);this.axios.put(e,{name:this.name}).then((function(e){t.$emit("refreshTable"),t.$toastr.s(t.$t("admin.oidc_group_created"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))})),this.$root.$emit("bv::hide::modal","createOidcGroupModal"),this.resetValues()},resetValues:function(){this.name=null}}},m=f,h=n("2877"),b=Object(h["a"])(m,c,l,!1,null,null,null),_=b.exports,v=n("08c4"),E=n("f547"),g=n("e68f"),A=n("c9ca"),T={props:{header:String},mixins:[v["a"]],components:{CreateOidcGroupModal:_},mounted:function(){var t=this;E["a"].$on("admin:oidcgroups:rowUpdate",(function(e,n){t.$refs.table.updateRow({index:e,row:n}),t.$refs.table.expandRow(e)})),E["a"].$on("admin:oidcgroups:rowDeleted",(function(e,n){t.refreshTable()}))},beforeDestroy:function(){E["a"].$off("admin:oidcgroups:rowUpdate"),E["a"].$off("admin:oidcgroups:rowDeleted")},data:function(){var t=this;return{columns:[{title:this.$t("admin.oidc_group_name"),field:"name",sortable:!1,formatter:function(t,e,n){return r.a.inHTMLData(s["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},detailView:!0,detailViewIcon:!1,detailViewByClick:!0,detailFormatter:function(e,n){return t.vueFormatter({i18n:u["a"],template:'\n              <b-row class="expanded-row">\n                  <b-col sm="6">\n                    <b-input-group-form-input id="input-oidcgroup-name" :label="$t(\'admin.oidc_group_name\')" input-group-size="mb-3"\n                                              required="true" type="text" v-model="oidcGroup.name" lazy="true" autofocus="true"\n                                              v-debounce:750ms="updateOidcGroup" :debounce-events="\'keyup\'" />\n                    <b-form-group :label="this.$t(\'admin.mapped_teams\')">\n                      <div class="list-group">\n                        <span v-for="mappedTeam in mappedTeams">\n                          <actionable-list-group-item :value="mappedTeam.name" :delete-icon="true" v-on:actionClicked="removeOidcGroupMapping(mappedTeam)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectTeamModal\')"/>\n                      </div>\n                    </b-form-group>\n                  </b-col>\n                  <b-col sm="6">\n                    <div style="text-align:right">\n                       <b-button variant="outline-danger" @click="deleteOidcGroup">{{ $t(\'admin.delete_oidc_group\') }}</b-button>\n                    </div>\n                  </b-col>\n                  <select-team-modal v-on:selection="updateTeamSelection" />\n                </b-row>\n              ',mixins:[d["a"]],components:{ActionableListGroupItem:g["a"],BInputGroupFormInput:p["a"],SelectTeamModal:A["a"]},data:function(){return{oidcGroup:n,mappedTeams:[]}},methods:{updateOidcGroup:function(){var t=this,n="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP);this.axios.post(n,{uuid:this.oidcGroup.uuid,name:this.oidcGroup.name}).then((function(n){t.team=n.data,E["a"].$emit("admin:oidcgroups:rowUpdate",e,t.team),t.$toastr.s(t.$t("message.updated"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},deleteOidcGroup:function(){var t=this,n="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP,"/").concat(this.oidcGroup.uuid);this.axios.delete(n).then((function(n){E["a"].$emit("admin:oidcgroups:rowDeleted",e),t.$toastr.s(t.$t("admin.oidc_group_deleted"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},getMappedTeams:function(){var t=this,e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP,"/").concat(this.oidcGroup.uuid,"/team");this.axios.get(e).then((function(e){t.mappedTeams=e.data})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},updateTeamSelection:function(t){var e=this;this.$root.$emit("bv::hide::modal","selectTeamModal");for(var n=function(){var n=t[a],o="".concat(e.$api.BASE_URL,"/").concat(e.$api.URL_OIDC_MAPPING);e.axios.put(o,{group:e.oidcGroup.uuid,team:n.uuid}).then((function(t){e.mappedTeams.push(n),e.mappedTeams.sort(),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},a=0;a<t.length;a++)n()},removeOidcGroupMapping:function(t){var e=this,n="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP,"/").concat(this.oidcGroup.uuid,"/team/").concat(t.uuid,"/mapping");this.axios.delete(n).then((function(n){for(var a=[],o=0;o<e.mappedTeams.length;o++)e.mappedTeams[o].uuid!==t.uuid&&a.push(e.mappedTeams[o]);e.mappedTeams=a,e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}},mounted:function(){this.getMappedTeams()}})},onExpandRow:this.vueFormatterInit,toolbar:"#customToolbar",responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP)}}},methods:{refreshTable:function(){this.$refs.table.refresh({silent:!0})}}},O=T,S=Object(h["a"])(O,a,o,!1,null,null,null);e["default"]=S.exports},c02e:function(t,e,n){},c9ca:function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectTeamModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_team")},scopedSlots:t._u([{key:"modal-footer",fn:function(n){var a=n.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return a()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},o=[],i=n("6c36"),r=n.n(i),s=n("7c15"),u=n("900c"),c={mixins:[s["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("admin.team_name"),field:"name",sortable:!0,formatter:function(t,e,n){return r.a.inHTMLData(u["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM)}}}},l=c,d=n("2877"),p=Object(d["a"])(l,a,o,!1,null,null,null);e["a"]=p.exports},e68f:function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("li",{staticClass:"list-group-item align-middle"},[e("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"pull-right action-icon",attrs:{size:"sm",title:t.tooltip},on:{click:function(e){return t.$emit("actionClicked")}}},[this.addIcon?e("span",{staticClass:"fa fa-plus-square"}):t._e(),this.deleteIcon?e("span",{staticClass:"fa fa-trash-o"}):t._e()]),t.$slots&&t.$slots.default&&t.$slots.default[0]?t._t("default"):e("span",[this.href?e("a",{attrs:{href:t.href}},[t._v(t._s(t.value))]):e("span",[t._v(t._s(t.value))]),t._v(" ")])],2)},o=[],i={props:{value:String,tooltip:String,addIcon:Boolean,deleteIcon:Boolean,variant:String,href:String}},r=i,s=(n("847e"),n("2877")),u=Object(s["a"])(r,a,o,!1,null,"683f4500",null);e["a"]=u.exports}}]);