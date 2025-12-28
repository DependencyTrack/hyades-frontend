<template>
  <div>
    <b-form-group v-if="!isArrayItem" :label="label" :label-for="fieldId">
      <template v-if="!isComplexType && schema.description" v-slot:description>
        <showdown :markdown="schema.description" />
      </template>
      <component
        :is="fieldComponent"
        v-bind="fieldProps"
        @input="onInput"
        @change="onChange"
      />
      <b-form-invalid-feedback v-if="!isComplexType" :state="isValid">
        {{ validationError }}
      </b-form-invalid-feedback>
    </b-form-group>
    <component
      v-else
      :is="fieldComponent"
      v-bind="fieldProps"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>

<script>
import Showdown from './Showdown.vue';

export default {
  name: 'JsonSchemaFormField',
  components: {
    Showdown,
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
      type: [String, Number, Boolean, Array, Object],
      default: null,
    },
    validationError: {
      type: String,
      default: null,
    },
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
    isArrayItem: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fieldId() {
      return `field-${this.propertyName}`;
    },
    label() {
      return this.schema.title || this.propertyName;
    },
    isValid() {
      return !this.validationError;
    },
    isComplexType() {
      return this.schema.type === 'array' || this.schema.type === 'object';
    },
    fieldComponent() {
      if (this.schema.type === 'object') {
        return () => import('./JsonSchemaObjectField.vue');
      }
      if (this.schema.type === 'array') {
        return () => import('./JsonSchemaArrayField.vue');
      }
      if (this.schema.type === 'boolean') {
        return 'b-form-checkbox';
      }
      if (this.schema.enum) {
        return 'b-form-select';
      }
      return 'b-form-input';
    },
    fieldProps() {
      const baseProps = {
        id: this.fieldId,
        state: this.isValid ? null : false,
      };

      if (this.schema.type === 'object') {
        return {
          ...baseProps,
          value: this.value,
          schema: this.schema,
          propertyName: this.propertyName,
          validationErrors: this.validationErrors,
        };
      }

      if (this.schema.type === 'array') {
        return {
          ...baseProps,
          value: this.value,
          schema: this.schema,
          propertyName: this.propertyName,
          validationErrors: this.validationErrors,
          validationError: this.validationError,
        };
      }

      if (this.schema.type === 'boolean') {
        return {
          ...baseProps,
          checked: this.value,
          switch: true,
        };
      }

      if (this.schema.enum) {
        return {
          ...baseProps,
          value: this.value,
          options: this.schema.enum,
          required: this.isRequired,
        };
      }

      return {
        ...baseProps,
        value: this.value,
        type: this.getInputType(),
        required: this.isRequired,
        placeholder: this.schema.examples?.[0] || '',
        min: this.schema.minimum,
        max: this.schema.maximum,
        minlength: this.schema.minLength,
        maxlength: this.schema.maxLength,
        pattern: this.schema.pattern,
        readonly: this.schema.readOnly,
      };
    },
    isRequired() {
      return this.schema.isRequired || false;
    },
  },
  methods: {
    getInputType() {
      if (this.schema.type === 'boolean') {
        return 'checkbox';
      }
      if (this.schema.type === 'number' || this.schema.type === 'integer') {
        return 'number';
      }
      if (this.schema.type === 'string') {
        switch (this.schema.format) {
          case 'email':
            return 'email';
          case 'uri':
          case 'uri-reference':
            return 'url';
          case 'date':
            return 'date';
          case 'date-time':
            return 'datetime-local';
          case 'time':
            return 'time';
          case 'password':
            return 'password';
          default:
            return this.schema.minLength > 100 || this.schema.maxLength > 100
              ? 'textarea'
              : 'text';
        }
      }
      return 'text';
    },
    onInput(newValue) {
      if (this.schema.type === 'boolean') {
        return;
      }
      let processedValue = newValue;
      if (this.schema.type === 'number' || this.schema.type === 'integer') {
        processedValue = newValue === '' ? null : Number(newValue);
      }
      this.$emit('input', processedValue);
    },
    onChange(newValue) {
      if (this.schema.type === 'boolean') {
        this.$emit('input', newValue);
      }
    },
  },
};
</script>
