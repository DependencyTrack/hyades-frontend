<template>
  <b-card no-body :header="header">
    <b-card-body>
      <c-switch
        id="isGitlabEnabled"
        color="primary"
        v-model="isGitlabEnabled"
        label
        v-bind="labelIcon"
      />{{ $t('admin.integration_gitlab_enable') }}
      <br />
      <c-switch
        id="sbomEnabled"
        color="primary"
        v-model="sbomEnabled"
        label
        v-bind="labelIcon"
      />{{ $t('admin.integration_gitlab_sbom_enable') }}
      <br />
      <c-switch
        id="includeArchived"
        color="primary"
        v-model="includeArchived"
        label
        v-bind="labelIcon"
      />{{ $t('admin.include_archived_projects') }} <br /><br />
      <b-validated-input-group-form-input
        id="gitlab-app-id"
        :label="$t('admin.gitlab_application_id')"
        input-group-size="mb-3"
        rules="required"
        type="password"
        v-model="gitlabAppId"
        lazy="true"
      />
      <b-validated-input-group-form-input
        id="gitlab-url"
        :label="$t('admin.gitlab_url')"
        input-group-size="mb-3"
        rules="required"
        type="url"
        v-model="gitlabUrl"
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
      <br />
      <c-switch
        id="autoCreateProjects"
        color="primary"
        v-model="autoCreateProjects"
        label
        v-bind="labelIcon"
      />{{ $t('admin.integration_auto_create_enabled') }}
      <br />
      <b-validated-input-group-form-input
        id="audience"
        label="Audience"
        input-group-size="mb-3"
        v-model="audience"
        lazy="true"
      />
      <br />
    </b-card-body>
    <b-card-footer>
      <b-row>
        <b-col>
          <h5>Topics</h5>
          <div class="mb-2">
            <ul style="width: 100%; list-style-type: none; padding: 0">
              <li v-for="(topic, index) in topics" :key="index">
                <actionable-list-group-item
                  :value="topic"
                  :delete-icon="true"
                  v-on:actionClicked="removeTopic(index)"
                >
                  {{ topic }}
                </actionable-list-group-item>
              </li>
              <li>
                <actionable-list-group-item
                  :add-icon="true"
                  v-on:actionClicked="openAddTopicModal"
                >
                </actionable-list-group-item>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-modal
            id="add-topic-modal"
            :title="$t('admin.create_topic')"
            @hidden="clearNewTopic"
            @ok="addTopic"
          >
            <b-form-group :label="$t('admin.topic_name')">
              <b-form-input
                v-model="newTopic"
                type="text"
                class="px-12"
              ></b-form-input>
            </b-form-group>
          </b-modal>
          <b-button
            variant="outline-primary"
            class="px-5 mt-2"
            @click="saveChanges"
            >{{ $t('message.update') }}</b-button
          >
        </b-col>
      </b-row>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';

import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import BValidatedInputGroupFormInput from '../../../forms/BValidatedInputGroupFormInput';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
    ActionableListGroupItem,
    BValidatedInputGroupFormInput,
  },
  data() {
    return {
      isGitlabEnabled: false,
      includeArchived: false,
      gitlabAppId: '',
      gitlabUrl: '',
      gitlabJwksPath: '/oauth/discovery/keys',
      sbomEnabled: false,
      autoCreateProjects: false,
      audience: '',
      topics: [],
      newTopic: '',
    };
  },
  methods: {
    openAddTopicModal() {
      this.$bvModal.show('add-topic-modal');
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
      console.log('Removing topic at index:', index);
      this.topics.splice(index, 1);
    },
    saveChanges: function () {
      try {
        this.updateConfigProperties([
          {
            groupName: 'integrations',
            propertyName: 'sbom.push.enabled',
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
            propertyName: 'gitlab.app.id',
            propertyValue: this.gitlabAppId,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.url',
            propertyValue: this.gitlabUrl,
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
      let url = `${this.$api.BASE_URL}/${this.$api.URL_INTEGRATION}/gitlab/${this.isGitlabEnabled}`;
      this.axios
        .post(url)
        .then(() => {
          console.log('GitLab state updated successfully');
          this.$toastr.s(this.$t('admin.configuration_saved'));
        })
        .catch((error) => {
          console.error('Error updating GitLab state:', error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      let configItems = response.data.filter((item) => {
        return item.groupName === 'integrations';
      });
      for (let item of configItems) {
        switch (item.propertyName) {
          case 'gitlab.enabled':
            this.isGitlabEnabled = common.toBoolean(item.propertyValue);
            break;
          case 'sbom.push.enabled':
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
          case 'gitlab.app.id':
            this.gitlabAppId = item.propertyValue;
            break;
          case 'gitlab.url':
            this.gitlabUrl = item.propertyValue;
            break;
          case 'gitlab.jwks.path':
            this.gitlabJwksPath = configItemsAppId[0].propertyValue;
            break;
        }
      }
    });
  },
};
</script>
