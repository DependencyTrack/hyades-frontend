import EventBus from '../shared/eventbus';

/**
 * A Vue.js mixin for managing user-related operations such as roles, permissions, and team memberships.
 * Provides utility methods for interacting with APIs and handling user management tasks.
 *
 * @mixin
 */
export default {
  created: function () {
    this._userManagementMixin_init();
  },
  data: { _userManagementMixin_ready: false },
  methods: {
    // -- public methods --

    // Loads the user roles for a specific user. return data if targetField is null
    loadUserProjects: async function (username) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}/${username}/roles`;
      try {
        const response = await this.axios.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // Loads the user roles for a specific user. return data if targetField is null
    loadAvailableProjectRoles: async function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      try {
        const response = await this.axios.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // TODO: internal server error 500
    _deleteUser: async function (endpoint) {
      this._userManagementMixin_checkReady();
      try {
        await this.axios.delete(endpoint, {
          data: {
            // e.g { username: 'testuser' }
            [this._identifierField]: this.row[this._identifierField],
          },
        });
        this._successfulResponse_delete();
      } catch (error) {
        this.handleError(error);
      }
    },

    _updateTeamSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MEMBERSHIP}`;
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this._identifierField]: this.row[this._identifierField],
        teams: selections.map((team) => team.uuid),
      };
      try {
        const response = await this.axios.put(endpoint, requestBody);
        this._successfulResponse_update(response);
      } catch (error) {
        if (error.response?.status === 304) return;
        this.handleError(error);
      }
    },

    _removeTeamMembership: async function (teamUUID) {
      const username = this.row[this._identifierField];
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${username}/membership`;

      this._userManagementMixin_checkReady();
      try {
        const response = await this.axios.delete(endpoint, {
          data: { uuid: teamUUID },
        });
        this._successfulResponse_update(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    // Updates the permissions for a user. (essentially adds/removes the user from the permission)
    _updatePermissionSelection: async function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_PERMISSION}`;
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this._identifierField]: this.row[this._identifierField],
        permissions: selections.map((selection) => selection.name),
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
      const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${username}`;
      try {
        const response = await this.axios.delete(url);
        this._successfulResponse_update(response);
      } catch (error) {
        this.handleError(error);
      }
    },

    _handleProjectRole: async function (action, projectRole, callbacks = null) {
      this._userManagementMixin_checkReady();

      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_ROLE}`;
      const requestBody = {
        [this._identifierField]: this.row[this._identifierField],
        roleUUID: projectRole.role,
        projectUUID: projectRole.project,
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

    // -- utility methods --

    handleError: function (error, toastMessageKey) {
      const messageKey = toastMessageKey ?? 'condition.unsuccessful_action';
      console.error(error);
      this.$toastr.w(this.$t(messageKey));
    },
    _successfulResponse_update: function (response) {
      if (this.rowEvents && this.rowEvents.update)
        EventBus.$emit(this.rowEvents.update, this.index, response.data);
      this.$toastr.s(this.$t('message.updated'));
    },

    _successfulResponse_delete: function () {
      if (this.rowEvents && this.rowEvents.delete)
        EventBus.$emit(this.rowEvents.delete, this.index);
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

      const rowEventsReady =
        this.rowEvents != null &&
        this.rowEvents.update != null &&
        this.rowEvents.delete != null;
      if (!rowEventsReady) {
        console.warn(
          "userManagementMixin: 'rowEvents' object is either undefined or missing properties 'update' or 'delete'. Changes may not reflect properly until refresh.",
        );
      }

      this._userManagementMixin_ready = true;
    },
  },
};
