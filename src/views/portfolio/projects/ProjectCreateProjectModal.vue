<template>
  <b-modal
    id="projectCreateProjectModal"
    @hide="resetValues()"
    size="md"
    hide-header-close
    no-stacking
    :title="$t('message.create_project')"
  >
    <b-form ref="form" novalidate @submit.stop.prevent="createProject()">
      <b-card>
        <b-input-group-form-input
          id="project-name-input"
          ref="nameInput"
          input-group-size="mb-3"
          type="text"
          v-model="project.name"
          lazy="true"
          required="true"
          feedback="true"
          autofocus="false"
          :label="$t('message.project_name')"
          :tooltip="this.$t('message.project_name_desc')"
          :feedback-text="
            projectNameState === false
              ? nameInvalidFeedback || $t('message.required_project_name')
              : ''
          "
          :state="projectNameState"
        />
        <b-row align-v="stretch">
          <b-col>
            <b-input-group-form-input
              id="project-version-input"
              input-group-size="mb-3"
              type="text"
              v-model="project.version"
              lazy="true"
              required="false"
              feedback="false"
              autofocus="false"
              :label="$t('message.version')"
              :tooltip="this.$t('message.component_version_desc')"
            />
          </b-col>
          <b-col cols="auto">
            <b-input-group-form-switch
              id="project-create-islatest"
              :label="$t('message.project_is_latest')"
              v-model="project.isLatest"
              :show-placeholder-label="true"
              :tooltip="$t('message.is_latest_tooltip')"
              :disabled="!project.version"
            />
          </b-col>
        </b-row>
        <b-input-group-form-select
          v-if="!isCollection"
          id="v-classifier-input"
          required="true"
          v-model="project.classifier"
          :options="sortAvailableClassifiers"
          :label="$t('message.classifier')"
          :tooltip="$t('message.component_classifier_desc')"
          feedback="true"
          :feedback-text="
            classifierState === false ? $t('message.required_classifier') : ''
          "
          :state="classifierState"
        />
        <b-input-group-form-switch
          id="project-create-is-collection"
          :label="$t('message.collection_project')"
          v-model="isCollection"
          @change="onCollectionToggle"
        />
        <b-input-group-form-select
          v-if="isCollection"
          id="v-collection-logic-input"
          required="true"
          v-model="project.collectionLogic"
          :options="availableCollectionLogics"
          :label="$t('message.collectionLogic')"
          :tooltip="$t('message.project_collection_logic_desc')"
          :readonly="this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)"
          feedback="true"
          :feedback-text="
            collectionLogicState === false
              ? $t('message.required_collection_logic')
              : ''
          "
          :state="collectionLogicState"
        />
        <b-form-group
          v-if="isCollection && showCollectionTags"
          id="project-collection-tag-form-group"
          :label="$t('message.project_add_collection_tag')"
          label-for="input-collectionTags"
        >
          <vue-tags-input
            id="input-collectionTags"
            v-model="collectionTagTyping"
            :tags="collectionTags"
            :add-on-key="addOnKeys"
            :placeholder="$t('message.project_add_collection_tag')"
            :autocomplete-items="tagsAutoCompleteItems"
            @tags-changed="
              (newCollectionTags) => (this.collectionTags = newCollectionTags)
            "
            class="mw-100 bg-transparent text-lowercase"
            :max-tags="1"
            :readonly="this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)"
          />
        </b-form-group>
        <div v-if="requiresTeam" style="margin-bottom: 1rem">
          <label>{{ $t('message.team') }}</label>
          <multiselect
            v-model="selectedTeams"
            :options="availableTeams"
            :multiple="true"
            :close-on-select="false"
            :placeholder="$t('message.component_team_desc')"
            label="text"
            track-by="value"
            :disabled="isDisabled"
            selectLabel=""
            deselectLabel=""
          ></multiselect>
        </div>
        <div style="margin-bottom: 1rem">
          <label>{{ $t('message.parent') }}</label>
          <multiselect
            v-model="selectedParent"
            id="multiselect"
            :custom-label="createProjectLabel"
            :placeholder="this.$t('message.search_parent')"
            open-direction="bottom"
            :options="availableParents"
            :multiple="false"
            :searchable="true"
            track-by="uuid"
            :loading="isLoading"
            @search-change="asyncFind"
            :internal-search="false"
            :close-on-select="true"
            :allow-empty="true"
            :show-no-results="true"
            selectLabel=""
            deselectLabel=""
          ></multiselect>
        </div>
        <b-form-group
          id="project-description-form-group"
          :label="this.$t('message.description')"
          label-for="project-description-input"
        >
          <b-form-textarea
            id="project-description-input"
            v-model="project.description"
            rows="3"
          />
        </b-form-group>
        <b-form-group
          id="project-tags-form-group"
          :label="this.$t('message.tags')"
          label-for="input-4"
        >
          <vue-tags-input
            id="input-4"
            v-model="tag"
            :tags="tags"
            :add-on-key="addOnKeys"
            :placeholder="$t('message.add_tag')"
            :autocomplete-items="tagsAutoCompleteItems"
            @tags-changed="(newTags) => (this.tags = newTags)"
            class="mw-100 bg-transparent text-lowercase"
          />
        </b-form-group>
        <hr class="my-3" />
        <div
          v-b-toggle.identity-collapse
          class="d-flex align-items-center mb-2"
          style="cursor: pointer"
        >
          <i class="fa fa-cube mr-2"></i>
          <strong>{{ $t('message.identity') }}</strong>
          <small v-if="!showIdentity" class="text-muted ml-2">{{
            identityHint
          }}</small>
          <i
            class="fa ml-auto"
            :class="showIdentity ? 'fa-chevron-up' : 'fa-chevron-down'"
          ></i>
        </div>
        <b-collapse id="identity-collapse" v-model="showIdentity">
          <b-input-group-form-input
            id="project-group-input"
            input-group-size="mb-3"
            type="text"
            v-model="project.group"
            required="false"
            :label="$t('message.component_namespace_group_vendor')"
            :tooltip="this.$t('message.component_group_desc')"
          />
          <b-input-group-form-input
            id="project-purl-input"
            input-group-size="mb-3"
            type="text"
            v-model="project.purl"
            required="false"
            :label="$t('message.package_url_full')"
            :tooltip="this.$t('message.component_package_url_desc')"
          />
          <b-input-group-form-input
            id="project-cpe-input"
            input-group-size="mb-3"
            type="text"
            v-model="project.cpe"
            required="false"
            :label="$t('message.cpe_full')"
            :tooltip="$t('message.component_cpe_desc')"
          />
          <b-input-group-form-input
            id="project-swidTagId-input"
            input-group-size="mb-3"
            type="text"
            v-model="project.swidTagId"
            required="false"
            :label="$t('message.swid_tagid')"
            :tooltip="$t('message.component_swid_tagid_desc')"
          />
        </b-collapse>
      </b-card>
      <button type="submit" style="display: none" />
    </b-form>
    <template v-slot:modal-footer="{ cancel }">
      <b-button
        size="md"
        variant="secondary"
        :disabled="isCreating"
        @click="cancel()"
        >{{ $t('message.cancel') }}</b-button
      >
      <b-button
        size="md"
        variant="primary"
        :disabled="isCreating"
        @click="createProject()"
      >
        <b-spinner v-if="isCreating" small class="mr-1"></b-spinner>
        {{ $t('message.create') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import VueTagsInput from '@johmun/vue-tags-input';
import permissionsMixin from '../../../mixins/permissionsMixin';
import Multiselect from 'vue-multiselect';
import BInputGroupFormSwitch from '@/forms/BInputGroupFormSwitch.vue';
import common from '../../../shared/common';
import availableClassifiersMixin from '@/mixins/availableClassifiersMixin';
import availableCollectionLogicsMixin from '@/mixins/availableCollectionLogicsMixin';

export default {
  name: 'ProjectCreateProjectModal',
  mixins: [
    permissionsMixin,
    availableClassifiersMixin,
    availableCollectionLogicsMixin,
  ],
  components: {
    BInputGroupFormSwitch,
    BInputGroupFormInput,
    BInputGroupFormSelect,
    VueTagsInput,
    Multiselect,
  },
  data() {
    return {
      requiresTeam: true,
      isDisabled: false,
      availableTeams: [],
      selectedParent: null,
      selectedTeams: [],
      defaultParents: [],
      availableParents: [],
      project: { classifier: 'APPLICATION', collectionLogic: null },
      teams: [],
      tag: '',
      tags: [],
      tagsAutoCompleteItems: [],
      tagsAutoCompleteDebounce: null,
      collectionTagTyping: '',
      collectionTags: [],
      isCollection: false,
      showIdentity: false,
      isCreating: false,
      submitted: false,
      nameInvalidFeedback: null,
      addOnKeys: [9, 13, 32, ':', ';', ','],
      isLoading: false,
    };
  },
  created() {
    this.getACLEnabled().then(() => {
      this.getAvailableTeams();
    });
  },
  beforeMount() {
    this.$root.$on('initializeProjectCreateProjectModal', async () => {
      this.fetchDefaultParents();
      this.$root.$emit('bv::show::modal', 'projectCreateProjectModal');
    });
  },
  beforeDestroy() {
    this.$root.$off('initializeProjectCreateProjectModal');
  },
  watch: {
    'project.name'() {
      this.nameInvalidFeedback = null;
    },
    'project.version'(v) {
      if (!v) this.project.isLatest = false;
    },
    tag(input) {
      this.searchTags(input);
    },
    collectionTagTyping(input) {
      this.searchTags(input);
    },
  },
  computed: {
    showCollectionTags() {
      return (
        this.project.collectionLogic === 'AGGREGATE_DIRECT_CHILDREN_WITH_TAG'
      );
    },
    projectNameState() {
      if (this.nameInvalidFeedback) return false;
      if (!this.submitted) return undefined;
      return !!(this.project.name && this.project.name.trim().length > 0);
    },
    classifierState() {
      if (!this.submitted || this.isCollection) return undefined;
      return !!this.project.classifier;
    },
    collectionLogicState() {
      if (!this.submitted || !this.isCollection) return undefined;
      return !!this.project.collectionLogic;
    },
    identityHint() {
      const fields = [
        this.project.group,
        this.project.purl,
        this.project.cpe,
        this.project.swidTagId,
      ].filter(Boolean);
      if (fields.length > 0) {
        return this.$t('message.identity_fields_set', {
          count: fields.length,
        });
      }
      return this.$t('message.optional');
    },
  },
  methods: {
    validate() {
      this.submitted = true;
      let valid = true;
      if (!this.project.name || !this.project.name.trim()) {
        valid = false;
      }
      if (!this.isCollection && !this.project.classifier) {
        valid = false;
      }
      if (this.isCollection && !this.project.collectionLogic) {
        valid = false;
      }
      return valid;
    },
    scrollToFirstError() {
      this.$nextTick(() => {
        const el = this.$refs.form
          ? this.$refs.form.$el || this.$refs.form
          : null;
        if (!el) return;
        const invalid = el.querySelector('.is-invalid, [aria-invalid="true"]');
        if (invalid) {
          invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    },
    resetValidationFeedback() {
      this.nameInvalidFeedback = null;
    },
    async getACLEnabled() {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_CONFIG_PROPERTY}/public/access-management/acl.enabled`;
      let response = await this.axios.get(url);
      this.requiresTeam = common.toBoolean(
        response.data.propertyValue.toString(),
      );
    },
    async getAvailableTeams() {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}/visible`;
      let response = await this.axios.get(url);
      let convertedTeams = response.data.map((team) => {
        return { text: team.name, value: team.uuid };
      });
      this.availableTeams = convertedTeams;
      this.teams = response.data;
      if (this.requiresTeam && this.availableTeams.length == 1) {
        this.selectedTeams = [this.availableTeams[0]];
        this.isDisabled = true;
      }
      this.availableTeams.sort(function (a, b) {
        return a.text.localeCompare(b.text);
      });
    },
    onCollectionToggle: function (value) {
      if (value) {
        this.project.classifier = undefined;
      } else {
        this.project.classifier = 'APPLICATION';
        this.project.collectionLogic = null;
        this.collectionTagTyping = '';
        this.collectionTags = [];
      }
    },
    createProject: function () {
      this.resetValidationFeedback();
      if (!this.validate()) {
        this.scrollToFirstError();
        return;
      }

      this.isCreating = true;
      let url = `${this.$api.BASE_URL}/${this.$api.URL_PROJECT}`;
      let tagsNode = [];
      let chosenTeams = this.teams.filter((team) => {
        return this.selectedTeams.some((st) => st.value === team.uuid);
      });
      let chosenTeamsWithoutApiKeys = chosenTeams.map((team) => ({
        ...team,
        apiKeys: [],
      }));
      let parent = null;
      if (this.selectedParent) {
        parent = { uuid: this.selectedParent.uuid };
      }
      this.tags.forEach((tag) => tagsNode.push({ name: tag.text }));
      this.axios
        .put(url, {
          name: this.project.name,
          version: this.project.version,
          group: this.project.group,
          description: this.project.description,
          parent: parent,
          classifier: this.project.classifier,
          accessTeams: chosenTeamsWithoutApiKeys,
          collectionLogic: this.project.collectionLogic,
          collectionTag:
            this.project.collectionLogic ===
              'AGGREGATE_DIRECT_CHILDREN_WITH_TAG' &&
            this.collectionTags &&
            this.collectionTags.length > 0
              ? { name: this.collectionTags[0].text }
              : null,
          purl: this.project.purl,
          cpe: this.project.cpe,
          swidTagId: this.project.swidTagId,
          copyright: this.project.copyright,
          tags: tagsNode,
          active: true,
          isLatest: this.project.isLatest,
        })
        .then((response) => {
          this.isCreating = false;
          this.$toastr.s(this.$t('message.project_created'));
          this.$root.$emit('bv::hide::modal', 'projectCreateProjectModal');
          this.$router.push({ path: '/projects/' + response.data.uuid });
        })
        .catch((error) => {
          this.isCreating = false;
          const contentType =
            (error.response && error.response.headers['content-type']) || '';
          if (
            error.response &&
            error.response.status === 400 &&
            contentType.includes('application/problem+json') &&
            error.response.data.errors
          ) {
            for (const validationErr of error.response.data.errors) {
              const field = validationErr.path.split('.').pop();
              switch (field) {
                case 'name':
                  this.nameInvalidFeedback = validationErr.message;
                  break;
              }
            }
            this.scrollToFirstError();
          } else if (error.response && error.response.data) {
            const detail =
              error.response.data.detail || error.response.data.message;
            this.$toastr.w(detail || this.$t('condition.unsuccessful_action'));
          } else {
            this.$toastr.w(this.$t('condition.unsuccessful_action'));
          }
        });
    },
    fetchDefaultParents: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_PROJECT_CONCISE}?excludeInactive=true&pageSize=10&pageNumber=1`;
      this.axios
        .get(url)
        .then((response) => {
          this.defaultParents = response.data || [];
          this.availableParents = this.defaultParents;
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    resetValues: function () {
      this.project = {
        classifier: 'APPLICATION',
        collectionLogic: null,
      };
      this.tag = '';
      this.tags = [];
      this.selectedParent = null;
      this.selectedTeams = [];
      this.availableParents = this.defaultParents;
      this.isCollection = false;
      this.showIdentity = false;
      this.isCreating = false;
      this.submitted = false;
      this.nameInvalidFeedback = null;
      this.collectionTagTyping = '';
      this.collectionTags = [];
    },
    createProjectLabel: function (project) {
      if (project.version) {
        return project.name + ' : ' + project.version;
      } else {
        return project.name;
      }
    },
    asyncFind: function (query) {
      if (query) {
        this.isLoading = true;
        let url = `${this.$api.BASE_URL}/${this.$api.URL_PROJECT_CONCISE}?searchText=${query}&excludeInactive=true`;
        this.axios
          .get(url)
          .then((response) => {
            if (response.data) {
              this.availableParents = response.data;
            } else {
              this.availableParents = [];
            }
          })
          .catch(() => {
            this.availableParents = this.defaultParents;
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        this.availableParents = this.defaultParents;
      }
    },
    searchTags: function (input) {
      clearTimeout(this.tagsAutoCompleteDebounce);
      if (!input) {
        this.tagsAutoCompleteItems = [];
        return;
      }
      this.tagsAutoCompleteDebounce = setTimeout(() => {
        const url = `${this.$api.BASE_URL}/${this.$api.URL_TAG}?searchText=${encodeURIComponent(input)}&pageNumber=1&pageSize=6`;
        this.axios.get(url).then((response) => {
          this.tagsAutoCompleteItems = response.data.map((tag) => {
            return { text: tag.name };
          });
        });
      }, 250);
    },
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/vendors/vue-tags-input/vue-tags-input';
</style>
