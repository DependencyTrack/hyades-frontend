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
        <div v-if="loading" class="d-flex justify-content-center">
          <b-spinner variant="primary" type="grow" label="Loading"
            >Loading ...
          </b-spinner>
        </div>
        <div v-else>
          <label for="">{{ this.$t('message.projects') }}</label>
          <user-roles-table
            :parentContext="{ row, index }"
            :projectRoles="projectRoles"
            :availableRoles="availableRoles"
            @addProjectRole="addProjectRole"
            @updateProjectRole="updateProjectRole"
            @removeProjectRole="removeProjectRole"
          />
        </div>
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
import UserRolesTable from '../../../components/UserRolesTable.vue';
import SelectPermissionModal from '../SelectPermissionModal.vue';
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
    SelectTeamModal,
    SelectPermissionModal,
    UserRolesTable,
  },
  data() {
    return {
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      projectRoles: null,
      availableRoles: null,
      loading: true,
    };
  },
  mounted() {
    // Fetch user projects and available roles for each project (userManagementMixin)
    Promise.all([
      this.loadUserProjects(this.username),
      this.loadAvailableProjectRoles(),
    ])
      .then((response) => {
        this.projectRoles = response[0] || [];
        this.availableRoles = response[1] || [];
      })
      .catch((error) => {
        if (!this.axios.isAxiosError(error)) console.error(error);
        this.$toastr.e(this.$t('condition.unsuccessful_action'));
      })
      .finally(() => {
        this.loading = false;
      });
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
