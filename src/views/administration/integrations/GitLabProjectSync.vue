<template>
  <b-card no-body :header="header">
    <b-card-body>
      <c-switch
        id="enabled"
        color="primary"
        v-model="enabled"
        label
        v-bind="labelIcon"
      />{{ $t('admin.integration_gitlab_enable') }}
      <br />
      <c-switch
        id="includeArchived"
        color="primary"
        v-model="includeArchived"
        label
        v-bind="labelIcon"
      />{{ $t('admin.include_archived_projects') }}
      <br />
    </b-card-body>
    <b-card-footer>
      <b-row>
        <b-col>
          <h5>Topics</h5>
          <div class="mb-2">
            <ul style="width: 700px; list-style-type: none; padding: 0">
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
// eslint-disable-next-line no-unused-vars
import axios from 'axios'; // Import axios
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
    ActionableListGroupItem,
  },
  data() {
    return {
      enabled: false,
      includeArchived: false,
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
            propertyName: 'gitlab.enabled',
            propertyValue: this.enabled,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.include.archived',
            propertyValue: this.includeArchived,
          },
          {
            groupName: 'integrations',
            propertyName: 'gitlab.topics',
            propertyValue: JSON.stringify(this.topics),
          },
        ]);
      } catch (error) {
        console.error('Error updating configuration properties:', error);
      }
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      const configItems = response.data.filter((item) => {
        return (
          item.groupName === 'integrations' &&
          item.propertyName === 'gitlab.enabled'
        );
      });
      if (configItems.length > 0) {
        this.enabled = common.toBoolean(configItems[0].propertyValue);
      }
      const configItemsincludeArchived = response.data.filter((item) => {
        return (
          item.groupName === 'integrations' &&
          item.propertyName === 'gitlab.include.archived'
        );
      });
      if (configItemsincludeArchived.length > 0) {
        this.includeArchived = common.toBoolean(
          configItemsincludeArchived[0].propertyValue,
        );
      }
      const configItemstopics = response.data.filter((item) => {
        return (
          item.groupName === 'integrations' &&
          item.propertyName === 'gitlab.topics'
        );
      });
      if (configItemstopics.length > 0) {
        this.topics = JSON.parse(configItemstopics[0].propertyValue);
      }
    });
  },
};
</script>
