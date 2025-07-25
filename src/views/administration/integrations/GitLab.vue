<template>
  <b-card no-body :header="header">
    <b-card-header>
      <c-switch
        id="gitlabEnabled"
        color="primary"
        v-model="isGitlabEnabled"
        label
        v-bind="labelIcon"
      />
      {{ $t('admin.integration_gitlab_enable') }}
    </b-card-header>

    <b-collapse :visible="isGitlabEnabled">
      <b-card-body>
        <!-- GitLab Integration Config Group -->
        <div class="mb-4">
          <label class="mb-3">OIDC {{ $t('admin.configuration') }}</label>
          <copy-field
            v-model="$oidc.CLIENT_ID"
            :label="$t('admin.app_id')"
            class="mb-2"
          />
          <copy-field
            v-model="$oidc.ISSUER"
            :label="$t('admin.url')"
            class="mb-2"
          />
          <div class="mb-2">
            <c-switch
              id="includeArchived"
              color="primary"
              v-model="includeArchived"
              label
              v-bind="labelIcon"
            />
            <span>{{ $t('admin.include_archived_projects') }}</span>
          </div>
          <div>
            <label class="mb-3">{{ $t('admin.topics') }}</label>
            <multiselect
              v-model="topics"
              :options="mOptions"
              :multiple="true"
              :taggable="true"
              :showNoOptions="false"
              :selectLabel="$t('admin.multiselect_add_topic')"
              :tag-placeholder="$t('admin.multiselect_add_new_topic')"
              :deselectLabel="$t('admin.multiselect_remove_topic')"
              :placeholder="$t('admin.multiselect_enter_new_topic')"
              @tag="addTopicTag"
            />
          </div>
        </div>

        <!-- SBOM Push Config Group -->
        <c-switch
          id="sbomEnabled"
          color="primary"
          v-model="sbomEnabled"
          label
          v-bind="labelIcon"
        />
        {{ $t('admin.integration_gitlab_sbom_enable') }}
        <b-collapse :visible="sbomEnabled">
          <c-switch
            id="autoCreateProjects"
            color="primary"
            v-model="autoCreateProjects"
            label
            v-bind="labelIcon"
          />
          {{ $t('admin.integration_auto_create_enabled') }}
          <b-validated-input-group-form-input
            id="audience"
            :label="$t('admin.gitlab_audience')"
            input-group-size="mb-3"
            v-model="audience"
            lazy="true"
          />
          <b-validated-input-group-form-input
            id="gitlab-jwks-path"
            :label="$t('admin.gitlab_jwks_path')"
            input-group-size="mb-3"
            rules="required"
            type="url"
            v-model="gitlabJwksPath"
            lazy="true"
          />
        </b-collapse>
      </b-card-body>
    </b-collapse>
    <b-card-footer>
      <b-button variant="outline-primary" class="px-5" @click="saveChanges">
        {{ $t('message.update') }}
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';
import BValidatedInputGroupFormInput from '../../../forms/BValidatedInputGroupFormInput';
import Multiselect from 'vue-multiselect';
import CopyField from '../../components/CopyField.vue';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
    BValidatedInputGroupFormInput,
    CopyField,
    Multiselect,
  },
  created() {
    const filterByIntegrations = (item) => item.groupName === 'integrations';
    const processConfigItem = (item) => {
      switch (item.propertyName) {
        case 'gitlab.enabled':
          this.isGitlabEnabled = common.toBoolean(item.propertyValue);
          break;
        case 'gitlab.sbom.push.enabled':
          this.sbomEnabled = common.toBoolean(item.propertyValue);
          break;
        case 'gitlab.include.archived':
          this.includeArchived = common.toBoolean(item.propertyValue);
          break;
        case 'gitlab.autocreate.projects':
          this.autoCreateProjects = common.toBoolean(item.propertyValue);
          break;
        case 'gitlab.audience':
          this.audience = item.propertyValue;
          break;
        case 'gitlab.topics':
          this.topics = JSON.parse(item.propertyValue);
          break;
        case 'gitlab.jwks.path':
          this.gitlabJwksPath = item.propertyValue;
          break;
      }
    };
    this.axios.get(this.configUrl).then((response) => {
      response.data.filter(filterByIntegrations).forEach(processConfigItem);
    });
  },
  data() {
    return {
      isGitlabEnabled: false,
      includeArchived: false,
      gitlabJwksPath: '/oauth/discovery/keys',
      sbomEnabled: false,
      autoCreateProjects: false,
      audience: '',
      topics: [],
      newTopic: '',
      mOptions: [],
    };
  },
  methods: {
    openAddTopicModal() {
      this.$bvModal.show('add-topic-modal');
    },
    addTopicTag(topicTag) {
      if (this.topics.includes(topicTag)) {
        return;
      }
      const trimmedTag = topicTag.trim();
      if (trimmedTag === '') {
        return;
      }
      this.mOptions.push(topicTag);
      this.topics.push(topicTag);
    },
    addTopic() {
      if (this.newTopic && !this.topics.includes(this.newTopic)) {
        this.topics.push(this.newTopic);
        this.newTopic = '';
      }
      this.$bvModal.hide('add-topic-modal');
    },
    clearNewTopic() {
      this.newTopic = '';
    },
    removeTopic(index) {
      this.topics.splice(index, 1);
    },
    saveChanges: function () {
      try {
        this.updateConfigProperties([
          {
            groupName: 'integrations',
            propertyName: 'gitlab.sbom.push.enabled',
            propertyValue: this.sbomEnabled,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.include.archived',
            propertyValue: this.includeArchived,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.autocreate.projects',
            propertyValue: this.autoCreateProjects,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.audience',
            propertyValue: this.audience,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.topics',
            propertyValue: JSON.stringify(this.topics),
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.jwks.path',
            propertyValue: this.gitlabJwksPath,
          },
        ]);
        this.setGitlabState();
      } catch (error) {
        console.error('Error updating configuration properties:', error);
      }
    },
    setGitlabState: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_INTEGRATION}/gitlab/${this.isGitlabEnabled}`;
      this.axios
        .post(url)
        .then(() => {
          this.$toastr.s(this.$t('admin.configuration_saved'));
        })
        .catch((error) => {
          console.error('Error updating GitLab state:', error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
};
</script>
