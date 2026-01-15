<template>
  <b-card no-body :header="extensionName">
    <b-form @submit="onSubmit">
      <b-card-body>
        <b-alert v-if="loadError" variant="danger" show>
          {{ loadError }}
        </b-alert>

        <div v-if="!loadError && schema">
          <div
            v-for="(propSchema, propName) in schema.properties"
            :key="propName"
            class="form-group"
          >
            <json-schema-form-field
              :schema="enrichSchema(propSchema, propName)"
              :property-name="propName"
              :value="formData[propName]"
              :validation-error="getValidationError(propName)"
              :validation-errors="getNestedValidationErrors(propName)"
              @input="onFieldChange(propName, $event)"
            />
          </div>
        </div>

        <div v-if="!schema && !loadError" class="text-center">
          <b-spinner />
          <p class="mt-2">{{ this.$t('message.loading') }}</p>
        </div>
      </b-card-body>
      <b-card-footer v-if="!hideSubmitButton">
        <b-button
          variant="outline-primary"
          type="submit"
          :disabled="isSavingInProgress || !schema"
        >
          <b-spinner v-show="isSavingInProgress" small />
          {{ this.$t('admin.submit') }}
        </b-button>
      </b-card-footer>
    </b-form>
  </b-card>
</template>

<script>
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import JsonSchemaFormField from './JsonSchemaFormField.vue';

