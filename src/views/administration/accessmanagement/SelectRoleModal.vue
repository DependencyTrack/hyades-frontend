<template>
  <b-modal
    id="selectRoleModal"
    @hide="resetValues()"
    @show="loadProjects()"
    size="md"
    hide-header-close
    no-stacking
    :title="$t('admin.assign_role')"
  >
    <b-card no-body>
      <b-card-body class="pb-0">
        <b-input-group-form-select
          id="input-selected-project"
          v-model="selectedProject"
          :options="
            availableProjects.map((project) => ({
              value: project.uuid,
              text: project.name,
            }))
          "
          :label="$t('admin.project')"
          required="true"
        />
      </b-card-body>
      <b-card-body class="pb-0">
        <b-input-group-form-select
          id="input-selected-role"
          v-model="selectedRole"
          :options="
            availableRoles.map((role) => ({
              value: role.uuid,
              text: role.name,
            }))
          "
          :label="$t('admin.role')"
          required="true"
        />
      </b-card-body>
    </b-card>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="md" variant="secondary" @click="cancel()">{{
        $t('message.close')
      }}</b-button>
      <!-- emit selected role object back to parent -->
      <b-button size="md" variant="primary" @click="handleSelection">{{
        $t('message.assign')
      }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';

export default {
  name: 'selectRoleModal',
  components: {
    BInputGroupFormSelect,
  },
  mounted() {
    this.loadAvailableRoles();
  },
  props: {
    username: String,
  },
  data() {
    return {
      initialProject: '',
      initialRole: '',
      selectedProject: '',
      selectedRole: '',
      availableRoles: [],
      availableProjects: [],
      user: this.username,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  methods: {
    handleSelection: function () {
      if (!this.selectedRole || !this.selectedProject) {
        return;
      }

      const selection = {
        role: this.selectedRole,
        project: this.selectedProject,
      };
      this.$root.$emit('bv::hide::modal', this.$children[0].id); //or just 'selectRoleModal'
      this.$emit('selection', selection);
    },
    loadAvailableRoles: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      this.axios
        .get(url)
        .then((response) => {
          this.availableRoles = response.data;
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    loadProjects: async function () {
      try {
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/${this.$api.URL_ACL_USER}/${this.user}`,
        );

        if (response.status === 204) {
          this.availableProjects = [
            {
              uuid: null,
              name: this.$t('admin.no_unassigned_projects'),
            },
          ];
          this.selectedProject = this.$t('admin.no_unassigned_projects');
          this.selectedRole = null;
          console.log('No projects available.');
        } else if (response.status === 200 && Array.isArray(response.data)) {
          this.availableProjects = response.data;
        } else {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        }
      } catch (error) {
        this.$toastr.w(this.$t('condition.unsuccessful_action'));
      }
    },
    resetValues: function () {
      this.selectedProject = this.initialProject;
      this.selectedRole = this.initialRole;
    },
  },
};
</script>
