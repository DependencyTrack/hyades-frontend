<template>
  <div>
    <b-row class="expanded-row">
      <b-col sm="6">
        <b-form-group :label="this.$t('admin.team_membership')">
          <div class="list-group">
            <span v-for="team in teams" :key="team.name">
              <actionable-list-group-item
                :tooltip="$t('admin.remove_team_membership')"
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
                :tooltip="$t('admin.remove_permission')"
                :value="permission.name"
                :delete-icon="true"
                v-on:actionClicked="removePermission(permission)"
              />
            </span>
            <actionable-list-group-item
              :add-icon="true"
              v-on:actionClicked="openPermissionModal"
            />
          </div>
        </b-form-group>
      </b-col>
      <b-col sm="6" v-if="userType === 'managed'">
        <b-input-group-form-input
          id="input-managed-user-fullname"
          :label="$t('message.fullname')"
          input-group-size="mb-3"
          required="true"
          type="text"
          v-model="fullname"
          lazy="true"
          v-debounce:750ms="updateUser"
          :debounce-events="'keyup'"
        />
        <b-input-group-form-input
          id="input-managed-user-email"
          :label="$t('message.email')"
          input-group-size="mb-3"
          required="true"
          type="text"
          v-model="email"
          lazy="true"
          v-debounce:750ms="updateUser"
          :debounce-events="'keyup'"
        />
        <c-switch
          id="forcePasswordChange"
          color="primary"
          v-model="forcePasswordChange"
          label
          v-bind="labelIcon"
        />{{ $t('admin.change_password_next_login') }}
        <br />
        <c-switch
          id="nonExpiryPassword"
          color="primary"
          v-model="nonExpiryPassword"
          label
          v-bind="labelIcon"
        />{{ $t('admin.password_never_expires') }}
        <br />
        <c-switch
          id="suspended"
          color="primary"
          v-model="suspended"
          label
          v-bind="labelIcon"
        />{{ $t('admin.suspended') }}
        <div style="text-align: right">
          <b-button
            variant="outline-primary"
            @click="$root.$emit('bv::show::modal', 'changePasswordModal')"
            >{{ $t('admin.change_password') }}</b-button
          >
          <b-button variant="outline-danger" @click="deleteUser">
            {{ $t('admin.delete_user') }}
          </b-button>
        </div>
      </b-col>
      <b-col sm="6" v-else>
        <div style="text-align: right">
          <b-button variant="outline-danger" @click="deleteUser">
            {{ $t('admin.delete_user') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row class="expanded-row p-3" colspan="2">
      <div class="w-100">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="m-0">{{ this.$t('message.project_roles') }}</label>
          <b-form-input
            id="project-roles-table-seaerch"
            type="search"
            class="w-25"
            :placeholder="$t('message.search')"
            v-model="tableFilter"
          ></b-form-input>
        </div>
        <user-project-roles-table
          :username="username"
          :projectRoles="projectRoles"
          :availableRoles="availableRoles"
          :tableOptions="{ tableFilter }"
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

    <change-password-modal :managed-user="this.row" />
  </div>
</template>

<script>
import ActionableListGroupItem from '../ActionableListGroupItem';
import SelectTeamModal from '@/views/administration/accessmanagement/SelectTeamModal';
import SelectPermissionModal from '@/views/administration/accessmanagement/SelectPermissionModal';
import { Switch as cSwitch } from '@coreui/vue';
import BInputGroupFormInput from '@/forms/BInputGroupFormInput';
import i18n from '../../../i18n';
import EventBus from '../../../shared/eventbus';
import UserProjectRolesTable from '../UserProjectRolesTable';
import ChangePasswordModal from '@/views/administration/accessmanagement/ChangePasswordModal';

export default {
  i18n,
  props: {
    index: { type: Number, required: true },
    row: { type: Object, required: true },
    userType: {
      type: String,
      required: true,
      validator: (value) => ['oidc', 'ldap', 'managed'].includes(value),
    },
    rowEvents: {
      cacheKey: { type: String },
      update: { type: String },
      delete: { type: String },
    },
  },
  components: {
    cSwitch,
    ActionableListGroupItem,
    SelectTeamModal,
    SelectPermissionModal,
    ChangePasswordModal,
    BInputGroupFormInput,
    UserProjectRolesTable,
  },
  data() {
    return {
      user: this.row,
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      fullname: this.row.fullname,
      email: this.row.email,
      forcePasswordChange: this.row.forcePasswordChange,
      nonExpiryPassword: this.row.nonExpiryPassword,
      suspended: this.row.suspended,
      projectRoles: null,
      availableRoles: null,
      tableFilter: '',
      supressSwitchWatchers: false,
      counter: 0,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  beforeMount: async function () {
    // Initialize from session cache if available
    if (sessionStorage.getItem(this.currentUserCacheKey)) {
      try {
        const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}?userType=${this.userType}&username=${this.username}`;
        const response = await this.axios.get(endpoint);
        sessionStorage.removeItem(this.currentUserCacheKey);
        EventBus.$emit(this.rowEvents.update, this.index, response.data);
      } catch (error) {
        const username = this.row[this._identifierField];
        console.error(
          `Failed to initialize from session cache for user "${username}" (type: ${this.rowEvents.userType}):`,
        );
        this.handleError(error);
      }
    }
  },
  mounted() {
    this.loadUserProjects();
    this.loadAvailableProjectRoles();
  },
  watch: {
    forcePasswordChange() {
      if (this.supressSwitchWatchers) return;
      this.updateUser();
    },
    nonExpiryPassword() {
      if (this.supressSwitchWatchers) return;
      this.updateUser();
    },
    async suspended(newValue) {
      if (this.supressSwitchWatchers) return;

      // If suspending self, confirm first
      if (newValue && this.$currentUser.username === this.username) {
        const confirmed = await this.confirmAction('Suspend');
        if (confirmed) {
          this.updateUser();
          return;
        }
        // Undo the change and suppress watcher recursion
        this.supressSwitchWatchers = true;
        this.suspended = false;
        this.$nextTick(() => {
          this.supressSwitchWatchers = false;
        });
        return;
      }

      // All other cases
      this.updateUser();
    },
    user: {
      handler: function (newValue) {
        this.username = newValue.username;
        this.fullname = newValue.fullname ?? this.fullname;
        this.email = newValue.email;
        this.teams = newValue.teams;
        this.permissions = newValue.permissions;
        this.forcePasswordChange = newValue.forcePasswordChange;
        this.nonExpiryPassword = newValue.nonExpiryPassword;
        this.suspended = newValue.suspended;

        this.supressSwitchWatchers = true;
        // needs to be done after the DOM is updated
        this.$nextTick(() => {
          this.supressSwitchWatchers = false;
        });
      },
      deep: true,
    },
  },
  computed: {
    userApiEndpoint() {
      switch (this.userType) {
        case 'oidc':
          return `${this.$api.BASE_URL}/${this.$api.URL_USER_OIDC}`;
        case 'ldap':
          return `${this.$api.BASE_URL}/${this.$api.URL_USER_LDAP}`;
        case 'managed':
          return `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
        default:
          return `${this.$api.BASE_URL}/${this.$api.URL_USER}`;
      }
    },
    currentUserCacheKey() {
      return `${this.rowEvents.cacheKey}:${this.username}`;
    },
  },
  methods: {
    // Loads the user roles for a specific user. return data if targetField is null
    loadUserProjects: async function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}/${this.username}/role`;
      try {
        const response = await this.axios.get(endpoint);
        this.$set(this, 'projectRoles', response.data);
      } catch (error) {
        this.handleError(error, tMsg);
        const tMsg = this.$t('message.project_role_mappings_failed');
        this.$set(this, 'projectRoles', []);
      }
    },

    // Loads the user roles for a specific user. return data if targetField is null
    loadAvailableProjectRoles: async function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      try {
        const response = await this.axios.get(endpoint);
        this.$set(this, 'availableRoles', response.data);
      } catch (error) {
        this.$set(this, 'availableRoles', []);
        const tMsg = this.$t('message.available_roles_failed');
        this.handleError(error, tMsg);
      }
    },

    openPermissionModal() {
      this.$root.$emit('bv::show::modal', 'selectPermissionModal');
    },
    openProjectModal() {
      this.$root.$emit('bv::show::modal', 'selectProjectModal');
    },
    confirmAction(action) {
      const h = this.$createElement;
      const message =
        'Warning: You are about to perform this action on your own account. This may result in losing access or being locked out. Are you sure you want to continue?';
      const titleVNode = h('div', {
        domProps: { innerHTML: `Confirm <strong><b>${action}</b><strong>` },
      });
      const messageVNode = h('div', [
        h('p', { class: ['text-center'] }, message),
      ]);

      return this.$bvModal.msgBoxConfirm([messageVNode], {
        title: titleVNode,
        okVariant: 'danger',
        okTitle: action,
        centered: true,
      });
    },
    updateUser: function () {
      this.axios
        .post(this.userApiEndpoint, {
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
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    deleteUser: async function () {
      if (this.$currentUser.username === this.username) {
        const confirmed = await this.confirmAction('Delete');
        if (!confirmed) return;
      }

      try {
        await this.axios.delete(this.userApiEndpoint, {
          data: { username: this.row.username },
        });

        EventBus.$emit(this.rowEvents.delete, this.index);
        sessionStorage.removeItem(this.currentUserCacheKey);

        this.$toastr.s(this.$t('admin.user_deleted'));
      } catch (error) {
        this.handleError(error);
      }
    },

    updateTeamSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MEMBERSHIP}`;
      const requestBody = {
        username: this.username,
        teams: selections.map((team) => team.uuid),
        userType: this.userType,
      };

      try {
        const response = await this.axios.put(endpoint, requestBody);
        this.syncVariables(response);
      } catch (error) {
        if (error.response?.status === 304) return;
        this.handleError(error);
      }
    },

    removeTeamMembership: async function (teamUUID) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership?userType=${this.userType}`;

      try {
        const response = await this.axios.delete(endpoint, {
          data: { uuid: teamUUID },
        });
        this.syncVariables(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    updatePermissionSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_PERMISSION}`;
      const requestBody = {
        username: this.username,
        permissions: selections.map((selection) => selection.name),
        userType: this.userType,
      };

      try {
        const response = await this.axios.put(endpoint, requestBody);
        this.syncVariables(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    removePermission: async function (permission) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${this.username}?userType=${this.userType}`;
      try {
        const response = await this.axios.delete(endpoint);
        this.syncVariables(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    addProjectRole: function (projectRole, callbacks) {
      this.handleProjectRole('add', projectRole, callbacks).then(() =>
        this.loadUserProjects(),
      );
    },

    updateProjectRole: function (projectRole, callbacks) {
      this.handleProjectRole('update', projectRole, callbacks);
    },

    removeProjectRole: function (projectRole, callbacks) {
      this.handleProjectRole('remove', projectRole, callbacks).then(() =>
        this.loadUserProjects(),
      );
    },

    // -- init methods --
    initFromSessionCache: async function () {
      try {
        if (sessionStorage.getItem(this.currentUserCacheKey)) {
          const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}?userType=${this.userType}&username=${this.username}`;
          const response = await this.axios.get(endpoint);
          sessionStorage.removeItem(this.currentUserCacheKey);
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
        }
      } catch (error) {
        const msg = `Failed to initialize from session cache for user "${this.username}" (type: ${this.userType}):`;
        console.error(msg);
        this.handleError(error);
      }
    },

    // -- utility methods --
    handleProjectRole: async function (action, projectRole, callbacks = null) {
      const { role, project } = projectRole;
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_ROLE}`;
      const requestBody = {
        username: this.username,
        role,
        project,
      };

      try {
        let response;
        let successMessage;
        switch (action) {
          case 'add':
          case 'update':
            response = await this.axios.put(endpoint, requestBody);
            successMessage =
              action === 'add'
                ? this.$t('admin.role_assigned')
                : this.$t('admin.role_updated');
            break;
          case 'remove':
            response = await this.axios.delete(endpoint, { data: requestBody });
            successMessage = this.$t('admin.role_deleted');
            break;
          default:
            throw new Error(`Invalid action: ${action}`);
        }

        this.$toastr.s(successMessage);
        callbacks?.success?.(response);
      } catch (error) {
        this.handleError(error);
        callbacks?.error?.(error);
      }
    },

    handleError: function (error, toastMessage) {
      const msg = toastMessage ?? this.$t('condition.unsuccessful_action');
      console.error(error);
      this.$toastr.e(msg);
    },

    syncVariables: function (response) {
      this.$set(this, 'user', response.data);
      this.$toastr.s(this.$t('message.updated'));
      sessionStorage.setItem(this.currentUserCacheKey, new Date().toString());
    },
  },
};
</script>
