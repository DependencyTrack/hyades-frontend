<template>
  <b-card no-body :header="header">
    <b-card-body>
      <div id="customToolbar">
        <b-button
          size="md"
          variant="outline-primary"
          v-b-modal.createOidcUserModal
        >
          <span class="fa fa-plus"></span> {{ $t('admin.create_user') }}
        </b-button>
      </div>
      <bootstrap-table
        ref="table"
        :columns="columns"
        :data="data"
        :options="options"
      >
      </bootstrap-table>
    </b-card-body>
    <create-oidc-user-modal v-on:refreshTable="refreshTable" />
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../shared/common';
import i18n from '../../../i18n';
import CreateOidcUserModal from './CreateOidcUserModal';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import EventBus from '../../../shared/eventbus';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import ProjectRoleListGroupItem from './ProjectRoleListGroupItem.vue';
import SelectTeamModal from './SelectTeamModal';
import SelectPermissionModal from './SelectPermissionModal';
import permissionsMixin from '../../../mixins/permissionsMixin';
import SelectProjectModal from './SelectProjectModal.vue';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  components: {
    CreateOidcUserModal,
  },
  mounted() {
    EventBus.$on('admin:oidcusers:rowUpdate', (index, row) => {
      this.$refs.table.updateRow({ index: index, row: row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on('admin:oidcusers:rowDeleted', (index, row) => {
      this.refreshTable();
    });
  },
  beforeDestroy() {
    EventBus.$off('admin:oidcusers:rowUpdate');
    EventBus.$off('admin:oidcusers:rowDeleted');
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
          title: this.$t('admin.subject_identifier'),
          field: 'subjectIdentifier',
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
                          <actionable-list-group-item :value="team.name" :delete-icon="true" v-on:actionClicked="removeTeamMembership(team.uuid)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectTeamModal')"/>
                      </div>
                    </b-form-group>
                    <b-form-group :label="this.$t('admin.roles')">
                      <div class="list-group">
                        <span v-for="mappedrole in mappedroles">
                          <actionable-list-group-item :value="mappedrole.name" :delete-icon="true" v-on:actionClicked=""/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectRoleModal')"/>
                      </div>
                    </b-form-group>
                    <b-form-group :label="this.$t('admin.permissions')">
                      <div class="list-group">
                        <span v-for="permission in permissions">
                          <actionable-list-group-item :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>
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
                  <select-role-modal v-on:selection="updateRoleSelection" :username="username" />
                  <select-team-modal v-on:selection="updateTeamSelection" />
                  <select-permission-modal v-on:selection="updatePermissionSelection" />
                  <select-role-modal v-on:selection="selectRoleModal" />
                </b-row>
              `,
            mixins: [permissionsMixin, rolesMixin],
            components: {
              ActionableListGroupItem,
              ProjectRoleListGroupItem,
              SelectRoleModal,
              SelectTeamModal,
              SelectPermissionModal,
              SelectProjectModal,
            },
            data() {
              return {
                oidcUser: row,
                username: row.username,
                teams: row.teams,
                permissions: row.permissions,
                projectRoles: [],
              };
            },
            created() {
              this.loadUserRoles(this.username);
            },
            methods: {
              getUserObjectKey: function () {
                return 'oidcUser';
              },
              getUserObject: function () {
                return this.oidcUser;
              },
              deleteUser: function () {
                let url = `${this.$api.BASE_URL}/${this.$api.URL_USER_OIDC}`;
                this.axios
                  .delete(url, {
                    data: {
                      username: this.username,
                    },
                  })
                  .then((response) => {
                    EventBus.$emit('admin:oidcusers:rowDeleted', index);
                    this.$toastr.s(this.$t('admin.user_deleted'));
                  })
                  .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              updateTeamSelection: function (selections) {
                this.$root.$emit('bv::hide::modal', 'selectTeamModal');
                for (let i = 0; i < selections.length; i++) {
                  let selection = selections[i];
                  let url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership`;
                  this.axios
                    .post(url, {
                      uuid: selection.uuid,
                    })
                    .then((response) => {
                      this.syncVariables(response.data);
                      EventBus.$emit(
                        'admin:oidcusers:rowUpdate',
                        index,
                        this.oidcUser,
                      );
                      this.$toastr.s(this.$t('message.updated'));
                    })
                    .catch((error) => {
                      if (error.response.status === 304) {
                        //this.$toastr.w(this.$t('condition.unsuccessful_action'));
                      } else {
                        this.$toastr.w(
                          this.$t('condition.unsuccessful_action'),
                        );
                      }
                    });
                }
              },
              removeTeamMembership: function (teamUUID) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.oidcUser.username}/membership`;
                const event = 'admin:oidcusers:rowUpdate';
                this._removeTeamMembership(url, event, teamUUID);
              },
              updateRoleSelection: function (selection) {
                const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.oidcUser.username}/role`;
                this._updateRoleSelection(url, selection);
              },
              removeRole: function (role) {
                this.unassignRole(role, this.username);
              },
              updatePermissionSelection: function (selections) {
                this.$root.$emit('bv::hide::modal', 'selectPermissionModal');
                this._updatePermissionSelection(selections);
              },
              removePermission: function (permission) {
                let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${this.username}`;
                this.axios
                  .delete(url)
                  .then((response) => {
                    this.syncVariables(response.data);
                    this.$toastr.s(this.$t('message.updated'));
                  })
                  .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              syncVariables: function (oidcUser) {
                this.oidcUser = oidcUser;
                this.username = oidcUser.username;
                this.teams = oidcUser.teams;
                this.roles = oidcUser.roles;
                this.permissions = oidcUser.permissions;
              },
              updateRoleSelection: function () {
                this.$root.$emit('bv::hide::modal', 'selectRoleModal');
                this.$toastr.s(this.$t('message.updated'));
                this.loadUserRoles();
                this.refreshTable();
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
        url: `${this.$api.BASE_URL}/${this.$api.URL_USER_OIDC}`,
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
