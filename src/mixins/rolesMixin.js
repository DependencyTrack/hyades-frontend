/* eslint-disable prettier/prettier */
import EventBus from '../shared/eventbus';

export default {
  data() {
    return {
      projectRoles: [Object],
    };
  },
  mounted() {
    EventBus.$on('admin:ldapusers:rowUpdate', (index, row) => {
      this.refreshTable();
    });
    EventBus.$on('admin:ldapusers:rowDeleted', (index, row) => {
      this.refreshTable();
    });
    EventBus.$on('admin:oidcusers:rowUpdate', (index, row) => {
      this.refreshTable();
    });
    EventBus.$on('admin:oidcusers:rowDeleted', (index, row) => {
      this.refreshTable();
    });
  },
  methods: {
    loadUserRoles: function (username) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}/${username}/roles`;
      return this.axios
        .get(url)
        .then((response) => {
          this.projectRoles = response.data;
        })
        .catch((error) => {
          console.error('Error loading user roles:', error);
          this.projectRoles = [];
        });
    },
    unassignRole: function (projectRole, username) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${username}/role`;
      this.axios
        .delete(url, {
          data: {
            roleUUID: projectRole.role.uuid,
            projectUUID: projectRole.project.uuid,
          },
        })
        .then((response) => {
          this.syncVariables(response.data);
          // Emit an event to update the component
          if (userType === 'ldap') {
            this.$root.$emit('admin:ldapusers:rowUpdate', this.ldapUser);
          } else if (userType === 'oidc') {
            this.$root.$emit('admin:oidcusers:rowUpdate', this.oidcUser);
          }
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
};
