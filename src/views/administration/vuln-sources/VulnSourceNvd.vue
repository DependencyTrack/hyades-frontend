<template>
  <b-card no-body :header="header">
    <b-card-body>
      <c-switch
        :disabled="!this.vulnsourceEnabled && !this.nvdApiEndpoint"
        id="vulnsourceEnabled"
        color="primary"
        v-model="vulnsourceEnabled"
        label
        v-bind="labelIcon"
      />
      {{ $t('admin.vulnsource_nvd_enable') }}
      <hr />
      {{ $t('admin.vulnsource_nvd_desc') }}
      <br /><br />
      {{ $t('admin.vulnsource_nvd_notice') }}
      <hr />
      <b-validated-input-group-form-input
        id="nvdApiEndpoint"
        label="API endpoint"
        input-group-size="mb-3"
        v-model="nvdApiEndpoint"
        lazy="true"
      />
      <b-validated-input-group-form-input
        id="nvdApiKey"
        label="API key"
        input-group-size="mb-3"
        type="password"
        v-model="nvdApiKey"
        lazy="true"
      />
      <p class="font-sm text-muted">
        <span class="fa fa-question-circle">&nbsp;</span>
        <a :href="nvdApiRequestApiKeyUrl" target="_blank">{{
          $t('admin.nvd_request_api_key_help')
        }}</a>
      </p>
    </b-card-body>
    <b-card-footer>
      <b-button
        :disabled="this.vulnsourceEnabled && !this.nvdApiEndpoint"
        variant="outline-primary"
        class="px-4"
        @click="saveChanges"
      >
        {{ $t('message.update') }}
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
import BValidatedInputGroupFormInput from '../../../forms/BValidatedInputGroupFormInput';
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
    BValidatedInputGroupFormInput,
  },
  data() {
    return {
      vulnsourceEnabled: false,
      nvdApiEndpoint: '',
      nvdApiKey: '',
      nvdApiRequestApiKeyUrl:
        'https://nvd.nist.gov/developers/request-an-api-key',
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  methods: {
    saveChanges: function () {
      this.updateConfigProperties([
        {
          groupName: 'vuln-source',
          propertyName: 'nvd.enabled',
          propertyValue: this.vulnsourceEnabled,
        },
        {
          groupName: 'vuln-source',
          propertyName: 'nvd.api.url',
          propertyValue: this.nvdApiEndpoint,
        },
        {
          groupName: 'vuln-source',
          propertyName: 'nvd.api.key',
          propertyValue: this.nvdApiKey,
        },
      ]);
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      let configItems = response.data.filter(function (item) {
        return item.groupName === 'vuln-source';
      });
      for (let i = 0; i < configItems.length; i++) {
        let item = configItems[i];
        switch (item.propertyName) {
          case 'nvd.enabled':
            this.vulnsourceEnabled = common.toBoolean(item.propertyValue);
            break;
          case 'nvd.api.url':
            this.nvdApiEndpoint = item.propertyValue;
            break;
          case 'nvd.api.key':
            this.nvdApiKey = item.propertyValue;
            break;
        }
      }
    });
  },
};
</script>