export default {
  components: {
    JsonSchemaFormField,
  },
  props: {
    extensionPointName: {
      type: String,
      required: false,
    },
    extensionName: {
      type: String,
      required: true,
    },
    configSchemaUrl: {
      type: String,
      required: false,
    },
    initialConfig: {
      type: Object,
      required: false,
      default: null,
    },
    hideSubmitButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      schema: null,
      formData: {},
      validationErrors: {},
      isSavingInProgress: false,
      loadError: null,
      ajv: null,
    };
  },
  computed: {
    normalizedFormData() {
      return this.normalizeFormData(this.formData);
    },
  },
  async mounted() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      validateFormats: true,
    });
    addFormats(this.ajv);
    await this.fetchSchemaAndConfig();
  },
  methods: {
    async fetchSchemaAndConfig() {
      try {
        const schemaUrl =
          this.configSchemaUrl ||
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config-schema`;

        let schemaResponse, configData;
        if (this.initialConfig !== null) {
          schemaResponse = await this.axios.get(schemaUrl);
          configData = this.initialConfig;
        } else {
          const configUrl = `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config`;
          const [schemaResp, configResponse] = await Promise.all([
            this.axios.get(schemaUrl),
            this.axios.get(configUrl),
          ]);
          schemaResponse = schemaResp;
          configData = configResponse.data.config || {};
        }

        this.schema = schemaResponse.data;
        this.formData = this.initializeFormData(configData);
      } catch (err) {
        console.error(`Failed to load schema or config: ${err}`);
        this.loadError = `Failed to load extension configuration: ${err.message}`;
      }
    },
    initializeFormData(configData) {
      const data = { ...configData };

      if (this.schema?.properties) {
        Object.entries(this.schema.properties).forEach(
          ([propName, propSchema]) => {
            if (data[propName] === undefined) {
              data[propName] = this.getDefaultValue(propSchema);
            }
          },
        );
      }

      return data;
    },
    getDefaultValue(schema) {
      // Deep clone default values to avoid shared references.
      if (schema.default !== undefined) {
        return JSON.parse(JSON.stringify(schema.default));
      }

      switch (schema.type) {
        case 'string':
          return null;
        case 'number':
        case 'integer':
          return null;
        case 'boolean':
          return false;
        case 'array':
          return [];
        case 'object':
          return {};
        default:
          return null;
      }
    },
    onFieldChange(propName, value) {
      this.$set(this.formData, propName, value);

      if (this.validationErrors[propName]) {
        this.$set(this.validationErrors, propName, null);
      }
    },
    validateForm() {
      if (!this.schema) {
        return false;
      }

      const validate = this.ajv.compile(this.schema);
      const valid = validate(this.normalizedFormData);

      if (!valid) {
        this.validationErrors = {};
        validate.errors?.forEach((error) => {
          const field = error.instancePath
            .replace(/^\//, '')
            .replace(/\//g, '.');
          const message = this.formatValidationError(error);

          // For root-level errors (empty field path), show on the offending property.
          if (!field && error.params?.missingProperty) {
            this.validationErrors[error.params.missingProperty] = message;
          } else if (field) {
            this.validationErrors[field] = message;
          }
        });
        return false;
      }

      this.validationErrors = {};
      return true;
    },
    // Normalize form data by omitting fields that are null entirely.
    // Required for schema validation to correctly determine missing required fields.
    normalizeFormData(data) {
      if (data === null || data === undefined) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((item) => this.normalizeFormData(item));
      }

      if (typeof data === 'object') {
        const normalized = {};
        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (value !== null) {
            normalized[key] = this.normalizeFormData(value);
          }
        });
        return normalized;
      }

      return data;
    },
    formatValidationError(error) {
      const { keyword, params, message } = error;

      switch (keyword) {
        case 'required':
          return this.$t('validation.schema.required', {
            property: params.missingProperty,
          });
        case 'type':
          return this.$t('validation.schema.type', { type: params.type });
        case 'format':
          return this.$t('validation.schema.format', { format: params.format });
        case 'minLength':
          return this.$t('validation.schema.min_length', {
            limit: params.limit,
          });
        case 'maxLength':
          return this.$t('validation.schema.max_length', {
            limit: params.limit,
          });
        case 'minimum':
          return this.$t('validation.schema.minimum', { limit: params.limit });
        case 'maximum':
          return this.$t('validation.schema.maximum', { limit: params.limit });
        case 'minItems':
          return this.$t('validation.schema.min_items', {
            limit: params.limit,
          });
        case 'maxItems':
          return this.$t('validation.schema.max_items', {
            limit: params.limit,
          });
        case 'pattern':
          return this.$t('validation.schema.pattern');
        case 'enum':
          return this.$t('validation.schema.enum', {
            values: params.allowedValues?.join(', '),
          });
        case 'uniqueItems':
          return this.$t('validation.schema.unique_items');
        default:
          return message || this.$t('validation.schema.invalid');
      }
    },
    async updateConfig() {
      if (this.isSavingInProgress) {
        return;
      }

      if (!this.validateForm()) {
        const errorCount = Object.keys(this.validationErrors).length;
        const errorSummary =
          errorCount === 1
            ? this.$t('validation.schema.validation_failed')
            : this.$t('validation.schema.validation_failed_plural', {
                count: errorCount,
              });
        await this.$toastr.e(
          errorSummary,
          this.$t('message.input_validation_failed'),
        );

        return;
      }

      try {
        this.isSavingInProgress = true;
        const response = await this.axios.put(
          `${this.$api.BASE_URL}/api/v2/extension-points/${this.extensionPointName}/extensions/${this.extensionName}/config`,
          {
            config: this.normalizedFormData,
          },
          {
            validateStatus: function (status) {
              return status === 204 || status === 304;
            },
          },
        );

        this.validationErrors = {};

        if (response.status === 204) {
          await this.$toastr.s(
            this.$t('message.record_updated_message'),
            this.$t('message.record_updated_title'),
          );
        } else if (response.status === 304) {
          await this.$toastr.i(
            this.$t('message.record_unchanged_message'),
            this.$t('message.record_unchanged_title'),
          );
        }
      } finally {
        this.isSavingInProgress = false;
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      await this.updateConfig();
    },
    getValidationError(propName) {
      return this.validationErrors[propName] || null;
    },
    // Extract nested validation errors for arrays and objects,
    // e.g. "ecosystems.0" -> { 0: "error message" }.
    getNestedValidationErrors(propName) {
      const prefix = `${propName}.`;
      const nestedErrors = {};

      Object.keys(this.validationErrors).forEach((key) => {
        if (key.startsWith(prefix)) {
          const nestedKey = key.substring(prefix.length);
          nestedErrors[nestedKey] = this.validationErrors[key];
        }
      });

      return nestedErrors;
    },
    // Make it easier to detect whether a field is required
    // by attaching the required property directly to it.
    enrichSchema(propSchema, propName) {
      return {
        ...propSchema,
        isRequired: this.schema.required?.includes(propName) || false,
      };
    },
    async validateAndGetConfig() {
      if (!this.validateForm()) {
        const errorCount = Object.keys(this.validationErrors).length;
        const errorSummary =
          errorCount === 1
            ? this.$t('validation.schema.validation_failed')
            : this.$t('validation.schema.validation_failed_plural', {
                count: errorCount,
              });
        throw new Error(errorSummary);
      }
      return this.normalizedFormData;
    },
  },
};
</script>
