<template>
  <b-card no-body class="border">
    <b-card-body>
      <div v-for="(propSchema, propName) in schema.properties" :key="propName">
        <json-schema-form-field
          :schema="propSchema"
          :property-name="propName"
          :value="localValue[propName]"
          :validation-error="validationErrors[propName]"
          @input="onPropertyChange(propName, $event)"
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import JsonSchemaFormField from './JsonSchemaFormField.vue';

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
  data() {
    const obj = this.value || {};
    return {
      localValue: obj,
    };
  },
  methods: {
    onPropertyChange(propName, propValue) {
      // Prevent component from re-rendering on every keystroke
      // by modifying the value in-place rather than emitting an
      // entirely new object. This is a bit of a hack but could
      // possibly be revisited after migration to Vue 3,
      // which is supposed to handle cases like this a bit better.
      this.$set(this.localValue, propName, propValue);
      this.$emit('input', this.localValue);
    },
  },
};
</script>
