/* eslint-disable prettier/prettier */
import EventBus from '../shared/eventbus';

export default {
  data() {
    return {
        projectRoles: [Object],
    };
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
          this.$root.$emit('admin:ldapusers:rowUpdate', this.ldapUser);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
};
