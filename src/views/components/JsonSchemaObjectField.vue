<template>
  <b-card no-body class="border">
    <b-card-body>
      <div v-for="(propSchema, propName) in schema.properties" :key="propName">
        <json-schema-form-field
          :schema="enrichSchema(propSchema, propName, schema)"
          :property-name="`${propertyName}.${propName}`"
          :value="currentValue[propName]"
          :validation-error="validationErrors[propName]"
          :validation-errors="nestedErrorMap[propName] || {}"
          @input="onPropertyChange(propName, $event)"
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import JsonSchemaFormField from './JsonSchemaFormField.vue';
import {
  enrichSchema,
  buildNestedValidationErrorMap,
} from '@/shared/jsonSchemaForm';

export default {
  name: 'JsonSchemaObjectField',
  components: {
    JsonSchemaFormField,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    currentValue() {
      return this.value || {};
    },
    nestedErrorMap() {
      return buildNestedValidationErrorMap(this.validationErrors);
    },
  },
  methods: {
    enrichSchema,
    onPropertyChange(propName, propValue) {
      this.$emit('input', { ...this.currentValue, [propName]: propValue });
    },
  },
};
</script>
