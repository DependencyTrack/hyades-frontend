(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-aa61511e"],{"0864":function(e,t,a){"use strict";var s=a("900c");t["a"]={data:function(){return{configUrl:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/"),labelIcon:{dataOn:"✓",dataOff:"✕"}}},methods:{updateConfigProperties:function(e){for(var t=this,a=[],o=0;o<e.length;o++){var c=e[o];c.propertyValue=s["a"].trimToNull(c.propertyValue),a.push(c)}var i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/aggregate");this.axios.post(i,a).then((function(e){t.$toastr.s(t.$t("admin.configuration_saved"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},updateConfigProperty:function(e,t,a){var o=this;a=s["a"].trimToNull(a);var c="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/");this.axios.post(c,{groupName:e,propertyName:t,propertyValue:a}).then((function(e){o.$toastr.s(o.$t("admin.configuration_saved"))})).catch((function(e){o.$toastr.w(o.$t("condition.unsuccessful_action"))}))}}}},"598b":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e._self._c;return t("div",[t("b-card",{attrs:{"no-body":"",header:e.header}},[t("b-card-group",[t("b-card-body",[t("p",[e._v(e._s(e.$t("admin.welcome_message_desc")))]),t("b-form-group",{attrs:{label:e.$t("admin.welcome_message"),"label-size":"lg","label-class":"font-weight-bold pt-0 mb-2"}},[t("div",{attrs:{id:"customToolbar"}},[t("c-switch",e._b({attrs:{id:"isWelcomeMessage",color:"primary",label:""},model:{value:e.isWelcomeMessage,callback:function(t){e.isWelcomeMessage=t},expression:"isWelcomeMessage"}},"c-switch",e.labelIcon,!1)),e._v(e._s(e.$t("admin.welcome_message_enable"))+"\n          ")],1),t("textarea",{ref:"editor",staticClass:"form-control",attrs:{disabled:!e.isWelcomeMessage},domProps:{value:e.welcomeMessage},on:{input:e.updateCode}})])],1)],1),t("b-card-footer",[t("b-button",{staticClass:"px-4",attrs:{disabled:!this.welcomeMessage&&this.isWelcomeMessage,variant:"outline-primary"},on:{click:e.saveChanges}},[e._v("\n        "+e._s(e.$t("message.update"))+"\n      ")])],1)],1),t("div",{staticClass:"container"},[t("b-row",{staticClass:"justify-content-center"},[t("b-col",{attrs:{md:"8"}},[e.isWelcomeMessage?t("b-card",{staticClass:"bg-grey-900"},[t("div",{attrs:{slot:"header"},slot:"header"},[t("h4",[e._v(e._s(e.$t("admin.preview")))])]),t("p",[t("span",{domProps:{innerHTML:e._s(e.welcomeMessage)}})])]):e._e()],1)],1)],1)],1)},o=[],c=a("cee4"),i=a("f1fb"),n=a("0864"),r=a("900c"),l={mixins:[n["a"]],props:{header:String},components:{cSwitch:i["o"]},data:function(){return{isWelcomeMessage:!1,welcomeMessage:""}},created:function(){var e=this,t="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/public/general/welcome.message.html"),a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY,"/public/general/welcome.message.enabled");c["a"].get(t).then((function(t){e.welcomeMessage=decodeURIComponent(t.data.propertyValue)})),c["a"].get(a).then((function(t){e.isWelcomeMessage=r["a"].toBoolean(t.data.propertyValue)}))},computed:{},methods:{updateCode:function(){var e=this.$refs.editor;this.welcomeMessage=e.value,e.style.height=e.scrollHeight+"px"},saveChanges:function(){var e=this,t="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_CONFIG_PROPERTY);c["a"].post(t,{groupName:"general",propertyName:"welcome.message.html",propertyValue:encodeURIComponent(""!==this.welcomeMessage?this.welcomeMessage:" ")}),c["a"].post(t,{groupName:"general",propertyName:"welcome.message.enabled",propertyValue:this.isWelcomeMessage}).then((function(t){e.$toastr.s(e.$t("admin.configuration_saved"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}}},p=l,u=a("2877"),d=Object(u["a"])(p,s,o,!1,null,null,null);t["default"]=d.exports}}]);