import EventBus from '../shared/eventbus';

/**
 * A Vue.js mixin for managing user-related operations such as roles, permissions, and team memberships.
 * Provides utility methods for interacting with APIs and handling user management tasks.
 *
 * @mixin
 */
export default {
  created: function () {
    if (this.index == null || this.row == null) {
      throw new Error(
        "userManagementMixin requires 'index' and 'row' variables, which are typically provided by a detailFormatter function.",
      );
    }
  },
  async mounted() {},
  data: () => ({ _userManagementMixin_ready: false }),
  methods: {
    // -- init methods --
    initFromSessionCache: async function () {
      try {
        const cacheKey = `${this.rowEvents.cacheKey}:${this.row[this._identifierField]}`;
        if (sessionStorage.getItem(cacheKey)) {
          const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}?userType=${this.rowEvents.userType}&username=${this.row[this._identifierField]}`;
          const response = await this.axios.get(endpoint);
          sessionStorage.removeItem(cacheKey);
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
        }
      } catch (error) {
        const username = this.row[this._identifierField];
        console.error(
          `Failed to initialize from session cache for user "${username}" (type: ${this.rowEvents.userType}):`,
        );
        this.handleError(error);
      }
    },

    loadUserManagementData: function () {
      this.loadUserProjects(this.row[this._identifierField])
        .then((projectRoles) => {
          this.$set(this, 'projectRoles', projectRoles);
        })
        .catch((error) => {
          this.handleError(error, tMsg);
          const tMsg = this.$t('message.project_role_mappings_failed');
          this.$set(this, 'projectRoles', []);
        });

      this.loadAvailableProjectRoles()
        .then((availableRoles) => {
          this.$set(this, 'availableRoles', availableRoles);
        })
        .catch((error) => {
          this.$set(this, 'availableRoles', []);
          const tMsg = this.$t('message.available_roles_failed');
          this.handleError(error, tMsg);
        });
    },

    // Loads the user roles for a specific user. return data if targetField is null
    loadUserProjects: async function (username) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}/${username}/role`;
      try {
        const response = await this.axios.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    getUserObject: function () {
      throw new Error(
        'getUserObjectKey function must be implemented to use "userManagementMixin".',
      );
    },

    loadUserRoles: function (username) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}/${username}/roles`;
      this.axios
        .get(url)
        .then((response) => {
          this.projectRoles = response.data;
        })
        .catch((error) => {
          console.error('Error loading user roles:', error);
          this.projectRoles = [];
        });
    },

    // -- user management methods --
    _deleteUser: async function (endpoint) {
      this._userManagementMixin_checkReady();
      try {
        await this.axios.delete(endpoint, {
          data: {
            username: userObj.username,
          },
        })
        .then(() => {
          EventBus.$emit(updateEvent, this.index);
          this.$toastr.s(this.$t('admin.user_deleted'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _updateTeamSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MEMBERSHIP}`;
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this._identifierField]: this.row[this._identifierField],
        teams: selections.map((team) => team.uuid),
        userType: this.rowEvents.userType,
      };
      const mapCallback = async (selection) =>
        await this.axios.post(endpoint, { uuid: selection.uuid });
      const request_promises = selections
        .filter(filterCallback)
        .map(mapCallback);

    _removeTeamMembership: async function (teamUUID) {
      const username = this.row[this._identifierField];
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${username}/membership?userType=${this.rowEvents.userType}`;

          //eg ("admin:ldapusers:rowUpdate", index, this.ldapUser)
          EventBus.$emit(updateEvent, this.index, userObj);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    // Updates the permissions for a user. (essentially adds/removes the user from the permission)
    _updatePermissionSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_PERMISSION}`;
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this._identifierField]: this.row[this._identifierField],
        permissions: selections.map((selection) => selection.name),
        userType: this.rowEvents.userType,
      };

      try {
        const response = await this.axios.put(endpoint, requestBody);
        this._successfulResponse_update(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    // Removes a user from a permission. (essentially removes the user from the permission)
    _removePermission: async function (permission) {
      this._userManagementMixin_checkReady();
      const username = this.row[this._identifierField];
      const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${username}?userType=${this.rowEvents.userType}`;
      try {
        const response = await this.axios.delete(url);
        this._successfulResponse_update(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    // endpoint doesn't change across ldap, managed or oidc
    _removeRole: function (projectRole) {
      const username = this[this.getUserObjectKey()].username;
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${username}/role`;

      this.axios
        .delete(url, {
          data: {
            roleUUID: projectRole.role.uuid,
            projectUUID: projectRole.project.uuid,
          },
        })
        .then((response) => {
          this.syncVariables(response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    _updatePermissionSelection: function (selections) {
      const userObj = this.getUserObject();

    // -- utility methods --
    handleError: function (error, toastMessage) {
      const msg = toastMessage ?? this.$t('condition.unsuccessful_action');
      console.error(error);
      this.$toastr.e(msg);
    },

    _successfulResponse_update: function (response) {
      if (this.rowEvents?.update && this.rowEvents.cacheKey) {
        // EventBus.$emit(this.rowEvents.update, this.index, response.data);
        const cacheKey = `${this.rowEvents.cacheKey}:${response.data[this._identifierField]}`;
        this.$set(this, 'user', response.data);
        sessionStorage.setItem(cacheKey, new Date().toString());
      }
      this.$toastr.s(this.$t('message.updated'));
    },

    _successfulResponse_delete: function () {
      if (this.rowEvents?.delete && this.rowEvents.cacheKey) {
        const cacheKey = `${this.rowEvents.cacheKey}:${[this._identifierField]}`;
        sessionStorage.removeItem(cacheKey);
        EventBus.$emit(this.rowEvents.delete, this.index);
      }
      this.$toastr.s(this.$t('admin.user_deleted'));
    },

    _userManagementMixin_checkReady: function () {
      if (!this._userManagementMixin_ready) {
        throw new Error('userManagementMixin is not ready. Init failed');
      }
    },

    _userManagementMixin_init: function () {
      if (!this._identifierField) {
        this._identifierField = 'username';
      }

      if (this.umm_bypassInit === true) {
        console.warn('userManagementMixin: bypassing init check');
        this._userManagementMixin_ready = true;
        return;
      }

      if (this.index == null || this.row == null) {
        throw new Error(
          "userManagementMixin requires 'index' and 'row' variables, which are typically provided by a detailFormatter function.",
        );
      }

      const rowEventsReady = !!(
        this.rowEvents &&
        this.rowEvents.update &&
        this.rowEvents.delete &&
        this.rowEvents.cacheKey
      );

      const mappedAdd = permissionsToAdd.map(async (permission) => {
        const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${userObj.username}`;
        return await this.axios.post(url);
      });
      const mappedRemove = permissionsToRemove.map(async (permission) => {
        const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${userObj.username}`;
        // return await this._removePermission(permission);
        return await this.axios.delete(url);
      });

      // response data isn't reliable as promises can resolve too fast and at different times
      return Promise.all([mappedAdd, mappedRemove])
        .then(() => {
          // sync variables from selections to avoid missing permissions
          this.syncVariables({ permissions: selections });
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removePermission: function (permission) {
      const userObj = this.getUserObject();
      const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${userObj.username}`;
      return this.axios
        .delete(url)
        .then((response) => {
          this.syncVariables(response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
};
