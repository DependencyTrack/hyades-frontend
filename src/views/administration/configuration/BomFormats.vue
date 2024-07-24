<template>
  <b-card no-body :header="header">
    <b-card-body>
      <p>{{ $t('admin.bom_formats_desc') }}</p>
      <div>
        <c-switch
          color="primary"
          v-model="isCycloneDXEnabled"
          label
          v-bind="labelIcon"
        />{{ $t('admin.enable_bom_cyclonedx') }}
      </div>
      <div>
        <c-switch
          id="component"
          color="primary"
          v-model="bomValidate"
          label
          v-bind="labelIcon"
        />{{ $t('admin.bom_validation') }}
        <p class="font-sm text-muted">
          <span class="fa fa-info-circle"></span>
          {{ $t('admin.bom_validation_info') }}
        </p>
      </div>
      <div>
        <b-form-group
          :label="$t('admin.bom_upload_storage')"
          label-size="lg"
          label-class="font-weight-bold pt-0 mb-2"
        >
          <b-form-group
            :label="$t('admin.bom_upload_storage_provider')"
            label-for="bomUploadStorageProviderSelect"
            label-cols="4"
            label-cols-lg="2"
            content-cols-sm
            content-cols-lg="4"
          >
            <b-form-select
              id="bomUploadStorageProviderSelect"
              v-model="bomUploadStorageProvider"
            >
              <b-form-select-option
                value="org.dependencytrack.storage.DatabaseBomUploadStorageProvider"
                >Database</b-form-select-option
              >
              <b-form-select-option
                value="org.dependencytrack.storage.LocalBomUploadStorageProvider"
                >Local</b-form-select-option
              >
            </b-form-select>
          </b-form-group>
          <b-form-group
            :label="$t('admin.bom_upload_storage_compression_level')"
            label-for="bomUploadStorageCompressionLevelInput"
            label-cols="4"
            label-cols-lg="2"
            content-cols-sm
            content-cols-lg="4"
          >
            <b-form-row class="mt-2">
              <b-col cols="11">
                <b-form-input
                  id="bomUploadStorageCompressionLevelInput"
                  v-model="bomUploadStorageCompressionLevel"
                  type="range"
                  min="1"
                  max="22"
                />
              </b-col>
              <b-col cols="1">
                <span>{{ bomUploadStorageCompressionLevel }}</span>
              </b-col>
            </b-form-row>
          </b-form-group>
        </b-form-group>
      </div>
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
      isCycloneDXEnabled: false,
      bomValidate: true,
      bomUploadStorageProvider: null,
      bomUploadStorageCompressionLevel: null,
    };
  },
  methods: {
    saveChanges: function () {
      this.updateConfigProperties([
        {
          groupName: 'artifact',
          propertyName: 'cyclonedx.enabled',
          propertyValue: this.isCycloneDXEnabled,
        },
        {
          groupName: 'artifact',
          propertyName: 'bom.validation.enabled',
          propertyValue: this.bomValidate,
        },
        {
          groupName: 'artifact',
          propertyName: 'bom.upload.storage.provider',
          propertyValue: this.bomUploadStorageProvider,
        },
        {
          groupName: 'artifact',
          propertyName: 'bom.upload.storage.compression.level',
          propertyValue: this.bomUploadStorageCompressionLevel,
        },
      ]);
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      let configItems = response.data.filter(function (item) {
        return item.groupName === 'artifact';
      });
      for (let i = 0; i < configItems.length; i++) {
        let item = configItems[i];
        let enabled = common.toBoolean(item.propertyValue);
        switch (item.propertyName) {
          case 'cyclonedx.enabled':
            this.isCycloneDXEnabled = enabled;
            break;
          case 'bom.validation.enabled':
            this.bomValidate = common.toBoolean(item.propertyValue);
            break;
          case 'bom.upload.storage.provider':
            this.bomUploadStorageProvider = item.propertyValue;
            break;
          case 'bom.upload.storage.compression.level':
            this.bomUploadStorageCompressionLevel = item.propertyValue;
            break;
        }
      }
    });
  },
};
</script>
