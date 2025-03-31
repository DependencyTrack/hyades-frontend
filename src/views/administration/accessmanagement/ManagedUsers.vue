<template>
  <b-card no-body :header="header">
    <b-card-body>
      <div id="customToolbar">
        <b-button size="md" variant="outline-primary" v-b-modal.createManagedUserModal>
          <span class="fa fa-plus"></span> {{ $t('admin.create_user') }}
        </b-button>
      </div>
      <bootstrap-table ref="table" :columns="columns" :data="data" :options="options">
      </bootstrap-table>
    </b-card-body>
    <create-managed-user-modal v-on:refreshTable="refreshTable" />
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../shared/common';
import i18n from '../../../i18n';
import CreateManagedUserModal from './CreateManagedUserModal';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import EventBus from '../../../shared/eventbus';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import ChangePasswordModal from './ChangePasswordModal';
import SelectTeamModal from './SelectTeamModal';
import SelectPermissionModal from './SelectPermissionModal';
import permissionsMixin from '../../../mixins/permissionsMixin';
import { Switch as cSwitch } from '@coreui/vue';
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import SelectRoleModal from './SelectRoleModal.vue';
import SelectProjectModal from './SelectProjectModal.vue';
import rolesMixin from '../../../mixins/rolesMixin';
import ProjectRoleListGroupItem from './ProjectRoleListGroupItem.vue';
import userManagementMixin from '../../../mixins/userManagementMixin';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  components: {
    CreateManagedUserModal,
  },
  mounted() {
    EventBus.$on('admin:managedusers:rowUpdate', (index, row) => {
      this.$refs.table.updateRow({ index: index, row: row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on('admin:managedusers:rowDeleted', (index, row) => {
      this.refreshTable();
    });
  },
  beforeDestroy() {
    EventBus.$off('admin:managedusers:rowUpdate');
    EventBus.$off('admin:managedusers:rowDeleted');
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('message.username'),
          field: 'username',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.fullname'),
          field: 'fullname',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.email'),
          field: 'email',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('admin.teams'),
          field: 'teams',
          sortable: false,
          formatter(value, row, index) {
            return value
              ? xssFilters.inHTMLData(
                common.valueWithDefault(value.length, '0'),
              )
              : 0;
          },
        },
      ],
      data: [],
      options: {
        search: true,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sidePagination: 'client',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        icons: {
          refresh: 'fa-refresh',
        },
        detailView: true,
        detailViewIcon: false,
        detailViewByClick: true,
        detailFormatter: (index, row) => {
          return this.vueFormatter({
            i18n,
            template: `
                <b-row class="expanded-row">
                  <b-col sm="6">
                    <b-form-group :label="this.$t('admin.team_membership')">
                      <div class="list-group">
                        <span v-for="team in teams">
                          <actionable-list-group-item :tooltip="$t('admin.remove_team_membership')" :value="team.name" :delete-icon="true" v-on:actionClicked="removeTeamMembership(team.uuid)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectTeamModal')"/>
                      </div>
                    </b-form-group>
                    <b-form-group :label="this.$t('admin.roles')">
                      <div class="list-group">
                        <span v-for="projectRole in projectRoles">
                          <project-role-list-group-item :projectRole="projectRole" :delete-icon="true" v-on:removeClicked="removeRole(projectRole)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectRoleModal')"/>
                      </div>
                    </b-form-group>
                    <b-form-group :label="this.$t('admin.permissions')">
                      <div class="list-group">
                        <span v-for="permission in managedUser.permissions">
                          <actionable-list-group-item :tooltip="$t('admin.remove_permission')" :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectPermissionModal')"/>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-input-group-form-input id="input-managed-user-fullname" :label="$t('message.fullname')" input-group-size="mb-3"
                                              required="true" type="text" v-model="fullname" lazy="true"
                                              v-debounce:750ms="updateUser" :debounce-events="'keyup'" />
                    <b-input-group-form-input id="input-managed-user-email" :label="$t('message.email')" input-group-size="mb-3"
                                              required="true" type="text" v-model="email" lazy="true"
                                              v-debounce:750ms="updateUser" :debounce-events="'keyup'" />
                    <c-switch id="forcePasswordChange" color="primary" v-model="forcePasswordChange" label v-bind="labelIcon" />{{$t('admin.change_password_next_login')}}
                    <br/>
                    <c-switch id="nonExpiryPassword" color="primary" v-model="nonExpiryPassword" label v-bind="labelIcon" />{{$t('admin.password_never_expires')}}
                    <br/>
                    <c-switch id="suspended" color="primary" v-model="suspended" label v-bind="labelIcon" />{{$t('admin.suspended')}}
                    <div style="text-align:right">
                       <b-button variant="outline-primary" @click="$root.$emit('bv::show::modal', 'changePasswordModal')">{{ $t('admin.change_password') }}</b-button>
                       <b-button variant="outline-danger" @click="deleteUser">{{ $t('admin.delete_user') }}</b-button>
                    </div>
                  </b-col>
                  <select-team-modal v-on:selection="updateTeamSelection" />
                  <select-role-modal v-on:selection="updateRoleSelection" :username="username" />
                  <select-permission-modal v-on:selection="updatePermissionSelection" />
                  <change-password-modal :managed-user="managedUser" />
                </b-row>
              `,
            mixins: [permissionsMixin, userManagementMixin],
            components: {
              cSwitch,
              ActionableListGroupItem,
              SelectTeamModal,
              SelectPermissionModal,
              SelectProjectModal,
              SelectRoleModal,
              ChangePasswordModal,
              BInputGroupFormInput,
              ProjectRoleListGroupItem,
            },
            data() {
              return {
                index, row,
                managedUser: row,
                username: row.username,
                teams: row.teams,
                permissions: row.permissions,
                fullname: row.fullname,
                email: row.email,
                forcePasswordChange: row.forcePasswordChange,
                nonExpiryPassword: row.nonExpiryPassword,
                suspended: row.suspended,
                projectRoles: [],
                labelIcon: {
                  dataOn: '\u2713',
                  dataOff: '\u2715',
                },
              };
            },
            created() {
              this.loadUserRoles(this.managedUser.username)
            },
            watch: {
              forcePasswordChange() {
                this.updateUser();
              },
              nonExpiryPassword() {
                this.updateUser();
              },
              suspended() {
                this.updateUser();
              },
            },
            methods: {
              getUserObjectKey: function () {
                return "managedUser"
              },
              getUserObject: function () {
                return this.managedUser
              },
              updateUser: function () {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
                this.axios
                  .post(url, {
                    username: this.username,
                    fullname: this.fullname,
                    email: this.email,
                    newPassword: null,
                    confirmPassword: null,
                    forcePasswordChange: this.forcePasswordChange,
                    nonExpiryPassword: this.nonExpiryPassword,
                    suspended: this.suspended,
                  })
                  .then((response) => {
                    this.manageduser = response.data;
                    EventBus.$emit(
                      'admin:managedusers:rowUpdate',
                      index,
                      this.manageduser,
                    );
                    this.$toastr.s(this.$t('message.updated'));
                  })
                  .catch((error) => {
                    console.error(error)
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              deleteUser: function () {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
                this._deleteUser(url)
              },
              updateTeamSelection: function (selections) {
                this.$root.$emit('bv::hide::modal', 'selectTeamModal');
                // const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership`;
                const event = 'admin:managedusers:rowUpdate';
                this._updateTeamSelection(event, selections)
              },
              removeTeamMembership: function (teamUUID) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership`;
                const event = 'admin:managedusers:rowUpdate';
                this._removeTeamMembership(url, event, teamUUID)
              },
              updateRoleSelection: function (selection) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.managedUser.username}/role`;
                this._updateRoleSelection(url, selection);
              },
              removeRole: function (projectRole) {
                this._removeRole(projectRole)
              },
              updatePermissionSelection: function (selections) {
                this._updatePermissionSelection(selections)
              },
              removePermission: function (permission) {
                this._removePermission(permission)
              },
              syncVariables: function (managedUser) {
                Object.assign(this.managedUser, managedUser)
                this.loadUserRoles(this.managedUser.username)
              },
            },
          });
        },
        onExpandRow: this.vueFormatterInit,
        toolbar: '#customToolbar',
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`,
      },
    };
  },
  methods: {
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
  },
};
</script>
