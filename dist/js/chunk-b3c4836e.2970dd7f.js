(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b3c4836e"],{"0864":function(e,a,t){"use strict";var n=t("900c");a["a"]={data:function(){return{configUrl:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/"),labelIcon:{dataOn:"✓",dataOff:"✕"}}},methods:{updateConfigProperties:function(e){for(var a=this,t=[],s=0;s<e.length;s++){var r=e[s];r.propertyValue=n["a"].trimToNull(r.propertyValue),t.push(r)}var i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/aggregate");this.axios.post(i,t).then((function(e){a.$toastr.s(a.$t("admin.configuration_saved"))})).catch((function(e){a.$toastr.w(a.$t("condition.unsuccessful_action"))}))},updateConfigProperty:function(e,a,t){var s=this;t=n["a"].trimToNull(t);var r="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/");this.axios.post(r,{groupName:e,propertyName:a,propertyValue:t}).then((function(e){s.$toastr.s(s.$t("admin.configuration_saved"))})).catch((function(e){s.$toastr.w(s.$t("condition.unsuccessful_action"))}))}}}},"23e3":function(e,a,t){e.exports=t.p+"img/snyk-logo.0e7a97d5.png"},cc9d:function(e,a,t){"use strict";var n=function(){var e=this,a=e._self._c;return a("validation-provider",{attrs:{vid:e.id,name:e.label,rules:e.rules,mode:e.mode},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.errors,s=t.valid;return[a("b-form-group",{attrs:{id:e.id,label:e.label,"label-for":"".concat(e.id,"-input")}},[a("b-input-group",{class:e.inputGroupSize},[e.icon?a("b-input-group-prepend",[a("b-input-group-text",[a("i",{class:e.icon})])],1):e._e(),a("b-form-input",e._g({class:e.inputClasses,attrs:{id:"".concat(e.id,"-input"),type:e.type,placeholder:e.label,state:e.errorHandlingMethod(n,s),autocomplete:e.autocomplete,autofocus:e.isFocused},model:{value:e.innerValue,callback:function(a){e.innerValue=a},expression:"innerValue"}},e.inputListeners)),e.tooltip?a("b-input-group-append",[a("b-input-group-text",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:e.tooltip}},[a("i",{staticClass:"cui-info font-lg"})])],1):e._e()],1),a("b-form-invalid-feedback",{attrs:{state:e.errorHandlingMethod(n,s)}},[e._v("\n      "+e._s(n[0])+"\n    ")])],1)]}}])})},s=[],r=t("7bb1"),i=t("900c"),o={name:"BValidatedInputGroupFormInput",components:{ValidationProvider:r["b"]},props:{id:String,label:String,value:String,inputGroupSize:String,icon:String,rules:String,mode:String,type:String,autocomplete:String,autofocus:String,tooltip:String,lazy:String},data:function(){return{isFocused:!1}},beforeMount:function(){!0!==this.autofocus&&"true"!==this.autofocus||(this.isFocused=!0)},computed:{innerValue:{get:function(){return this.value},set:function(e){return e}},inputListeners:function(){var e=this;return Object.assign({},this.$listeners,{input:function(a){e.$emit("input",a)}})},inputClasses:function(){var e="form-control";return!i["a"].toBoolean(this.lazy)&&this.rules&&this.rules.includes("required")&&(e+=" required"),e}},methods:{errorHandlingMethod:function(e,a){return this.rules?i["a"].toBoolean(this.lazy)?!e[0]&&(!!a||null):!e[0]&&!!a:null}}},l=o,c=t("2877"),u=Object(c["a"])(l,n,s,!1,null,null,null);a["a"]=u.exports},f6bf:function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e._self._c;return a("b-card",{attrs:{"no-body":"",header:e.header}},[a("b-card-body",[a("img",{attrs:{alt:"Snyk logo",src:t("23e3"),height:"128px"}}),a("hr"),a("c-switch",e._b({attrs:{disabled:!this.scannerEnabled&&(!this.baseUrl||!this.orgId||!this.apitoken||!this.apiVersion),id:"scannerEnabled",color:"primary",label:""},model:{value:e.scannerEnabled,callback:function(a){e.scannerEnabled=a},expression:"scannerEnabled"}},"c-switch",e.labelIcon,!1)),e._v("\n    "+e._s(e.$t("admin.analyzer_snyk_enable"))+"\n    "),a("br"),a("c-switch",e._b({attrs:{disabled:!this.scannerEnabled,id:"aliasSyncEnabled",color:"primary",label:"",title:e.$t("admin.vulnsource_alias_sync_enable_tooltip")},model:{value:e.aliasSyncEnabled,callback:function(a){e.aliasSyncEnabled=a},expression:"aliasSyncEnabled"}},"c-switch",e.labelIcon,!1)),e._v("\n    "+e._s(e.$t("admin.vulnsource_alias_sync_enable"))+"\n    "),a("p",{staticClass:"font-sm text-muted"},[a("span",{staticClass:"fa fa-warning"},[e._v(" ")]),e._v("\n      "+e._s(e.$t("admin.analyzer_snyk_alias_sync_warning"))+"\n    ")]),a("b-validated-input-group-form-input",{attrs:{id:"snyk-baseUrl",label:e.$t("admin.base_url"),"input-group-size":"mb-3",rules:"required",lazy:"true"},model:{value:e.baseUrl,callback:function(a){e.baseUrl=a},expression:"baseUrl"}}),a("b-validated-input-group-form-input",{attrs:{id:"snyk-orgId",label:e.$t("admin.analyzer_snyk_org_id"),"input-group-size":"mb-3",rules:"required",lazy:"true"},model:{value:e.orgId,callback:function(a){e.orgId=a},expression:"orgId"}}),a("p",{staticClass:"font-sm text-muted"},[a("span",{staticClass:"fa fa-question-circle"},[e._v(" ")]),a("a",{attrs:{href:e.findOrgIdUrl,target:"_blank"}},[e._v(e._s(e.$t("admin.analyzer_snyk_how_to_org_id_help")))])]),a("b-validated-input-group-form-input",{attrs:{id:"snyk-apitoken",label:e.$t("admin.api_token"),"input-group-size":"mb-3",rules:"required",type:"password",lazy:"true"},model:{value:e.apitoken,callback:function(a){e.apitoken=a},expression:"apitoken"}}),a("p",{staticClass:"font-sm text-muted"},[a("span",{staticClass:"fa fa-question-circle"},[e._v(" ")]),a("a",{attrs:{href:e.findApiTokenUrl,target:"_blank"}},[e._v(e._s(e.$t("admin.analyzer_snyk_how_to_api_token_help")))]),a("br"),a("span",{staticClass:"fa fa-info-circle"}),e._v("\n      "+e._s(e.$t("admin.analyzer_snyk_multiple_tokens_info"))),a("code",[e._v("token1;token2")])]),a("b-validated-input-group-form-input",{attrs:{id:"snyk-apiVersion",label:e.$t("admin.analyzer_snyk_api_version"),"input-group-size":"mb-3",rules:"required",lazy:"true"},model:{value:e.apiVersion,callback:function(a){e.apiVersion=a},expression:"apiVersion"}}),a("p",{staticClass:"font-sm text-muted"},[a("span",{staticClass:"fa fa-question-circle"},[e._v(" ")]),a("a",{attrs:{href:e.apiDocsUrl,target:"_blank"}},[e._v(e._s(e.$t("admin.analyzer_snyk_how_to_api_version_help")))]),a("br"),a("span",{staticClass:"fa fa-warning"}),e._v("\n      "+e._s(e.$t("admin.analyzer_snyk_api_version_warning"))+"\n    ")]),a("b-row",{staticStyle:{"margin-top":"2rem"}},[a("b-col",{attrs:{sm:"6"}},[a("b-form-group",{attrs:{label:e.$t("message.cvss_source")},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.cvssSource;return[a("b-form-radio-group",{staticClass:"cvss-calc cvss-calc-3-btn",attrs:{options:e.cvssOptions,"aria-describedby":n,name:"radios-btn-default","button-variant":"outline-primary",buttons:""},on:{change:e.generateCvssV2Vector},model:{value:e.cvssSourceSelected,callback:function(a){e.cvssSourceSelected=a},expression:"cvssSourceSelected"}})]}}])})],1)],1),a("p",{staticClass:"font-sm text-muted"},[a("span",{staticClass:"fa fa-question-circle"},[e._v(" ")]),a("a",{attrs:{href:e.multipleCvssDocs,target:"_blank"}},[e._v(e._s(e.$t("admin.analyzer_snyk_why_multiple_cvss")))])]),a("hr"),a("p",[e._v(e._s(e.$t("admin.analyzer_snyk_desc")))])],1),a("b-card-footer",[a("b-button",{staticClass:"px-4",attrs:{disabled:!this.baseUrl||!this.orgId||!this.apitoken||!this.apiVersion,variant:"outline-primary"},on:{click:e.saveChanges}},[e._v("\n      "+e._s(e.$t("message.update"))+"\n    ")])],1)],1)},s=[],r=t("f1fb"),i=t("cc9d"),o=t("900c"),l=t("0864"),c={mixins:[l["a"]],props:{header:String},components:{cSwitch:r["o"],BValidatedInputGroupFormInput:i["a"]},data:function(){return{scannerEnabled:!1,aliasSyncEnabled:!1,apitoken:"",apiVersion:"",baseUrl:"",orgId:"",cvssOptions:["NVD","SNYK"],cvssSourceSelected:"",apiDocsUrl:"https://apidocs.snyk.io",multipleCvssDocs:"https://docs.snyk.io/features/fixing-and-prioritizing-issues/issue-management/severity-levels#understanding-snyks-vulnerability-analysis",findApiTokenUrl:"https://docs.snyk.io/snyk-api-info/authentication-for-api",findOrgIdUrl:"https://docs.snyk.io/products/snyk-code/cli-for-snyk-code/before-you-start-set-the-organization-for-the-cli-tests/finding-the-snyk-id-and-internal-name-of-an-organization",labelIcon:{dataOn:"✓",dataOff:"✕"}}},methods:{saveChanges:function(){this.updateConfigProperties([{groupName:"scanner",propertyName:"snyk.enabled",propertyValue:this.scannerEnabled},{groupName:"scanner",propertyName:"snyk.alias.sync.enabled",propertyValue:this.aliasSyncEnabled},{groupName:"scanner",propertyName:"snyk.api.token",propertyValue:this.apitoken},{groupName:"scanner",propertyName:"snyk.org.id",propertyValue:this.orgId},{groupName:"scanner",propertyName:"snyk.base.url",propertyValue:this.baseUrl},{groupName:"scanner",propertyName:"snyk.cvss.source",propertyValue:this.cvssSourceSelected},{groupName:"scanner",propertyName:"snyk.api.version",propertyValue:this.apiVersion}])}},created:function(){var e=this;this.axios.get(this.configUrl).then((function(a){for(var t=a.data.filter((function(e){return"scanner"===e.groupName})),n=0;n<t.length;n++){var s=t[n];switch(s.propertyName){case"snyk.enabled":e.scannerEnabled=o["a"].toBoolean(s.propertyValue);break;case"snyk.alias.sync.enabled":e.aliasSyncEnabled=o["a"].toBoolean(s.propertyValue);break;case"snyk.api.token":e.apitoken=s.propertyValue;break;case"snyk.org.id":e.orgId=s.propertyValue;break;case"snyk.base.url":e.baseUrl=s.propertyValue;break;case"snyk.cvss.source":e.cvssSourceSelected=s.propertyValue;break;case"snyk.api.version":e.apiVersion=s.propertyValue;break}}}))}},u=c,p=t("2877"),d=Object(p["a"])(u,n,s,!1,null,null,null);a["default"]=d.exports}}]);