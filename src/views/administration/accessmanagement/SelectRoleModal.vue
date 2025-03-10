<template>
  <b-modal
    id="selectRoleModal"
    @hide="resetValues()"
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
      <b-button size="md" variant="primary" @click="createRoleMapping()">{{
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
    this.loadRoles();
    this.loadProjects();
  },
  props: {
    username: String,
  },
  created() {
    this.initialRole = '';
    this.initialProject = '';
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
    createRoleMapping: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.user}/role`;
      this.axios
        .post(url, {
          roleUUID: this.selectedRole,
          projectUUID: this.selectedProject,
        })
        .then((response) => {
          this.$emit('refreshTable');
          this.$toastr.s(this.$t('admin.role_assigned'));
          this.$root.$emit('bv::hide::modal', 'selectRoleModal');
          this.$emit('refreshTable');
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
          this.$root.$emit('bv::hide::modal', 'selectRoleModal');
        });
    },
    loadRoles: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      this.axios
        .get(url)
        .then((response) => {
          this.availableRoles = response.data;
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    loadProjects: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ACL_USER}/${this.user}`;
      this.axios
        .get(url)
        .then((response) => {
          this.availableProjects = response.data;
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    resetValues: function () {
      this.selectedProject = this.initialProject;
      this.selectedRole = this.initialRole;
    },
  },
};
</script>
