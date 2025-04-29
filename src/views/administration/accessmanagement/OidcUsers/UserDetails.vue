<template>
  <b-row class="expanded-row">
    <b-col sm="6">
      <b-form-group :label="this.$t('admin.team_membership')">
        <div class="list-group">
          <span v-for="team in teams" :key="team.name">
            <actionable-list-group-item
              :value="team.name"
              :delete-icon="true"
              v-on:actionClicked="removeTeamMembership(team.uuid)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectTeamModal')
            "
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.roles')">
        <div class="list-group">
          <span v-for="projectRole in projectRoles" :key="projectRole.name">
            <project-role-list-group-item
              :projectRole="projectRole"
              :delete-icon="true"
              v-on:removeClicked="removeRole(projectRole)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectRoleModal')
            "
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.permissions')">
        <div class="list-group">
          <span v-for="permission in permissions" :key="permission.name">
            <actionable-list-group-item
              :value="permission.name"
              :delete-icon="true"
              v-on:actionClicked="removePermission(permission)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectPermissionModal')
            "
          />
        </div>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <div style="text-align: right">
        <b-button variant="outline-danger" @click="deleteUser">{{
          $t('admin.delete_user')
        }}</b-button>
      </div>
    </b-col>
    <select-role-modal
      v-on:selection="updateRoleSelection"
      :username="username"
    />
    <select-team-modal
      :currentTeams="teams"
      v-on:selection="updateTeamSelection"
    />
    <select-permission-modal
      :currentPermissions="permissions"
      v-on:selection="updatePermissionSelection"
    />
  </b-row>
</template>
<script>
import i18n from '../../../../i18n';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import userManagementMixin from '../../../../mixins/userManagementMixin';
import ActionableListGroupItem from '../../../components/ActionableListGroupItem.vue';
import ProjectRoleListGroupItem from '../ProjectRoleListGroupItem.vue';
import SelectPermissionModal from '../SelectPermissionModal.vue';
import SelectRoleModal from '../SelectRoleModal.vue';
import SelectTeamModal from '../SelectTeamModal.vue';

export default {
  i18n,
  props: {
    index: { type: Number, required: true },
    row: { type: Object, required: true },
    rowEvents: { update: { type: String }, delete: { type: String } },
  },
  mixins: [permissionsMixin, userManagementMixin],
  components: {
    ActionableListGroupItem,
    ProjectRoleListGroupItem,
    SelectRoleModal,
    SelectTeamModal,
    SelectPermissionModal,
  },
  data() {
    return {
      oidcUser: this.row,
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      projectRoles: [],
      identifierField: 'username',
    };
  },
  created() {
    this.loadUserRoles(this.username);
  },
  methods: {
    deleteUser: function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_OIDC}`;
      const event = this.rowEvents.delete;
      this._deleteUser(endpoint, event);
    },
    updateTeamSelection: function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MEMBERSHIP}`;
      this._updateTeamSelection(endpoint, selections);
    },
    removeTeamMembership: function (teamUUID) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.oidcUser.username}/membership`;
      this._removeTeamMembership(endpoint, teamUUID);
    },
    updateRoleSelection: function (selection) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.oidcUser.username}/role`;
      this._updateRoleSelection(endpoint, selection);
    },
    removeRole: function (role) {
      this._removeRole(role);
    },
    updatePermissionSelection: function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_PERMISSION}`;
      this._updatePermissionSelection(endpoint, selections);
    },
    removePermission: function (permission) {
      this._removePermission(permission);
    },
  },
};
</script>
