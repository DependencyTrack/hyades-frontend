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
    </b-card-body>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
// eslint-disable-next-line no-unused-vars
import axios from 'axios'; // Import axios
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';

const GITLAB_ENABLED = {
  getGroupName: () => 'integrations',
  getPropertyName: () => 'gitlab.enabled',
};

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
    };
  },
  methods: {
    saveChanges: function () {
      try {
        this.updateConfigProperties([
          {
            // eslint-disable-next-line no-undef
            groupName: GITLAB_ENABLED.getGroupName(),
            // eslint-disable-next-line no-undef
            propertyName: GITLAB_ENABLED.getPropertyName(),
            propertyValue: String.valueOf(this.enabled),
          },
        ]);
      } catch (error) {
        console.error('Error updating configuration properties:', error);
      }
    },
  },
  created() {
    this.axios
      .get(this.configUrl)
      .then((response) => {
        const configItems = response.data.filter((item) => {
          return (
            item.groupName === GITLAB_ENABLED.getGroupName() &&
            item.propertyName === GITLAB_ENABLED.getPropertyName()
          );
        });
        if (configItems.length > 0) {
          this.enabled = common.toBoolean(configItems[0].propertyValue);
        }
      })
      .catch((error) => {
        console.error('Error fetching configuration data:', error);
        if (error.response) {
          console.error('Error response:', error.response);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      });
  },
};
</script>
