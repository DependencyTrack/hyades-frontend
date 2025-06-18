<template>
  <div>
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
    </b-row>
    <b-row class="expanded-row p-3" colspan="2">
      <div class="" style="width: 100%">
        <label>{{ this.$t('message.project_roles') }}</label>
        <user-project-roles-table
          :parentContext="{ row, index }"
          :projectRoles="projectRoles"
          :availableRoles="availableRoles"
          @addProjectRole="addProjectRole"
          @updateProjectRole="updateProjectRole"
          @removeProjectRole="removeProjectRole"
        />
      </div>
    </b-row>
    <select-team-modal
      :currentTeams="teams"
      v-on:selection="updateTeamSelection"
    />
    <select-permission-modal
      :currentPermissions="permissions"
      v-on:selection="updatePermissionSelection"
    />
  </div>
</template>

<script>
import i18n from '../../../../i18n';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import userManagementMixin from '../../../../mixins/userManagementMixin';
import ActionableListGroupItem from '../../../components/ActionableListGroupItem.vue';
import UserProjectRolesTable from '../../../components/UserProjectRolesTable.vue';
import SelectPermissionModal from '../SelectPermissionModal.vue';
import SelectTeamModal from '../SelectTeamModal.vue';

export default {
  i18n,
  props: {
    index: { type: Number, required: true },
    row: { type: Object, required: true },
    rowEvents: {
      userType: { type: String },
      cacheKey: { type: String },
      update: { type: String },
      delete: { type: String },
    },
  },
  mixins: [permissionsMixin, userManagementMixin],
  components: {
    ActionableListGroupItem,
    SelectTeamModal,
    SelectPermissionModal,
    UserProjectRolesTable,
  },
  data() {
    return {
      user: this.row,
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      projectRoles: null,
      availableRoles: null,
    };
  },
  beforeMount() {
    this.initFromSessionCache();
  },
  mounted() {
    this.loadUserManagementData();
  },
  watch: {
    user: {
      handler(newValue) {
        this.username = newValue.username;
        this.teams = newValue.teams;
        this.permissions = newValue.permissions;
      },
      deep: true,
    },
  },
  methods: {
    deleteUser: function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_OIDC}`;
      this._deleteUser(endpoint);
    },

    updateTeamSelection: function (selections) {
      this._updateTeamSelection(selections);
    },

    removeTeamMembership: function (teamUUID) {
      this._removeTeamMembership(teamUUID);
    },

    updatePermissionSelection: function (selections) {
      this._updatePermissionSelection(selections);
    },

    removePermission: function (permission) {
      this._removePermission(permission);
    },

    addProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('add', projectRole, callbacks).then(async () => {
        this.projectRoles = await this.loadUserProjects(this.username);
      });
    },

    updateProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('update', projectRole, callbacks);
    },

    removeProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('remove', projectRole, callbacks).then(
        async () => {
          this.projectRoles = await this.loadUserProjects(this.username);
        },
      );
    },
  },
};
</script>
