(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-24cca1cf"],{"7c15":function(e,t,a){"use strict";var o=a("a4c1");function i(e,t){var a="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=r(e))||t&&e&&"number"==typeof e.length){a&&(e=a);var o=0,i=function(){};return{s:i,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,s=!0,c=!1;return{s:function(){a=a.call(e)},n:function(){var e=a.next();return s=e.done,e},e:function(e){c=!0,n=e},f:function(){try{s||null==a.return||a.return()}finally{if(c)throw n}}}}function r(e,t){if(e){if("string"==typeof e)return n(e,t);var a={}.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?n(e,t):void 0}}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,o=Array(t);a<t;a++)o[a]=e[a];return o}t["a"]={data:function(){return{PERMISSIONS:{BOM_UPLOAD:o["f"],VIEW_PORTFOLIO:o["A"],PORTFOLIO_MANAGEMENT:o["m"],PORTFOLIO_MANAGEMENT_CREATE:o["n"],PORTFOLIO_MANAGEMENT_READ:o["p"],PORTFOLIO_MANAGEMENT_UPDATE:o["q"],PORTFOLIO_MANAGEMENT_DELETE:o["o"],VIEW_VULNERABILITY:o["B"],VULNERABILITY_ANALYSIS:o["C"],VULNERABILITY_ANALYSIS_CREATE:o["D"],VULNERABILITY_ANALYSIS_READ:o["E"],VULNERABILITY_ANALYSIS_UPDATE:o["F"],VIEW_POLICY_VIOLATION:o["z"],VULNERABILITY_MANAGEMENT:o["G"],VULNERABILITY_MANAGEMENT_CREATE:o["H"],VULNERABILITY_MANAGEMENT_READ:o["J"],VULNERABILITY_MANAGEMENT_UPDATE:o["K"],VULNERABILITY_MANAGEMENT_DELETE:o["I"],POLICY_VIOLATION_ANALYSIS:o["l"],ACCESS_MANAGEMENT:o["a"],ACCESS_MANAGEMENT_CREATE:o["b"],ACCESS_MANAGEMENT_READ:o["d"],ACCESS_MANAGEMENT_UPDATE:o["e"],ACCESS_MANAGEMENT_DELETE:o["c"],SYSTEM_CONFIGURATION:o["s"],SYSTEM_CONFIGURATION_CREATE:o["t"],SYSTEM_CONFIGURATION_READ:o["v"],SYSTEM_CONFIGURATION_UPDATE:o["w"],SYSTEM_CONFIGURATION_DELETE:o["u"],PROJECT_CREATION_UPLOAD:o["r"],POLICY_MANAGEMENT:o["g"],POLICY_MANAGEMENT_CREATE:o["h"],POLICY_MANAGEMENT_READ:o["j"],POLICY_MANAGEMENT_UPDATE:o["k"],POLICY_MANAGEMENT_DELETE:o["i"],TAG_MANAGEMENT:o["x"],TAG_MANAGEMENT_DELETE:o["y"]}}},computed:{decodedToken:function(){return o["L"](o["M"]())}},methods:{isPermitted:function(e){if("string"==typeof e)return o["N"](e,this.decodedToken);if(Array.isArray(e)){var t,a=i(e);try{for(a.s();!(t=a.n()).done;){var r=t.value;if(o["N"](r,this.decodedToken))return!0}}catch(n){a.e(n)}finally{a.f()}return!1}throw new Error("permission must be of type string or array")},isNotPermitted:function(e){if("string"==typeof e)return!o["N"](e,this.decodedToken);if(Array.isArray(e)){var t,a=i(e);try{for(a.s();!(t=a.n()).done;){var r=t.value;if(o["N"](r,this.decodedToken))return!1}}catch(n){a.e(n)}finally{a.f()}return!0}throw new Error("permission must be of type string or array")}}}},deb7:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e._self._c;return t("div",{directives:[{name:"permission",rawName:"v-permission",value:e.PERMISSIONS.VIEW_POLICY_VIOLATION,expression:"PERMISSIONS.VIEW_POLICY_VIOLATION"}],staticClass:"animated fadeIn"},[t("b-row",[t("b-col",{attrs:{xs:"6",sm:"4",md:"4",lg:"2",id:"filter-controls"}},[t("div",[t("h3",{staticStyle:{display:"inline"}},[e._v(e._s(this.$t("message.filters")))]),t("b-button",{staticStyle:{float:"right"},attrs:{size:"md",variant:"outline-primary"},on:{click:function(t){return e.clearAllFilters()}}},[e._v("\n          "+e._s(this.$t("message.clear_all")))]),t("br"),t("br"),t("b-form-group",{attrs:{id:"showInactive-form-group",label:this.$t("message.projects")}},[t("b-form-checkbox",{attrs:{id:"showInactive-form-checkbox",value:"true","unchecked-value":"false"},model:{value:e.showInactive,callback:function(t){e.showInactive=t},expression:"showInactive"}},[e._v("\n            "+e._s(this.$t("message.show_inactive_projects"))+"\n          ")])],1),t("b-form-group",{attrs:{id:"showSuppressed-form-group",label:this.$t("message.analysis_status")}},[t("b-form-checkbox",{attrs:{id:"showSuppressed-form-checkbox",value:"true","unchecked-value":"false"},model:{value:e.showSuppressed,callback:function(t){e.showSuppressed=t},expression:"showSuppressed"}},[e._v("\n            "+e._s(this.$t("message.show_suppressed_violations"))+"\n          ")])],1),t("b-form-group",{attrs:{id:"violation-state-form-group",label:this.$t("message.violation_state")}},[t("b-form-checkbox-group",{attrs:{id:"violation-state-form-checkbox-group",options:e.violationStateOptions,stacked:""},model:{value:e.violationStateSelected,callback:function(t){e.violationStateSelected=t},expression:"violationStateSelected"}})],1),t("b-form-group",{attrs:{id:"risk-type-form-group",label:this.$t("message.risk_type")}},[t("b-form-checkbox-group",{attrs:{id:"risk-type-form-checkbox-group",options:e.riskTypeOptions,stacked:""},model:{value:e.riskTypeSelected,callback:function(t){e.riskTypeSelected=t},expression:"riskTypeSelected"}})],1),t("b-form-group",{attrs:{id:"analysis-type-form-group",label:this.$t("message.analysis_state")}},[t("b-form-checkbox-group",{attrs:{id:"analysis-type-form-checkbox-group",options:e.analysisStateOptions,stacked:""},model:{value:e.analysisStateSelected,callback:function(t){e.analysisStateSelected=t},expression:"analysisStateSelected"}})],1),t("b-form-group",{attrs:{id:"occurred-on-date-form-group",label:this.$t("message.occurred_on")}},[t("b-datepicker",{attrs:{id:"occurred-on-datepicker-from",max:e.occurredOnDateTo,placeholder:this.$t("message.from")},model:{value:e.occurredOnDateFrom,callback:function(t){e.occurredOnDateFrom=t},expression:"occurredOnDateFrom"}}),t("b-datepicker",{attrs:{id:"occurred-on-datepicker-to",min:e.occurredOnDateFrom,placeholder:this.$t("message.to")},model:{value:e.occurredOnDateTo,callback:function(t){e.occurredOnDateTo=t},expression:"occurredOnDateTo"}})],1),t("b-form-group",{attrs:{id:"text-search-form-group",label:this.$t("message.text_search")}},[t("b-form-input",{attrs:{id:"text-search-form-input",debounce:"750",placeholder:this.$t("message.search")},model:{value:e.textSearchInput,callback:function(t){e.textSearchInput=t},expression:"textSearchInput"}}),e._v("\n          Search in:\n          "),t("b-form-checkbox-group",{attrs:{id:"text-search-form-checkbox-group",options:e.textSearchOptions,stacked:""},model:{value:e.textSearchSelected,callback:function(t){e.textSearchSelected=t},expression:"textSearchSelected"}})],1),t("b-form-group",{directives:[{name:"permission",rawName:"v-permission",value:e.PERMISSIONS.POLICY_MANAGEMENT,expression:"PERMISSIONS.POLICY_MANAGEMENT"}],attrs:{id:"policy-form-group",label:this.$t("message.policies")}},[t("b-form-checkbox-group",{attrs:{id:"policy-form-checkbox-group",options:e.policyOptions,stacked:""},model:{value:e.policySelected,callback:function(t){e.policySelected=t},expression:"policySelected"}})],1)],1)]),t("b-col",{attrs:{xs:"6",sm:"8",md:"8",lg:"10"}},[t("bootstrap-table",{ref:"table",attrs:{columns:e.columns,data:e.data,options:e.options},on:{"on-load-success":e.onLoadSuccess}})],1)],1)],1)},i=[],r=a("7c15"),n=a("900c"),s=a("6c36"),c=a.n(s),l=a("8992"),u=a("a4c1"),h={mixins:[r["a"]],computed:{watchers:function(){return[this.showInactive,this.showSuppressed,this.violationStateSelected,this.riskTypeSelected,this.policySelected,this.analysisStateSelected,this.occurredOnDateFrom,this.occurredOnDateTo]}},beforeMount:function(){this.initializeWatchers(),this.initializePolicies(),this.textSearchSelected=this.textSearchOptions.map((function(e){return e.value}))},methods:{initializePolicies:function(){var e=this,t="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_POLICY);(Object(u["N"])(u["g"],this.decodedToken)||Object(u["N"])(u["a"],this.decodedToken))&&this.axios.get(t).then((function(t){t.data&&t.data.forEach((function(t){return e.policyOptions.push({text:t.name,value:t.uuid})}))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},initializeWatchers:function(){var e=this;this.simpleWatcher=this.$watch("watchers",(function(){return e.refreshTable()})),this.textSearchSelectedWatcher=this.$watch("textSearchSelected",(function(){0!==e.textSearchInput.trim().length&&e.refreshTable()})),this.textSearchInputWatcher=this.$watch("textSearchInput",(function(t,a){0===t.trim().length&&0===a.trim().length||e.refreshTable()}))},apiUrl:function(){var e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_POLICY_VIOLATION);return e+="?showInactive="+("true"===this.showInactive)+"&suppressed="+("true"===this.showSuppressed),this.violationStateSelected&&this.violationStateSelected.length>0&&(e+="&violationState="+this.violationStateSelected),this.riskTypeSelected&&this.riskTypeSelected.length>0&&(e+="&riskType="+this.riskTypeSelected),this.policySelected&&this.policySelected.length>0&&(e+="&policy="+this.policySelected),this.analysisStateSelected&&this.analysisStateSelected.length>0&&(e+="&analysisState="+this.analysisStateSelected),this.occurredOnDateFrom&&this.occurredOnDateFrom.length>0&&(e+="&occurredOnDateFrom="+this.occurredOnDateFrom),this.occurredOnDateTo&&this.occurredOnDateTo.length>0&&(e+="&occurredOnDateTo="+this.occurredOnDateTo),this.textSearchInput&&this.textSearchInput.trim().length>0&&(e+="&textSearchField="+this.textSearchSelected+"&textSearchInput="+this.textSearchInput.trim()),e},clearAllFilters:function(){this.simpleWatcher(),this.textSearchSelectedWatcher(),this.textSearchInputWatcher(),this.showInactive=!1,this.showSuppressed=!1,this.violationStateSelected=[],this.riskTypeSelected=[],this.policySelected=[],this.analysisStateSelected=[],this.occurredOnDateFrom="",this.occurredOnDateTo="",this.textSearchInput="",this.textSearchSelected=this.textSearchOptions.map((function(e){return e.value})),this.refreshTable(),this.initializeWatchers()},refreshTable:function(){this.$refs.table.refresh({url:this.apiUrl(),silent:!0})},onLoadSuccess:function(){Object(l["e"])(this,"PolicyViolationAudit",this.$refs.table.columns)}},data:function(){return{simpleWatcher:null,textSearchSelectedWatcher:null,textSearchInputWatcher:null,showInactive:!1,showSuppressed:!1,violationStateSelected:[],violationStateOptions:[{text:"Fail",value:"FAIL"},{text:"Warn",value:"WARN"},{text:"Info",value:"INFO"}],riskTypeSelected:[],riskTypeOptions:[{text:"License",value:"LICENSE"},{text:"Security",value:"SECURITY"},{text:"Operational",value:"OPERATIONAL"}],policySelected:[],policyOptions:[],analysisStateSelected:[],analysisStateOptions:[{text:"Not Set",value:"NOT_SET"},{text:"Rejected",value:"REJECTED"},{text:"Approved",value:"APPROVED"}],occurredOnDateFrom:"",occurredOnDateTo:"",textSearchInput:"",textSearchOptions:[{text:"Policy Name",value:"policy_name"},{text:"Component",value:"component"},{text:"License",value:"license"},{text:"Project Name",value:"project_name"}],textSearchSelected:[],columns:[{title:this.$t("message.state"),field:"policyCondition.policy.violationState",sortable:!0,class:"tight",formatter:function(e,t,a){if("undefined"!==typeof e)return n["a"].formatViolationStateLabel(e)}},{title:this.$t("message.risk_type"),field:"type",sortable:!0,class:"tight",formatter:function(e,t,a){return c.a.inHTMLData(n["a"].capitalize(n["a"].valueWithDefault(e,"")))}},{title:this.$t("message.policy_name"),field:"policyCondition.policy.name",sortable:!0,formatter:function(e,t,a){return c.a.inHTMLData(n["a"].valueWithDefault(e,""))}},{title:this.$t("message.component"),field:"component.name",sortable:!0,formatter:function(e,t,a){if(t.component){var o=c.a.uriInUnQuotedAttr("../../../components/"+t.component.uuid),i=n["a"].concatenateComponentName(null,t.component.name,t.component.version),r=c.a.uriInUnQuotedAttr("../../../projects/"+t.project.uuid+"/dependencyGraph/"+t.component.uuid);return'<a href="'.concat(r,'"<i class="fa fa-sitemap" aria-hidden="true" style="float:right; padding-top: 4px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Show in dependency graph"></i></a> ')+'<a href="'.concat(o,'">').concat(c.a.inHTMLData(i),"</a>")}return""}},{title:this.$t("message.project_name"),field:"project.name",sortable:!0,formatter:function(e,t,a){var o=c.a.uriInUnQuotedAttr("../projects/"+t.project.uuid),i=n["a"].concatenateComponentName(null,t.project.name,t.project.version);return'<a href="'.concat(o,'">').concat(c.a.inHTMLData(i),"</a>")}},{title:this.$t("message.occurred_on"),field:"timestamp",sortable:!0,formatter:function(e,t,a){return c.a.inHTMLData(n["a"].formatTimestamp(e))}},{title:this.$t("message.analysis"),field:"analysis.analysisState",sortable:!1,formatter:n["a"].makeAnalysisStateLabelFormatter(this)},{title:this.$t("message.suppressed"),field:"analysis.isSuppressed",sortable:!1,class:"tight",formatter:function(e,t,a){return!0===e?'<i class="fa fa-check-square-o" />':""}},{title:this.$t("message.license"),field:"component.license",sortable:!0,formatter:function(e,t,a){if(Object.prototype.hasOwnProperty.call(t.component,"resolvedLicense")){var o="../../../licenses/"+t.component.resolvedLicense.licenseId;return'<a href="'+o+'">'+c.a.inHTMLData(t.component.resolvedLicense.licenseId)+"</a>"}return c.a.inHTMLData(n["a"].valueWithDefault(e,""))}}],data:[],options:{search:!1,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"server",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:localStorage&&null!==localStorage.getItem("PolicyViolationAuditPageSize")?Number(localStorage.getItem("PolicyViolationAuditPageSize")):10,sortName:localStorage&&null!==localStorage.getItem("PolicyViolationAuditSortName")?localStorage.getItem("PolicyViolationAuditSortName"):"timestamp",sortOrder:localStorage&&null!==localStorage.getItem("PolicyViolationAuditSortOrder")?localStorage.getItem("PolicyViolationAuditSortOrder"):"desc",icons:{refresh:"fa-refresh"},responseHandler:function(e,t){return e.total=t.getResponseHeader("X-Total-Count"),e},url:this.apiUrl(),onPageChange:function(e,t){localStorage&&localStorage.setItem("PolicyViolationAuditPageSize",t.toString())},onColumnSwitch:function(e,t){localStorage&&localStorage.setItem("PolicyViolationAuditShow"+n["a"].capitalize(e),t.toString())},onSort:function(e,t){localStorage&&(localStorage.setItem("PolicyViolationAuditSortName",e),localStorage.setItem("PolicyViolationAuditSortOrder",t))}}}}},d=h,p=a("2877"),S=Object(p["a"])(d,o,i,!1,null,null,null);t["default"]=S.exports}}]);