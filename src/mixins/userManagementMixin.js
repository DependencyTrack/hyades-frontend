import EventBus from '../shared/eventbus';

export default {
  created: function () {
    if (this.index == null || this.row == null) {
      throw new Error(
        "userManagementMixin requires 'index' and 'row' variables, which are typically provided by a detailFormatter function.",
      );
    }
  },
  methods: {
    // this was done to keep the flow of the project. Theres definitely a better way but it work
    getUserObjectKey: function () {
      throw new Error(
        'getUserObjectKey function must be implemented to use "userManagementMixin".',
      );
    },

    getUserObject: function () {
      throw new Error(
        'getUserObject function must be implemented to use "userManagementMixin".',
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

    // TODO: internal server error 500
    _deleteUser: function (endpoint, updateEvent) {
      const userObj = this.getUserObject();

      this.axios
        .delete(endpoint, {
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

    // TODO: implement batch selections when apiserver support is implemented
    _updateTeamSelection: function (updateEvent, selections) {
      const userObj = this.getUserObject();
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${userObj.username}/membership`;

      // remove selected permissions that are already applied
      const filterCallback = (selection) => {
        return !userObj.teams.some((team) => team.uuid === selection.uuid);
      };
      const mapCallback = async (selection) =>
        await this.axios.post(endpoint, { uuid: selection.uuid });
      const request_promises = selections
        .filter(filterCallback)
        .map(mapCallback);

      // asynchronously process requests
      Promise.all(request_promises)
        .then(() => {
          this.syncVariables({ teams: selections });

          //eg ("admin:ldapusers:rowUpdate", index, this.ldapUser)
          EventBus.$emit(updateEvent, this.index, userObj);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removeTeamMembership: function (endpoint, updateEvent, teamUUID) {
      const userObj = this.getUserObject();
      this.axios
        .delete(endpoint, { data: { uuid: teamUUID } })
        .then((response) => {
          this.syncVariables(response.data);
          EventBus.$emit(updateEvent, this.index, userObj);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    // updateEvent not needed here since we don't need to update the row at the moment, this may change later
    _updateRoleSelection: function (endpoint, selection) {
      this.axios
        .post(endpoint, {
          roleUUID: selection.role,
          projectUUID: selection.project,
        })
        .then((response) => {
          this.$toastr.s(this.$t('admin.role_assigned'));
          this.syncVariables(response.data);
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
          console.error(error);
        });
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
    // TODO: update once batch operations are implemented, Account for 304
    _updatePermissionSelection: async function (selections) {
      const userObj = this.getUserObject();

      const currentPermissions = userObj.permissions;
      const newPermissions = selections; // could be more or less selected

      // relative complement
      // add = (newPermissions - currentPermissions); remove = (currentPermissions - newPermissions),
      const permissionsToAdd = newPermissions.filter(
        (newPerm) =>
          !currentPermissions.some(
            (currentPerm) => currentPerm.name === newPerm.name,
          ),
      );
      const permissionsToRemove = currentPermissions.filter(
        (currentPerm) =>
          !newPermissions.some((newPerm) => newPerm.name === currentPerm.name),
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
          this.syncVariables({ permissions: newPermissions });
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },

    _removePermission: async function (permission) {
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
