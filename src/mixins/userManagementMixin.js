import EventBus from '../shared/eventbus';

export default {
  created: function () {
    this._userManagementMixin_init();
  },
  data: function () {
    return {
      _userManagementMixin_ready: false,
    };
  },
  methods: {
    loadUserRoles: function (username) {
      this._userManagementMixin_checkReady();
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

    // TODO: internal server error 500
    _deleteUser: function (endpoint) {
      this._userManagementMixin_checkReady();

      this.axios
        .delete(endpoint, {
          data: {
            username: this.row[this.identifierField],
          },
        })
        .then(this._successfulResponseDelete)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _updateTeamSelection: function (endpoint, selections) {
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this.identifierField]: this.row[this.identifierField],
        teams: selections.map((team) => team.uuid),
      };
      this.axios
        .put(endpoint, requestBody)
        .then(this._successfulResponseUpdate)
        .catch((error) => {
          if (error.response && error.response.status === 304) return;
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removeTeamMembership: function (endpoint, teamUUID) {
      this._userManagementMixin_checkReady();
      this.axios
        .delete(endpoint, { data: { uuid: teamUUID } })
        .then(this._successfulResponseUpdate)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _updateRoleSelection: function (endpoint, selection) {
      this._userManagementMixin_checkReady();
      this.axios
        .post(endpoint, {
          roleUUID: selection.role,
          projectUUID: selection.project,
        })
        .then(this._successfulResponseUpdate)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removeRole: function (projectRole) {
      this._userManagementMixin_checkReady();
      // const username = this[this.getUserObjectKey()].username;
      const username = this.row[this.identifierField];
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${username}/role`;

      this.axios
        .delete(url, {
          data: {
            roleUUID: projectRole.role.uuid,
            projectUUID: projectRole.project.uuid,
          },
        })
        .then(this._successfulResponseUpdate)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _updatePermissionSelection: async function (endpoint, selections) {
      this._userManagementMixin_checkReady();
      const requestBody = {
        [this.identifierField]: this.row[this.identifierField],
        permissions: selections.map((selection) => selection.name),
      };

      return this.axios
        .put(endpoint, requestBody)
        .then(this._successfulResponseUpdate)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removePermission: async function (permission) {
      this._userManagementMixin_checkReady();
      const username = this.row[this.identifierField];
      const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${username}`;
      return this.axios
        .delete(url)
        .then(this._successfulResponseUpdate)
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    // -- utility methods --
    _successfulResponseUpdate: function (response) {
      if (this.rowEvents && this.rowEvents.update)
        EventBus.$emit(this.rowEvents.update, this.index, response.data);
      this.$toastr.s(this.$t('message.updated'));
    },

    _successfulResponseDelete: function () {
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
      if (this.index == null || this.row == null) {
        throw new Error(
          "userManagementMixin requires 'index' and 'row' variables, which are typically provided by a detailFormatter function.",
        );
      }

      if (this.identifierField == null) {
        throw new Error(
          "userManagementMixin requires 'identifierField' variable.",
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
