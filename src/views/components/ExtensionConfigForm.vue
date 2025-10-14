<template>
  <b-card no-body :header="extensionName">
    <b-form @submit="onSubmit">
      <b-card-body>
        <div v-for="config in configs" :key="config.name" class="form-group">
          <component
            v-if="getComponentName(config.type)"
            :ref="config.name"
            :is="getComponentName(config.type)"
            :configDef="config"
            :invalidFeedback="getValidationFeedback(config.name)"
            :value="config.value"
            @input="onConfigValueChange(config.name, $event)"
            @show-modal="
              $emit('show-modal', {
                configDef: config,
                update: (newVal) => onConfigValueChange(config.name, newVal),
              })
            "
          />
          <b-alert v-else variant="warning" show dismissible>
            Configuration <code>{{ config.name }}</code> could not be rendered
          </b-alert>
        </div>
      </b-card-body>
      <b-card-footer>
        <b-button
          variant="outline-primary"
          type="submit"
          :disabled="isSavingInProgress"
        >
          <b-spinner v-show="isSavingInProgress" small />
          {{ this.$t('admin.submit') }}
        </b-button>
      </b-card-footer>
    </b-form>
  </b-card>
</template>

<script>
import ExtensionConfigBooleanInput from '@/views/components/ExtensionConfigBooleanInput.vue';
import ExtensionConfigStringInput from '@/views/components/ExtensionConfigStringInput.vue';
import ExtensionConfigStringListInput from '@/views/components/ExtensionConfigStringListInput.vue';
import ExtensionConfigInstantInput from '@/views/components/ExtensionConfigInstantInput.vue';

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
    ExtensionConfigBooleanInput,
    ExtensionConfigInstantInput,
    ExtensionConfigStringListInput,
    ExtensionConfigStringInput,
  },
  data() {
    return {
      configs: [],
      configValues: [],
      validationFailureByName: new Map(),
      isSavingInProgress: false,
    };
  },
  async mounted() {
    await this.fetchConfigs();
  },
  methods: {
    async fetchConfigs() {
      try {
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/configs`,
        );

        this.configs = response.data.configs;
        this.configValues = this.configs.map((config) => {
          return {
            name: config.name,
            value: config.value !== undefined ? config.value : null,
          };
        });
      } catch (err) {
        console.error(`Failed to load configs : ${err}`);
        this.configs = [];
        this.configValues = [];
      }
    },
    async onConfigValueChange(configName, value) {
      const index = this.configValues.findIndex((c) => c.name === configName);
      if (index !== -1) {
        const updated = { ...this.configValues[index], value };
        this.configValues.splice(index, 1, updated);
        this.configs = this.configs.map((cfg) =>
          cfg.name === configName ? { ...cfg, value } : cfg,
        );
      }
    },
    async updateConfigs() {
      if (this.isSavingInProgress) {
        return;
      }

      try {
        this.isSavingInProgress = true;
        await this.axios.put(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/configs`,
          {
            configs: this.configValues,
          },
        );
        this.validationFailureByName.clear();
        await this.$toastr.s(this.$t('message.updated'));
      } catch (err) {
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.headers['content-type'] === 'application/problem+json' &&
          err.response.data.invalid_configs
        ) {
          for (const invalidConfig of err.response.data.invalid_configs) {
            this.validationFailureByName.set(
              invalidConfig.name,
              invalidConfig.message,
            );
          }
        } else {
          console.error(`Failed to update configs: ${err}`);
        }
      } finally {
        this.isSavingInProgress = false;
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      await this.updateConfigs();
    },
    getComponentName(configType) {
      switch (configType) {
        case 'BOOLEAN':
          return 'ExtensionConfigBooleanInput';
        case 'INSTANT':
          return 'ExtensionConfigInstantInput';
        case 'STRING_LIST':
          return 'ExtensionConfigStringListInput';
        case 'STRING':
        case 'URL':
          return 'ExtensionConfigStringInput';
        default:
          return null;
      }
    },
    getValidationFeedback(configName) {
      return this.validationFailureByName.get(configName);
    },
  },
};
</script>
