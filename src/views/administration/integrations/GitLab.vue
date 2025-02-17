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
    </b-card-body>
    <b-card-footer>
      <b-button variant="outline-primary" class="px-4" @click="saveChanges">{{
        $t('message.update')
      }}</b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
// eslint-disable-next-line no-unused-vars
import axios from 'axios'; // Import axios
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
  },
  data() {
    return {
      enabled: false,
      includeArchived: false,
    };
  },
  methods: {
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
            propertyName: 'gitlab.include_archieved_projects',
            propertyValue: this.includeArchived,
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
      const configItemsincludeArchived = response.data.include((item) => {
        return (
          item.groupName === 'integrations' &&
          item.propertyName === 'gitlab.include_archived_projects'
        );
      });
      if (configItemsincludeArchived.length > 0) {
        this.includeArchived = common.toBoolean(
          configItemsincludeArchived[0].propertyValue,
        );
      }
    });
  },
};
</script>
