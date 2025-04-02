import EventBus from "../shared/eventbus"

export default {
    created: function () {
        if (this.index == null || this.row == null) {
            throw new Error("userManagementMixin requires 'index' and 'row' variables, which are typically provided by a detailFormatter function.")
        }
    },
    methods: {

        getUserObjectKey: function () {
            throw new Error('getUserObjectKey function must be implemented to use "userManagementMixin".')
        },

        getUserObject: function () {
            throw new Error('getUserObjectKey function must be implemented to use "userManagementMixin".')
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
                .then((response) => {
                    EventBus.$emit(updateEvent, this.index);
                    this.$toastr.s(this.$t('admin.user_deleted'));
                })
                .catch((error) => {
                    console.error(error)
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                });
        },

        // TODO: ask about batch selections
        _updateTeamSelection: function (updateEvent, selections) {
            const userObj = this.getUserObject()
            const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${userObj.username}/membership`

            // remove selected permissions that are already applied
            const filterCallback = (selection) => {
                return !(userObj.teams.some((team) => team.uuid === selection.uuid))
            }
            const mapCallback = async (selection) => (
                await this.axios.post(endpoint, { uuid: selection.uuid })
            )
            const request_promises = selections.filter(filterCallback).map(mapCallback)

            // asynchronously process requests
            Promise
                .all(request_promises)
                .then((_) => {
                    this.syncVariables({ teams: selections })

                    //eg ("admin:ldapusers:rowUpdate", index, this.ldapUser)
                    EventBus.$emit(updateEvent, this.index, userObj);
                    this.$toastr.s(this.$t('message.updated'));
                })
                .catch(error => {
                    console.error(error)
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                })
        },

        _removeTeamMembership: function (endpoint, updateEvent, teamUUID) {

            const userObj = this.getUserObject()
            this.axios
                .delete(endpoint, { data: { uuid: teamUUID } })
                .then((response) => {
                    this.syncVariables(response.data);
                    EventBus.$emit(updateEvent, this.index, userObj);
                    this.$toastr.s(this.$t('message.updated'));
                })
                .catch((error) => {
                    console.error(error)
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
                    this.syncVariables(response.data)
                })
                .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                    console.error(error)
                })
        },

        // endpoint doesn't change across ldap, managed or oidc
        _removeRole: function (projectRole) {
            const username = this[this.getUserObjectKey()].username
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
                .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                });
        },
        _updatePermissionSelection: function (selections) {
            const userObj = this.getUserObject();
            console.log('User Object:', userObj); // Debugging: Log the user object

            if (!selections || selections.length === 0) {
                console.warn('No permissions selected:', selections);
                return;
            }

            // Define the URL for updating permissions
            const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${userObj.username}/permissions`;

            // Send the updated permissions to the backend
            this.axios
                .post(url, { permissions: selections })
                .then(() => {
                    // Update the managedUser's permissions in the UI
                    this.managedUser.permissions = selections;
                    this.$toastr.s(this.$t('message.updated'));
                })
                .catch((error) => {
                    console.error(error);
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                });
        },
        _removePermission: function (permission) {
            const userObj = this.getUserObject()
            const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/user/${userObj.username} `;
            this.axios
                .delete(url)
                .then((response) => {
                    this.syncVariables(response.data);
                    this.$toastr.s(this.$t('message.updated'));
                })
                .catch((error) => {
                    console.error(error)
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                });
        }

    }

}
