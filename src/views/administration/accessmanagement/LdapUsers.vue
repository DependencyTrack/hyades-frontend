<template>
  <b-card no-body :header="header">
    <b-card-body>
      <div id="customToolbar">
        <b-button size="md" variant="outline-primary" v-b-modal.createLdapUserModal>
          <span class="fa fa-plus"></span> {{ $t('admin.create_user') }}
        </b-button>
      </div>
      <bootstrap-table v-on:refreshTable="refreshTable" ref="table" :columns="columns" :data="data" :options="options">
      </bootstrap-table>
    </b-card-body>
    <create-ldap-user-modal v-on:refreshTable="refreshTable" />
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../shared/common';
import i18n from '../../../i18n';
import CreateLdapUserModal from './CreateLdapUserModal';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import EventBus from '../../../shared/eventbus';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import ProjectRoleListGroupItem from './ProjectRoleListGroupItem.vue';
import SelectTeamModal from './SelectTeamModal';
import SelectPermissionModal from './SelectPermissionModal';
import permissionsMixin from '../../../mixins/permissionsMixin';
import SelectRoleModal from './SelectRoleModal.vue';
import userManagementMixins from '../../../mixins/userManagementMixin';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  components: {
    CreateLdapUserModal,
  },
  mounted() {
    EventBus.$on('admin:ldapusers:rowUpdate', (index, row) => {
      this.$refs.table.updateRow({ index: index, row: row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on('admin:ldapusers:rowDeleted', (index, row) => {
      this.refreshTable();
    });
  },
  beforeDestroy() {
    EventBus.$off('admin:ldapusers:rowUpdate');
    EventBus.$off('admin:ldapusers:rowDeleted');
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
          title: this.$t('admin.distinguished_name'),
          field: 'dn',
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
                        <span v-for="team in ldapUser.teams">
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
                        <span v-for="permission in ldapUser.permissions">
                          <actionable-list-group-item :tooltip="$t('admin.remove_permission')" :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectPermissionModal')"/>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <div style="text-align:right">
                       <b-button variant="outline-danger" @click="deleteUser">{{ $t('admin.delete_user') }}</b-button>
                    </div>
                  </b-col>
                  <select-team-modal v-on:selection="updateTeamSelection" />
                  <select-role-modal v-on:selection="updateRoleSelection" :username="username" />
                  <select-permission-modal v-on:selection="updatePermissionSelection" />
                </b-row>
              `,
            mixins: [permissionsMixin, userManagementMixins],
            components: {
              ActionableListGroupItem,
              ProjectRoleListGroupItem,
              SelectRoleModal,
              SelectTeamModal,
              SelectPermissionModal,
            },
            data() {
              return {
                row,
                index,
                ldapUser: row,
                username: row.username,
                teams: row.teams,
                permissions: row.permissions,
                projectRoles: [],
              };
            },
            created() {
              this.loadUserRoles(this.ldapUser.username);
            },
            methods: {
              getUserObjectKey: function () {
                return "ldapUser"
              },
              getUserObject: function () {
                return this.ldapUser
              },
              deleteUser: function () {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER_LDAP}`;
                const event = 'admin:ldapusers:rowDeleted'

                this._deleteUser(url, event)
              },
              updateTeamSelection: function (selections) {
                this.$root.$emit('bv::hide::modal', 'selectTeamModal');
                const event = 'admin:ldapusers:rowUpdate';;

                this._updateTeamSelection(event, selections)
              },
              removeTeamMembership: function (teamUUID) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership`;
                const event = 'admin:ldapusers:rowUpdate';

                this._removeTeamMembership(url, event, teamUUID);
              },
              updateRoleSelection: function (selection) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/role`;
                this._updateRoleSelection(url, selection);
              },
              removeRole: function (role) {
                this._removeRole(role);
              },
              updatePermissionSelection: function (selections) {
                this._updatePermissionSelection(selections);
              },
              removePermission: function (permission) {
                this._removePermission(permission);
              },
              syncVariables: function (userObj) {
                Object.assign(this.ldapUser, userObj)
                // Object.assign(this.ldapUser, ldapUser)
                this.loadUserRoles(this.ldapUser.username); // mixin
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
        url: `${this.$api.BASE_URL}/${this.$api.URL_USER_LDAP}`,
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
