(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c04a390c"],{"192b":function(t,e,a){"use strict";var n=function(){var t=this,e=t._self._c;return e("b-form-group",{attrs:{id:t.id,label:t.label,"label-for":"".concat(t.id,"-input"),"label-class":t.labelClasses}},[e("b-input-group",{class:t.inputGroupSize},[t.icon?e("b-input-group-prepend",[e("b-input-group-text",[e("i",{class:t.icon})])],1):t._e(),e("b-form-input",t._g({class:t.inputClasses,attrs:{id:"".concat(t.id,"-input"),type:t.type,placeholder:t.label,state:t.feedbackState(),autocomplete:t.autocomplete,autofocus:t.isFocused,required:t.isRequired,readonly:t.readonly,disabled:t.isDisabled,trim:""},on:{blur:function(e){t.hadFocus=!0}},model:{value:t.innerValue,callback:function(e){t.innerValue=e},expression:"innerValue"}},t.inputListeners)),t.tooltip?e("b-input-group-append",[e("b-input-group-text",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:t.tooltip}},[e("i",{staticClass:"cui-info font-lg"})])],1):t._e()],1),"true"===this.feedback?e("b-form-invalid-feedback",{attrs:{state:t.feedbackState()}},[t._v("\n    "+t._s(t.feedbackText)+"\n  ")]):t._e()],1)},i=[],s=a("900c"),o={props:{id:String,label:String,value:String,inputGroupSize:String,icon:String,type:String,autocomplete:String,autofocus:String,tooltip:String,feedbackText:String,feedback:String,lazy:String,required:String,readonly:Boolean,disabled:String,state:{default:void 0,type:Boolean}},data:function(){return{isFocused:!1,isRequired:!1,isDisabled:!1,hadFocus:!1}},beforeMount:function(){this.isFocused=s["a"].toBoolean(this.autofocus),this.isRequired=s["a"].toBoolean(this.required),this.isDisabled=s["a"].toBoolean(this.disabled)},computed:{innerValue:{get:function(){return this.value&&this.value.length,this.value},set:function(t){return t}},inputListeners:function(){var t=this;return Object.assign({},this.$listeners,{input:function(e){t.$emit("input",e)}})},inputClasses:function(){return this.isRequired?"required":null},labelClasses:function(){return this.isRequired?"required":null}},methods:{feedbackState:function(){if(!this.isDisabled||this.isRequired)return void 0!==this.state?this.state:s["a"].toBoolean(this.lazy)&&s["a"].toBoolean(this.required)?!!(this.value&&this.value.length>0)||!this.hadFocus&&void 0:!!(this.value&&this.value.length>0)||void 0}}},r=o,c=a("2877"),u=Object(c["a"])(r,n,i,!1,null,null,null);e["a"]=u.exports},"2cd5":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t._self._c;return e("b-card",{attrs:{"no-body":"",header:t.header}},[e("b-card-body",[e("div",{attrs:{id:"customToolbar"}},[e("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.createTeamModal",modifiers:{createTeamModal:!0}}],attrs:{size:"md",variant:"outline-primary"}},[e("span",{staticClass:"fa fa-plus"}),t._v(" "+t._s(t.$t("admin.create_team"))+"\n      ")])],1),e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1),e("create-team-modal",{on:{refreshTable:t.refreshTable}})],1)},i=[],s=a("6c36"),o=a.n(s),r=a("900c"),c=a("12cb"),u=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"createTeamModal",size:"md","hide-header-close":"","no-stacking":"",title:t.$t("admin.create_team")},on:{hide:function(e){return t.resetValues()}},scopedSlots:t._u([{key:"modal-footer",fn:function(a){var n=a.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return n()}}},[t._v(t._s(t.$t("message.close")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){return t.createUser()}}},[t._v(t._s(t.$t("message.create")))])]}}])},[e("b-input-group-form-input",{attrs:{id:"name-input","input-group-size":"mb-3",type:"text",lazy:"true",required:"true",feedback:"true",autofocus:"false",label:t.$t("admin.team_name"),"feedback-text":t.$t("admin.required_team_name")},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}})],1)},l=[],d=a("7c15"),p=a("192b"),m={mixins:[d["a"]],components:{BInputGroupFormInput:p["a"]},data:function(){return{name:null}},methods:{createUser:function(){var t=this,e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM);this.axios.put(e,{name:this.name}).then((function(e){t.$emit("refreshTable"),t.$toastr.s(t.$t("admin.team_created"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))})),this.$root.$emit("bv::hide::modal","createTeamModal"),this.resetValues()},resetValues:function(){this.name=null}}},f=m,h=a("2877"),b=Object(h["a"])(f,u,l,!1,null,null,null),_=b.exports,v=a("08c4"),g=a("f547"),A=a("e68f"),$=function(){var t=this,e=t._self._c;return e("b-list-group-item",{staticClass:"flex-column align-items-start"},[e("div",{staticClass:"d-flex w-100 justify-content-between"},[e("span",{staticClass:"text-monospace"},[t._v(t._s(t.apiKey.key))]),e("div",{staticClass:"d-flex"},[e("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}},{name:"b-modal",rawName:"v-b-modal",value:"editApiKeyCommentModal-".concat(t.keyId),expression:"`editApiKeyCommentModal-${keyId}`"}],staticClass:"action-icon",attrs:{size:"sm",title:t.$t("admin.edit_api_key_comment")}},[e("span",{staticClass:"fa fa-edit"})]),e("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"action-icon ml-3",attrs:{size:"sm",title:t.$t("admin.remove_api_key")},on:{click:function(e){return t.$emit("removeClicked")}}},[e("span",{staticClass:"fa fa-trash-o"})]),e("edit-api-key-comment-modal",{attrs:{"key-id":this.keyId,"api-key":this.apiKey}})],1)]),e("p",{staticClass:"mt-2 font-weight-light"},[e("em",[t._v(t._s(t.comment))])]),e("hr"),e("div",{staticClass:"d-flex w-100 justify-content-between text-muted"},[e("small",{attrs:{title:t.$t("admin.api_key_created_tooltip")}},[t._v("Created: "+t._s(t.createdTimestamp))]),e("small",{attrs:{title:t.$t("admin.api_key_last_used_tooltip")}},[t._v("Last Used: "+t._s(t.lastUsedTimestamp))])])])},y=[],E=a("cdb7"),T=a.n(E),S=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"editApiKeyCommentModal-".concat(t.keyId),size:"md","hide-header-close":"","no-stacking":"",title:t.$t("admin.edit_api_key_comment")},scopedSlots:t._u([{key:"modal-footer",fn:function(a){var n=a.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return n()}}},[t._v(t._s(t.$t("message.close")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){return t.updateComment()}}},[t._v(t._s(t.$t("message.update")))])]}}])},[e("b-input-group-form-input",{attrs:{id:"name-input","input-group-size":"mb-3",type:"text",lazy:"true",feedback:"true",autofocus:"false",label:t.$t("admin.api_key_comment")},model:{value:t.comment,callback:function(e){t.comment=e},expression:"comment"}})],1)},U=[],L={mixins:[d["a"]],components:{BInputGroupFormInput:p["a"]},props:{keyId:String,apiKey:Object},data:function(){return{comment:null}},mounted:function(){this.comment=this.apiKey.comment},methods:{updateComment:function(){var t=this;this.axios.post("".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM,"/key/").concat(this.apiKey.key,"/comment"),this.comment,{headers:{"Content-Type":"text/plain"}}).then((function(e){t.apiKey.comment=e.data.comment,t.$toastr.s(t.$t("admin.api_key_comment_updated")),t.$root.$emit("bv::hide::modal","editApiKeyCommentModal-".concat(t.keyId))}))},resetValues:function(){this.comment=null}}},I=L,M=Object(h["a"])(I,S,U,!1,null,null,null),k=M.exports,C={props:{apiKey:Object,variant:String,href:String},components:{EditApiKeyCommentModal:k},computed:{keyId:function(){return T()(this.apiKey.key).result()},comment:function(){return this.apiKey.comment?this.apiKey.comment:"No comment"},createdTimestamp:function(){return this.apiKey.created?r["a"].formatTimestamp(this.apiKey.created,!0):"N/A"},lastUsedTimestamp:function(){return this.apiKey.lastUsed?r["a"].formatTimestamp(this.apiKey.lastUsed,!0):"N/A"}}},O=C,N=(a("e41a"),Object(h["a"])(O,$,y,!1,null,"d39c319a",null)),G=N.exports,R=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectLdapGroupModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_ldap_group")},scopedSlots:t._u([{key:"modal-footer",fn:function(a){var n=a.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return n()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},w=[],x={mixins:[d["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("admin.distinguished_name"),field:"dn",sortable:!1,formatter:function(t,e,a){return o.a.inHTMLData(r["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"server",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){if(t){for(var a=[],n=0;n<t.length;n++)a[n]={dn:t[n]};return a.total=e.getResponseHeader("X-Total-Count"),a}return t={},t.total=0,t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_LDAP_GROUPS)}}}},P=x,D=Object(h["a"])(P,R,w,!1,null,null,null),B=D.exports,K=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectOidcGroupModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_oidc_group")},scopedSlots:t._u([{key:"modal-footer",fn:function(a){var n=a.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return n()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},z=[],V={mixins:[d["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("admin.oidc_group_name"),field:"name",sortable:!1,formatter:function(t,e,a){return o.a.inHTMLData(r["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"server",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){return t?(t.total=e.getResponseHeader("X-Total-Count"),t):(t={},t.total=0,t)},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_GROUP)}}}},Y=V,F=Object(h["a"])(Y,K,z,!1,null,null,null),q=F.exports,j=a("ae28"),H=a("f1fb"),W={props:{header:String},mixins:[v["a"]],components:{CreateTeamModal:_},mounted:function(){var t=this;g["a"].$on("admin:teams:rowUpdate",(function(e,a){t.$refs.table.updateRow({index:e,row:a}),t.$refs.table.expandRow(e)})),g["a"].$on("admin:teams:rowDeleted",(function(e,a){t.refreshTable()}))},beforeDestroy:function(){g["a"].$off("admin:teams:rowUpdate"),g["a"].$off("admin:teams:rowDeleted")},data:function(){var t=this;return{columns:[{title:this.$t("admin.team_name"),field:"name",sortable:!1,formatter:function(t,e,a){return o.a.inHTMLData(r["a"].valueWithDefault(t,""))}},{title:this.$t("admin.api_keys"),field:"apiKeys",sortable:!1,formatter:function(t,e,a){return t?o.a.inHTMLData(r["a"].valueWithDefault(t.length,"0")):0}},{title:this.$t("admin.members"),field:"members",sortable:!1,formatter:function(t,e,a){var n=0;return e.managedUsers&&(n+=e.managedUsers.length),e.ldapUsers&&(n+=e.ldapUsers.length),e.oidcUsers&&(n+=e.oidcUsers.length),n}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,icons:{refresh:"fa-refresh"},detailView:!0,detailViewIcon:!1,detailViewByClick:!0,detailFormatter:function(e,a){return t.vueFormatter({i18n:c["a"],template:'\n                <b-row class="expanded-row">\n                  <b-col sm="6">\n                    <b-input-group-form-input id="input-team-name" :label="$t(\'admin.team_name\')" input-group-size="mb-3"\n                                              required="true" type="text" v-model="name" lazy="true" autofocus="true"\n                                              v-debounce:750ms="updateTeam" :debounce-events="\'keyup\'" />\n                    <b-form-group :label="this.$t(\'admin.api_keys\')">\n                      <div class="list-group">\n                        <span v-for="apiKey in apiKeys">\n                          <api-key-list-group-item :team-uuid="team.uuid" :api-key="apiKey" :delete-icon="true" v-on:removeClicked="removeApiKey(apiKey)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="createApiKey()"/>\n                      </div>\n                    </b-form-group>\n                    <b-form-group :label="this.$t(\'admin.permissions\')">\n                      <div class="list-group">\n                        <span v-for="permission in permissions">\n                          <actionable-list-group-item :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectPermissionModal\')"/>\n                      </div>\n                    </b-form-group>\n                    <b-form-group :label="this.$t(\'admin.mapped_ldap_groups\')">\n                      <div class="list-group">\n                        <span v-for="ldapGroup in ldapGroups">\n                          <actionable-list-group-item :value="ldapGroup.dn" :delete-icon="true" v-on:actionClicked="removeLdapGroupMapping(ldapGroup.uuid)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectLdapGroupModal\')"/>\n                      </div>\n                    </b-form-group>\n                    <b-form-group :label="this.$t(\'admin.mapped_oidc_groups\')">\n                      <div class="list-group">\n                        <span v-for="mappedOidcGroup in mappedOidcGroups">\n                          <actionable-list-group-item :value="mappedOidcGroup.group.name" :delete-icon="true" v-on:actionClicked="removeOidcGroupMapping(mappedOidcGroup.uuid)"/>\n                        </span>\n                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit(\'bv::show::modal\', \'selectOidcGroupModal\')"/>\n                      </div>\n                    </b-form-group>\n                  </b-col>\n                  <b-col sm="6">\n                    <b-form-group v-if="managedUsers && managedUsers.length > 0" :label="this.$t(\'admin.managed_users\')">\n                      <div class="list-group">\n                        <span v-for="managedUser in managedUsers">\n                          <actionable-list-group-item :value="managedUser.username" :delete-icon="true" v-on:actionClicked="removeUser(managedUser)"/>\n                        </span>\n                      </div>\n                    </b-form-group>\n                    <b-form-group v-if="ldapUsers && ldapUsers.length > 0"  :label="this.$t(\'admin.ldap_users\')">\n                      <div class="list-group">\n                        <span v-for="ldapUser in ldapUsers">\n                          <actionable-list-group-item :value="ldapUser.username" :delete-icon="true" v-on:actionClicked="removeUser(ldapUser)"/>\n                        </span>\n                      </div>\n                    </b-form-group>\n                    <b-form-group v-if="oidcUsers && oidcUsers.length > 0"  :label="this.$t(\'admin.oidc_users\')">\n                      <div class="list-group">\n                        <span v-for="oidcUser in oidcUsers">\n                          <actionable-list-group-item :value="oidcUser.username" :delete-icon="true" v-on:actionClicked="removeUser(oidcUser)"/>\n                        </span>\n                      </div>\n                    </b-form-group>\n                    <div style="text-align:right">\n                       <b-button variant="outline-danger" @click="deleteTeam">{{ $t(\'admin.delete_team\') }}</b-button>\n                    </div>\n                  </b-col>\n                  <select-permission-modal v-on:selection="updatePermissionSelection" />\n                  <select-ldap-group-modal v-on:selection="updateLdapGroupSelection" />\n                  <select-oidc-group-modal v-on:selection="updateOidcGroupSelection" />\n                </b-row>\n              ',mixins:[d["a"]],components:{cSwitch:H["o"],ActionableListGroupItem:A["a"],ApiKeyListGroupItem:G,SelectLdapGroupModal:B,SelectOidcGroupModal:q,SelectPermissionModal:j["a"],BInputGroupFormInput:p["a"]},data:function(){return{team:a,name:a.name,apiKeys:a.apiKeys,permissions:a.permissions,ldapGroups:a.mappedLdapGroups,mappedOidcGroups:a.mappedOidcGroups,managedUsers:a.managedUsers,ldapUsers:a.ldapUsers,oidcUsers:a.oidcUsers,labelIcon:{dataOn:"✓",dataOff:"✕"}}},methods:{updateTeam:function(){var t=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM);this.axios.post(a,{uuid:this.team.uuid,name:this.name}).then((function(a){t.team=a.data,g["a"].$emit("admin:teams:rowUpdate",e,t.team),t.$toastr.s(t.$t("message.updated"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},deleteTeam:function(){var t=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM);this.axios.delete(a,{data:{uuid:this.team.uuid}}).then((function(a){g["a"].$emit("admin:teams:rowDeleted",e),t.$toastr.s(t.$t("admin.team_deleted"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},createApiKey:function(){var t=this,e="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM,"/").concat(this.team.uuid,"/key");this.axios.put(e).then((function(e){t.apiKeys?t.apiKeys.push(e.data):t.apiKeys=[e.data],t.$toastr.s(t.$t("message.updated"))})).catch((function(e){t.$toastr.w(t.$t("condition.unsuccessful_action"))}))},removeApiKey:function(t){var e=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM,"/key/").concat(t.key);this.axios.delete(a).then((function(a){for(var n=[],i=0;i<e.apiKeys.length;i++)e.apiKeys[i].key!==t.key&&n.push(e.apiKeys[i]);e.apiKeys=n,e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},updateLdapGroupSelection:function(t){var e=this;this.$root.$emit("bv::hide::modal","selectLdapGroupModal");for(var a=0;a<t.length;a++){var n=t[a],i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_LDAP_MAPPING);this.axios.put(i,{team:this.team.uuid,dn:n.dn}).then((function(t){void 0!==e.ldapGroups&&null!==e.ldapGroups||(e.ldapGroups=[]),e.ldapGroups.push(t.data),e.ldapGroups.sort(),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){304===t.response.status||e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}},removeLdapGroupMapping:function(t){var e=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_LDAP_MAPPING,"/").concat(t);this.axios.delete(a).then((function(a){for(var n=[],i=0;i<e.ldapGroups.length;i++)e.ldapGroups[i].uuid!==t&&n.push(e.ldapGroups[i]);e.ldapGroups=n,e.team.mappedLdapGroups=e.ldapGroups,e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},updateOidcGroupSelection:function(t){var e=this;this.$root.$emit("bv::hide::modal","selectOidcGroupModal");for(var a=0;a<t.length;a++){var n=t[a],i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_MAPPING);this.axios.put(i,{team:this.team.uuid,group:n.uuid}).then((function(t){void 0!==e.mappedOidcGroups&&null!==e.mappedOidcGroups||(e.mappedOidcGroups=[]),e.mappedOidcGroups.push(t.data),e.mappedOidcGroups.sort(),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){304===t.response.status||e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}},removeOidcGroupMapping:function(t){var e=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_OIDC_MAPPING,"/").concat(t);this.axios.delete(a).then((function(a){for(var n=[],i=0;i<e.mappedOidcGroups.length;i++)e.mappedOidcGroups[i].uuid!==t&&n.push(e.mappedOidcGroups[i]);e.mappedOidcGroups=n,e.team.mappedOidcGroups=e.mappedOidcGroups,e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},updatePermissionSelection:function(t){var e=this;this.$root.$emit("bv::hide::modal","selectPermissionModal");for(var a=0;a<t.length;a++){var n=t[a],i="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION,"/").concat(n.name,"/team/").concat(this.team.uuid);this.axios.post(i).then((function(t){e.syncVariables(t.data),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){304===t.response.status||e.$toastr.w(e.$t("condition.unsuccessful_action"))}))}},removePermission:function(t){var e=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION,"/").concat(t.name,"/team/").concat(this.team.uuid);this.axios.delete(a).then((function(t){e.syncVariables(t.data),e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},removeUser:function(t){var e=this,a="".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_USER,"/").concat(t.username,"/membership");this.axios.delete(a,{data:{uuid:this.team.uuid}}).then((function(a){if(e.managedUsers){for(var n=[],i=0;i<e.managedUsers.length;i++)e.managedUsers[i].username!==t.username&&n.push(e.managedUsers[i]);e.managedUsers=n}if(e.ldapUsers){for(var s=[],o=0;o<e.ldapUsers.length;o++)e.ldapUsers[o].username!==t.username&&s.push(e.ldapUsers[o]);e.ldapUsers=s}if(e.oidcUsers){for(var r=[],c=0;c<e.oidcUsers.length;c++)e.oidcUsers[c].username!==t.username&&r.push(e.oidcUsers[c]);e.oidcUsers=r}e.$toastr.s(e.$t("message.updated"))})).catch((function(t){e.$toastr.w(e.$t("condition.unsuccessful_action"))}))},syncVariables:function(t){this.team=t,t.apiKeys&&(this.apiKeys=t.apiKeys),this.permissions=t.permissions}}})},onExpandRow:this.vueFormatterInit,toolbar:"#customToolbar",responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_TEAM)}}},methods:{refreshTable:function(){this.$refs.table.refresh({silent:!0})}}},J=W,X=Object(h["a"])(J,n,i,!1,null,null,null);e["default"]=X.exports},"7c15":function(t,e,a){"use strict";var n=a("a4c1");function i(t,e){var a="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!a){if(Array.isArray(t)||(a=s(t))||e&&t&&"number"==typeof t.length){a&&(t=a);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,r=!0,c=!1;return{s:function(){a=a.call(t)},n:function(){var t=a.next();return r=t.done,t},e:function(t){c=!0,o=t},f:function(){try{r||null==a.return||a.return()}finally{if(c)throw o}}}}function s(t,e){if(t){if("string"==typeof t)return o(t,e);var a={}.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?o(t,e):void 0}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,n=Array(e);a<e;a++)n[a]=t[a];return n}e["a"]={data:function(){return{PERMISSIONS:{BOM_UPLOAD:n["f"],VIEW_PORTFOLIO:n["A"],PORTFOLIO_MANAGEMENT:n["m"],PORTFOLIO_MANAGEMENT_CREATE:n["n"],PORTFOLIO_MANAGEMENT_READ:n["p"],PORTFOLIO_MANAGEMENT_UPDATE:n["q"],PORTFOLIO_MANAGEMENT_DELETE:n["o"],VIEW_VULNERABILITY:n["B"],VULNERABILITY_ANALYSIS:n["C"],VULNERABILITY_ANALYSIS_CREATE:n["D"],VULNERABILITY_ANALYSIS_READ:n["E"],VULNERABILITY_ANALYSIS_UPDATE:n["F"],VIEW_POLICY_VIOLATION:n["z"],VULNERABILITY_MANAGEMENT:n["G"],VULNERABILITY_MANAGEMENT_CREATE:n["H"],VULNERABILITY_MANAGEMENT_READ:n["J"],VULNERABILITY_MANAGEMENT_UPDATE:n["K"],VULNERABILITY_MANAGEMENT_DELETE:n["I"],POLICY_VIOLATION_ANALYSIS:n["l"],ACCESS_MANAGEMENT:n["a"],ACCESS_MANAGEMENT_CREATE:n["b"],ACCESS_MANAGEMENT_READ:n["d"],ACCESS_MANAGEMENT_UPDATE:n["e"],ACCESS_MANAGEMENT_DELETE:n["c"],SYSTEM_CONFIGURATION:n["s"],SYSTEM_CONFIGURATION_CREATE:n["t"],SYSTEM_CONFIGURATION_READ:n["v"],SYSTEM_CONFIGURATION_UPDATE:n["w"],SYSTEM_CONFIGURATION_DELETE:n["u"],PROJECT_CREATION_UPLOAD:n["r"],POLICY_MANAGEMENT:n["g"],POLICY_MANAGEMENT_CREATE:n["h"],POLICY_MANAGEMENT_READ:n["j"],POLICY_MANAGEMENT_UPDATE:n["k"],POLICY_MANAGEMENT_DELETE:n["i"],TAG_MANAGEMENT:n["x"],TAG_MANAGEMENT_DELETE:n["y"]}}},computed:{decodedToken:function(){return n["L"](n["M"]())}},methods:{isPermitted:function(t){if("string"==typeof t)return n["N"](t,this.decodedToken);if(Array.isArray(t)){var e,a=i(t);try{for(a.s();!(e=a.n()).done;){var s=e.value;if(n["N"](s,this.decodedToken))return!0}}catch(o){a.e(o)}finally{a.f()}return!1}throw new Error("permission must be of type string or array")},isNotPermitted:function(t){if("string"==typeof t)return!n["N"](t,this.decodedToken);if(Array.isArray(t)){var e,a=i(t);try{for(a.s();!(e=a.n()).done;){var s=e.value;if(n["N"](s,this.decodedToken))return!1}}catch(o){a.e(o)}finally{a.f()}return!0}throw new Error("permission must be of type string or array")}}}},"847e":function(t,e,a){"use strict";a("c02e")},a761:function(t,e,a){},ae28:function(t,e,a){"use strict";var n=function(){var t=this,e=t._self._c;return e("b-modal",{attrs:{id:"selectPermissionModal",size:"lg","hide-header-close":"","no-stacking":"",title:t.$t("admin.select_permission")},scopedSlots:t._u([{key:"modal-footer",fn:function(a){var n=a.cancel;return[e("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(t){return n()}}},[t._v(t._s(t.$t("message.cancel")))]),e("b-button",{attrs:{size:"md",variant:"primary"},on:{click:function(e){t.$emit("selection",t.$refs.table.getSelections())}}},[t._v(t._s(t.$t("message.select")))])]}}])},[e("bootstrap-table",{ref:"table",attrs:{columns:t.columns,data:t.data,options:t.options}})],1)},i=[],s=a("6c36"),o=a.n(s),r=a("7c15"),c=a("900c"),u={mixins:[r["a"]],data:function(){return{labelIcon:{dataOn:"✓",dataOff:"✕"},columns:[{field:"state",checkbox:!0,align:"center"},{title:this.$t("message.name"),field:"name",sortable:!0,formatter:function(t,e,a){return o.a.inHTMLData(c["a"].valueWithDefault(t,""))}}],data:[],options:{search:!0,showColumns:!0,showRefresh:!0,pagination:!0,silentSort:!1,sidePagination:"client",queryParamsType:"pageSize",pageList:"[10, 25, 50, 100]",pageSize:10,maintainMetaData:!0,icons:{refresh:"fa-refresh"},responseHandler:function(t,e){return t.total=e.getResponseHeader("X-Total-Count"),t},url:"".concat(this.$api.BASE_URL,"/").concat(this.$api.URL_PERMISSION)}}}},l=u,d=a("2877"),p=Object(d["a"])(l,n,i,!1,null,null,null);e["a"]=p.exports},c02e:function(t,e,a){},cdb7:function(t,e,a){
/**
 * @preserve
 * JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
 *
 * @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
 * @see http://github.com/homebrewing/brauhaus-diff
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */
(function(){var e;function a(t,n){var i=this instanceof a?this:e;if(i.reset(n),"string"===typeof t&&t.length>0&&i.hash(t),i!==this)return i}a.prototype.hash=function(t){var e,a,n,i,s;switch(s=t.length,this.len+=s,a=this.k1,n=0,this.rem){case 0:a^=s>n?65535&t.charCodeAt(n++):0;case 1:a^=s>n?(65535&t.charCodeAt(n++))<<8:0;case 2:a^=s>n?(65535&t.charCodeAt(n++))<<16:0;case 3:a^=s>n?(255&t.charCodeAt(n))<<24:0,a^=s>n?(65280&t.charCodeAt(n++))>>8:0}if(this.rem=s+this.rem&3,s-=this.rem,s>0){e=this.h1;while(1){if(a=11601*a+3432906752*(65535&a)&4294967295,a=a<<15|a>>>17,a=13715*a+461832192*(65535&a)&4294967295,e^=a,e=e<<13|e>>>19,e=5*e+3864292196&4294967295,n>=s)break;a=65535&t.charCodeAt(n++)^(65535&t.charCodeAt(n++))<<8^(65535&t.charCodeAt(n++))<<16,i=t.charCodeAt(n++),a^=(255&i)<<24^(65280&i)>>8}switch(a=0,this.rem){case 3:a^=(65535&t.charCodeAt(n+2))<<16;case 2:a^=(65535&t.charCodeAt(n+1))<<8;case 1:a^=65535&t.charCodeAt(n)}this.h1=e}return this.k1=a,this},a.prototype.result=function(){var t,e;return t=this.k1,e=this.h1,t>0&&(t=11601*t+3432906752*(65535&t)&4294967295,t=t<<15|t>>>17,t=13715*t+461832192*(65535&t)&4294967295,e^=t),e^=this.len,e^=e>>>16,e=51819*e+2246770688*(65535&e)&4294967295,e^=e>>>13,e=44597*e+3266445312*(65535&e)&4294967295,e^=e>>>16,e>>>0},a.prototype.reset=function(t){return this.h1="number"===typeof t?t:0,this.rem=this.k1=this.len=0,this},e=new a,t.exports=a})()},e41a:function(t,e,a){"use strict";a("a761")},e68f:function(t,e,a){"use strict";var n=function(){var t=this,e=t._self._c;return e("li",{staticClass:"list-group-item align-middle"},[e("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"pull-right action-icon",attrs:{size:"sm",title:t.tooltip},on:{click:function(e){return t.$emit("actionClicked")}}},[this.addIcon?e("span",{staticClass:"fa fa-plus-square"}):t._e(),this.deleteIcon?e("span",{staticClass:"fa fa-trash-o"}):t._e()]),t.$slots&&t.$slots.default&&t.$slots.default[0]?t._t("default"):e("span",[this.href?e("a",{attrs:{href:t.href}},[t._v(t._s(t.value))]):e("span",[t._v(t._s(t.value))]),t._v(" ")])],2)},i=[],s={props:{value:String,tooltip:String,addIcon:Boolean,deleteIcon:Boolean,variant:String,href:String}},o=s,r=(a("847e"),a("2877")),c=Object(r["a"])(o,n,i,!1,null,"683f4500",null);e["a"]=c.exports}}]);