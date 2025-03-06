<template>
  <b-modal
    id="selectRoleModal"
    @hide="resetValues()"
    size="md"
    hide-header-close
    no-stacking
    :title="$t('admin.assign_role')"
  >
    <b-card no-body :header="header">
      <b-card-body>
        <b-form-group :label="this.$t('admin.project_access')">
          <div class="list-group">
            <span v-for="project in projects" :key="project.uuid">
              <actionable-list-group-item
                :value="projectLabel(project.name, project.version)"
                :href="projectUri(project.uuid)"
                :delete-icon="true"
                v-on:actionClicked="removeProjectMapping(project.uuid)"
              />
            </span>
            <actionable-list-group-item
              :add-icon="true"
              v-on:actionClicked="
                $root.$emit('bv::show::modal', 'selectProjectModal')
              "
            />
          </div>
        </b-form-group>
      </b-card-body>
      <b-card-body>
        <b-input-group-form-select
          v-model="$selectedRole"
          :options="availableRoles"
          :label="$t('admin.role')"
          rules="required"
        />
      </b-card-body>
    </b-card>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="md" variant="secondary" @click="cancel()">{{
        $t('message.close')
      }}</b-button>
      <b-button size="md" variant="primary" @click="createRole()">{{
        $t('message.assign')
      }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
// import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import SelectProjectModal from './SelectProjectModal';

export default {
  name: 'selectRoleModal',
  props: {
    type: String,
  },
  components: {
    BInputGroupFormSelect,
    // BInputGroupFormInput,
    ActionableListGroupItem,
    SelectProjectModal,
  },
  created() {
    this.initialRepositoryType = this.type;
    this.repositoryType = this.type;
  },
  mounted() {
    this.loadRoles();
  },
  data() {
    return {
      identifier: null,
      url: null,
      selectedRole: null,
      availableRoles: [],
      initialRepositoryType: null,
      internal: false,
      repository_authentication: false,
      username: null,
      password: null,
      enabled: true,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  methods: {
    createRepository: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_REPOSITORY}`;
      this.axios
        .put(url, {
          type: this.repositoryType,
          identifier: this.identifier,
          url: this.url,
          internal: this.internal,
          authenticationRequired: this.repository_authentication,
          username: this.username,
          password: this.password || null,
          enabled: this.enabled,
        })
        .then((response) => {
          this.$emit('refreshTable');
          this.$toastr.s(this.$t('admin.repository_created'));
          this.$root.$emit(
            'bv::hide::modal',
            'repositoryCreateRepositoryModal',
          );
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
          this.$root.$emit(
            'bv::hide::modal',
            'repositoryCreateRepositoryModal',
          );
        });
      this.resetValues();
    },
    loadRoles: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      this.axios.get(url).then((response) => {
        this.availableRoles = response.data.map((d) => ({
          value: d.id,
          text: d.name,
        }));
      });
    },
    resetValues: function () {
      this.repositoryType = this.initialRepositoryType;
      this.url = null;
    },
  },
};
</script>
