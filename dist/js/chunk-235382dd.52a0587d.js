(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-235382dd","chunk-2d0a512f"],{"08c4":function(t,e,n){"use strict";var a=n("a026");function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e,n){return(e=c(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function c(t){var e=u(t,"string");return"symbol"==i(e)?e:e+""}function u(t,e){if("object"!=i(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var a=n.call(t,e||"default");if("object"!=i(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}e["a"]={data:function(){return{vueFormatters:[]}},methods:{vueFormatter:function(t){var e="_vue_formatter_".concat(this.vueFormatters.length);return this.vueFormatters.push(o({el:".".concat(e),name:e},t)),'<div class="'.concat(e,'"/>')},vueFormatterInit:function(){if(this.vueFormatters.length)for(var t=this.vueFormatters.length-1;t>=0;t--){var e=this.vueFormatters[t];document.getElementsByClassName(e.name)&&(new a["default"](e),this.vueFormatters.splice(t,1))}}}}},"192b":function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("b-form-group",{attrs:{id:t.id,label:t.label,"label-for":"".concat(t.id,"-input"),"label-class":t.labelClasses}},[e("b-input-group",{class:t.inputGroupSize},[t.icon?e("b-input-group-prepend",[e("b-input-group-text",[e("i",{class:t.icon})])],1):t._e(),e("b-form-input",t._g({class:t.inputClasses,attrs:{id:"".concat(t.id,"-input"),type:t.type,placeholder:t.label,state:t.feedbackState(),autocomplete:t.autocomplete,autofocus:t.isFocused,required:t.isRequired,readonly:t.readonly,disabled:t.isDisabled,trim:""},on:{blur:function(e){t.hadFocus=!0}},model:{value:t.innerValue,callback:function(e){t.innerValue=e},expression:"innerValue"}},t.inputListeners)),t.tooltip?e("b-input-group-append",[e("b-input-group-text",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:t.tooltip}},[e("i",{staticClass:"cui-info font-lg"})])],1):t._e()],1),"true"===this.feedback?e("b-form-invalid-feedback",{attrs:{state:t.feedbackState()}},[t._v("\n    "+t._s(t.feedbackText)+"\n  ")]):t._e()],1)},i=[],r=n("900c"),o={props:{id:String,label:String,value:String,inputGroupSize:String,icon:String,type:String,autocomplete:String,autofocus:String,tooltip:String,feedbackText:String,feedback:String,lazy:String,required:String,readonly:Boolean,disabled:String,state:{default:void 0,type:Boolean}},data:function(){return{isFocused:!1,isRequired:!1,isDisabled:!1,hadFocus:!1}},beforeMount:function(){this.isFocused=r["a"].toBoolean(this.autofocus),this.isRequired=r["a"].toBoolean(this.required),this.isDisabled=r["a"].toBoolean(this.disabled)},computed:{innerValue:{get:function(){return this.value&&this.value.length,this.value},set:function(t){return t}},inputListeners:function(){var t=this;return Object.assign({},this.$listeners,{input:function(e){t.$emit("input",e)}})},inputClasses:function(){return this.isRequired?"required":null},labelClasses:function(){return this.isRequired?"required":null}},methods:{feedbackState:function(){if(!this.isDisabled||this.isRequired)return void 0!==this.state?this.state:r["a"].toBoolean(this.lazy)&&r["a"].toBoolean(this.required)?!!(this.value&&this.value.length>0)||!this.hadFocus&&void 0:!!(this.value&&this.value.length>0)||void 0}}},s=o,c=n("2877"),u=Object(c["a"])(s,a,i,!1,null,null,null);e["a"]=u.exports},"2e23":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t._self._c;return e("b-card",{attrs:{"no-body":"",header:t.header}},[e("b-card-body",[e("div",{attrs:{id:"customToolbar"}},[e("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.createOidcUserModal",modifiers:{createOidcUserModal:!0}}],attrs:{size:"md",variant:"outline-primary"}},[e("span",{staticClass:"fa fa-plus"}),t._v(" "+t._s(t.$t("admin.create_user"))+"\n      ")])],1),e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1),e("create-oidc-user-modal",{on:{refreshTable:t.refreshTable}})],1)},i=[],r=n("6c36"),o=n.n(r),s=n("900c"),c=n("12cb"),u=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"createOidcUserModal",size:"md","hide-header-close":"","no-stacking":"",title:t.$t("admin.create_oidc_user")},on:{hide:function(e){return t.resetValues()}},scopedSlots:t._u([{key:"modal-footer",fn:function(n){var a=n.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return a()}}},[t._v(t._s(t.$t("message.close")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){return t.createUser()}}},[t._v(t._s(t.$t("message.create")))])]}}])},[e("b-input-group-form-input",{attrs:{id:"username-input","input-group-size":"mb-3",type:"text",lazy:"true",required:"true",feedback:"true",autofocus:"false",label:t.$t("message.username"),"feedback-text":t.$t("admin.required_username")},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1)},l=[],d=n("7c15"),f=n("192b"),m={mixins:[d["a"]],components:{BInputGroupFormInput:f["a"]},data:function(){return{username:null}},methods:{createUser:function(){var t=this,e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER_OIDC);this.axios.put(e,{username:this.username}).then((function(e){t.$emit("refreshTable"),t.$toastr.s(t.$t("admin.user_created"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))})),this.$root.$emit("bv::hide::modal","createOidcUserModal"),this.resetValues()},resetValues:function(){this.username=null}}},p=m,h=n("2877"),b=Object(h["a"])(p,u,l,!1,null,null,null),v=b.exports,_=n("08c4"),E=n("f547"),g=n("e68f"),A=n("c9ca"),S=n("ae28"),T={props:{header:String},mixins:[_["a"]],components:{CreateOidcUserModal:v},mounted:function(){var t=this;E["a"].$on("admin:oidcusers:rowUpdate",(function(e,n){t.$refs.table.updateRow({index:e,row:n}),t.$refs.table.expandRow(e)})),E["a"].$on("admin:oidcusers:rowDeleted",(function(e,n){t.refreshTable()}))},beforeDestroy:function(){E["a"].$off("admin:oidcusers:rowUpdate"),E["a"].$off("admin:oidcusers:rowDeleted")},data:function(){var t=this;return{columns:[{title:this.$t("message.username"),field:"username",sortable:!1,formatter:function(t,e,n){return o.a.inHTMLData(s["a"].valueWithDefault(t,""))}},{title:this.$t("admin.subject_identifier"),field:"subjectIdentifier",sortable:!1,formatter:function(t,e,n){return o.a.inHTMLData(s["a"].valueWithDefault(t,""))}},{title:this.$t("admin.teams"),field:"teams",sortable:!1,formatter:function(t,e,n){return t?o.a.inHTMLData(s["a"].valueWithDefault(t.length,"0")):0}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},detailView:!0,detailViewIcon:!1,detailViewByClick:!0,detailFormatter:function(e,n){return t.vueFormatter({i18n:c["a"],template:'\n                <b-row class="expanded-row">\n                  <b-col sm="6">\n                    <b-form-group :label="this.$t(\'admin.team_membership\')">\n                      <div class="list-group">\n                        <span v-for="team in teams">\n                          <actionable-list-group-item :value="team.name" :delete-icon="true" v-on:actionClicked="removeTeamMembership(team.uuid)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectTeamModal\')"/>\n                      </div>\n                    </b-form-group>\n                    <b-form-group :label="this.$t(\'admin.permissions\')">\n                      <div class="list-group">\n                        <span v-for="permission in permissions">\n                          <actionable-list-group-item :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectPermissionModal\')"/>\n                      </div>\n                    </b-form-group>\n                  </b-col>\n                  <b-col sm="6">\n                    <div style="text-align:right">\n                       <b-button variant="outline-danger" @click="deleteUser">{{ $t(\'admin.delete_user\') }}</b-button>\n                    </div>\n                  </b-col>\n                  <select-team-modal v-on:selection="updateTeamSelection" />\n                  <select-permission-modal v-on:selection="updatePermissionSelection" />\n                </b-row>\n              ',mixins:[d["a"]],components:{ActionableListGroupItem:g["a"],SelectTeamModal:A["a"],SelectPermissionModal:S["a"]},data:function(){return{oidcUser:n,username:n.username,teams:n.teams,permissions:n.permissions}},methods:{deleteUser:function(){var t=this,n="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER_OIDC);this.axios.delete(n,{data:{username:this.username}}).then((function(n){E["a"].$emit("admin:oidcusers:rowDeleted",e),t.$toastr.s(t.$t("admin.user_deleted"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},updateTeamSelection:function(t){var n=this;this.$root.$emit("bv::hide::modal","selectTeamModal");for(var a=0;a<t.length;a++){var i=t[a],r="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER,"/").concat(this.username,"/membership");this.axios.post(r,{uuid:i.uuid}).then((function(t){n.syncVariables(t.data),E["a"].$emit("admin:oidcusers:rowUpdate",e,n.oidcUser),n.$toastr.s(n.$t("message.updated"))})).catch((function(t){304===t.response.status||n.$toastr.w(n.$t("condition.unsuccessful_action"))}))}},removeTeamMembership:function(t){var n=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER,"/").concat(this.username,"/membership");this.axios.delete(a,{data:{uuid:t}}).then((function(t){n.syncVariables(t.data),E["a"].$emit("admin:oidcusers:rowUpdate",e,n.oidcUser),n.$toastr.s(n.$t("message.updated"))})).catch((function(t){n.$toastr.w(n.$t("condition.unsuccessful_action"))}))},updatePermissionSelection:function(t){var e=this;this.$root.$emit("bv::hide::modal","selectPermissionModal");for(var n=0;n<t.length;n++){var a=t[n],i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION,"/").concat(a.name,"/user/").concat(this.username);this.axios.post(i).then((function(t){e.syncVariables(t.data),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){console.log(t),304===t.response.status||e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}},removePermission:function(t){var e=this,n="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION,"/").concat(t.name,"/user/").concat(this.username);this.axios.delete(n).then((function(t){e.syncVariables(t.data),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},syncVariables:function(t){this.oidcUser=t,this.username=t.username,this.teams=t.teams,this.permissions=t.permissions}}})},onExpandRow:this.vueFormatterInit,toolbar:"#customToolbar",responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER_OIDC)}}},methods:{refreshTable:function(){this.$refs.table.refresh({silent:!0})}}},y=T,$=Object(h["a"])(y,a,i,!1,null,null,null);e["default"]=$.exports},"7c15":function(t,e,n){"use strict";var a=n("a4c1");function i(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=r(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,i=function(){};return{s:i,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){c=!0,o=t},f:function(){try{s||null==n.return||n.return()}finally{if(c)throw o}}}}function r(t,e){if(t){if("string"==typeof t)return o(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,e):void 0}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=Array(e);n<e;n++)a[n]=t[n];return a}e["a"]={data:function(){return{PERMISSIONS:{BOM_UPLOAD:a["f"],VIEW_PORTFOLIO:a["A"],PORTFOLIO_MANAGEMENT:a["m"],PORTFOLIO_MANAGEMENT_CREATE:a["n"],PORTFOLIO_MANAGEMENT_READ:a["p"],PORTFOLIO_MANAGEMENT_UPDATE:a["q"],PORTFOLIO_MANAGEMENT_DELETE:a["o"],VIEW_VULNERABILITY:a["B"],VULNERABILITY_ANALYSIS:a["C"],VULNERABILITY_ANALYSIS_CREATE:a["D"],VULNERABILITY_ANALYSIS_READ:a["E"],VULNERABILITY_ANALYSIS_UPDATE:a["F"],VIEW_POLICY_VIOLATION:a["z"],VULNERABILITY_MANAGEMENT:a["G"],VULNERABILITY_MANAGEMENT_CREATE:a["H"],VULNERABILITY_MANAGEMENT_READ:a["J"],VULNERABILITY_MANAGEMENT_UPDATE:a["K"],VULNERABILITY_MANAGEMENT_DELETE:a["I"],POLICY_VIOLATION_ANALYSIS:a["l"],ACCESS_MANAGEMENT:a["a"],ACCESS_MANAGEMENT_CREATE:a["b"],ACCESS_MANAGEMENT_READ:a["d"],ACCESS_MANAGEMENT_UPDATE:a["e"],ACCESS_MANAGEMENT_DELETE:a["c"],SYSTEM_CONFIGURATION:a["s"],SYSTEM_CONFIGURATION_CREATE:a["t"],SYSTEM_CONFIGURATION_READ:a["v"],SYSTEM_CONFIGURATION_UPDATE:a["w"],SYSTEM_CONFIGURATION_DELETE:a["u"],PROJECT_CREATION_UPLOAD:a["r"],POLICY_MANAGEMENT:a["g"],POLICY_MANAGEMENT_CREATE:a["h"],POLICY_MANAGEMENT_READ:a["j"],POLICY_MANAGEMENT_UPDATE:a["k"],POLICY_MANAGEMENT_DELETE:a["i"],TAG_MANAGEMENT:a["x"],TAG_MANAGEMENT_DELETE:a["y"]}}},computed:{decodedToken:function(){return a["L"](a["M"]())}},methods:{isPermitted:function(t){if("string"==typeof t)return a["N"](t,this.decodedToken);if(Array.isArray(t)){var e,n=i(t);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(a["N"](r,this.decodedToken))return!0}}catch(o){n.e(o)}finally{n.f()}return!1}throw new Error("permission must be of type string or array")},isNotPermitted:function(t){if("string"==typeof t)return!a["N"](t,this.decodedToken);if(Array.isArray(t)){var e,n=i(t);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(a["N"](r,this.decodedToken))return!1}}catch(o){n.e(o)}finally{n.f()}return!0}throw new Error("permission must be of type string or array")}}}},"847e":function(t,e,n){"use strict";n("c02e")},ae28:function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectPermissionModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_permission")},scopedSlots:t._u([{key:"modal-footer",fn:function(n){var a=n.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return a()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},i=[],r=n("6c36"),o=n.n(r),s=n("7c15"),c=n("900c"),u={mixins:[s["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("message.name"),field:"name",sortable:!0,formatter:function(t,e,n){return o.a.inHTMLData(c["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,maintainMetaData:!0,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION)}}}},l=u,d=n("2877"),f=Object(d["a"])(l,a,i,!1,null,null,null);e["a"]=f.exports},c02e:function(t,e,n){},c9ca:function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectTeamModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_team")},scopedSlots:t._u([{key:"modal-footer",fn:function(n){var a=n.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return a()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},i=[],r=n("6c36"),o=n.n(r),s=n("7c15"),c=n("900c"),u={mixins:[s["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("admin.team_name"),field:"name",sortable:!0,formatter:function(t,e,n){return o.a.inHTMLData(c["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM)}}}},l=u,d=n("2877"),f=Object(d["a"])(l,a,i,!1,null,null,null);e["a"]=f.exports},e68f:function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("li",{staticClass:"list-group-item align-middle"},[e("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"pull-right action-icon",attrs:{size:"sm",title:t.tooltip},on:{click:function(e){return t.$emit("actionClicked")}}},[this.addIcon?e("span",{staticClass:"fa fa-plus-square"}):t._e(),this.deleteIcon?e("span",{staticClass:"fa fa-trash-o"}):t._e()]),t.$slots&&t.$slots.default&&t.$slots.default[0]?t._t("default"):e("span",[this.href?e("a",{attrs:{href:t.href}},[t._v(t._s(t.value))]):e("span",[t._v(t._s(t.value))]),t._v(" ")])],2)},i=[],r={props:{value:String,tooltip:String,addIcon:Boolean,deleteIcon:Boolean,variant:String,href:String}},o=r,s=(n("847e"),n("2877")),c=Object(s["a"])(o,a,i,!1,null,"683f4500",null);e["a"]=c.exports}}]);