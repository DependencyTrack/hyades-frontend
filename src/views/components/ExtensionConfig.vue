<template>
  <b-card no-body :header="extensionName">
    <b-form @submit="onSubmit">
      <b-card-body>
        <b-form-group
          :label="$t('admin.configuration')"
          label-for="config-editor"
        >
          <extension-config-editor
            id="config-editor"
            :schema="configSchema"
            :valid.sync="isValid"
            v-model="config"
          />
        </b-form-group>
      </b-card-body>
      <b-card-footer>
        <b-button
          variant="outline-primary"
          type="submit"
          :disabled="isSavingInProgress || !isValid"
        >
          <b-spinner v-show="isSavingInProgress" small />
          {{ this.$t('admin.submit') }}
        </b-button>
      </b-card-footer>
    </b-form>
  </b-card>
</template>

<script>
import ExtensionConfigEditor from '@/views/components/ExtensionConfigEditor.vue';

export default {
  props: {
    extensionPointName: {
      type: String,
      required: true,
    },
    extensionName: {
      type: String,
      required: true,
    },
  },
  components: {
    ExtensionConfigEditor,
  },
  data() {
    return {
      config: null,
      configSchema: null,
      isValid: true,
      isSavingInProgress: false,
    };
  },
  async mounted() {
    await this.fetchConfigSchema();
    await this.fetchConfig();
  },
  methods: {
    async fetchConfigSchema() {
      try {
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config/schema`,
        );

        this.configSchema = response.data;
      } catch (err) {
        console.error(`Failed to load config schema: ${err}`);
        this.configSchema = null;
      }
    },
    async fetchConfig() {
      try {
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config`,
        );

        this.config = Buffer.from(response.data.config, 'base64').toString(
          'utf-8',
        );
      } catch (err) {
        console.error(`Failed to load config: ${err}`);
        this.config = null;
      }
    },
    async updateConfig() {
      if (this.isSavingInProgress) {
        return;
      }

      try {
        this.isSavingInProgress = true;
        const response = await this.axios.put(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config`,
          {
            config: Buffer.from(this.config, 'utf-8').toString('base64'),
          },
          {
            validateStatus: function (status) {
              return status === 204 || status === 304;
            },
          },
        );

        if (response.status === 204) {
          await this.$toastr.s(
            this.$t('message.record_updated_message'),
            this.$t('message.record_updated_title'),
          );
        } else if (response.status === 304) {
          this.$toastr.i(
            this.$t('message.record_unchanged_message'),
            this.$t('message.record_unchanged_title'),
          );
        }
      } catch (err) {
        console.error(`Failed to update configs: ${err}`);
      } finally {
        this.isSavingInProgress = false;
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      await this.updateConfig();
    },
  },
};
</script>
