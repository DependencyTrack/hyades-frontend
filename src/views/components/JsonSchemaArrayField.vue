<template>
  <div>
    <showdown
      v-if="schema.description"
      :markdown="schema.description"
      class="form-text text-muted small mb-2 d-block"
    />

    <div
      v-for="(item, index) in localValue"
      :key="itemKeys[index]"
      class="d-flex align-items-start mb-2"
    >
      <div class="flex-grow-1 mr-2">
        <json-schema-form-field
          :schema="itemSchema"
          :property-name="`${propertyName}[${index}]`"
          :value="item"
          :validation-error="validationErrors[index]"
          :validation-errors="getNestedValidationErrors(index)"
          :is-array-item="true"
          @input="onItemChange(index, $event)"
        />
      </div>
      <b-button
        variant="outline-danger"
        size="sm"
        @click="removeItem(index)"
        :aria-label="`Remove item ${index + 1}`"
      >
        <i class="fa fa-trash"></i>
      </b-button>
    </div>

    <b-button
      variant="outline-primary"
      size="sm"
      @click="addItem"
      :disabled="isMaxItemsReached"
    >
      <i class="fa fa-plus"></i>
      {{ addButtonText }}
    </b-button>

    <small
      v-if="!validationError && (schema.minItems || schema.maxItems)"
      class="form-text text-muted d-block mt-1"
    >
      <span v-if="schema.minItems">Minimum {{ schema.minItems }} items. </span>
      <span v-if="schema.maxItems">Maximum {{ schema.maxItems }} items.</span>
    </small>

    <div v-if="validationError" class="invalid-feedback d-block">
      {{ validationError }}
    </div>
  </div>
</template>

<script>
import JsonSchemaFormField from './JsonSchemaFormField.vue';
import Showdown from './Showdown.vue';

export default {
  name: 'JsonSchemaArrayField',
  components: {
    JsonSchemaFormField,
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
      type: Array,
      default: () => [],
    },
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
    validationError: {
      type: String,
      default: null,
    },
  },
  data() {
    const arr = this.value || [];
    return {
      itemKeys: arr.map((_, i) => i),
      nextKey: arr.length,
      localValue: arr,
    };
  },
  computed: {
    itemSchema() {
      return this.schema.items || { type: 'string' };
    },
    addButtonText() {
      const itemName = this.itemSchema.title || this.$t('message.item');
      return this.$t('message.add_item', { item: itemName });
    },
    isMaxItemsReached() {
      return (
        this.schema.maxItems !== undefined &&
        this.localValue.length >= this.schema.maxItems
      );
    },
  },
  methods: {
    addItem() {
      const defaultValue = this.getDefaultValue();
      const newArray = [...this.localValue, defaultValue];
      this.localValue = newArray;
      this.itemKeys.push(this.nextKey++);
      this.$emit('input', newArray);
    },
    removeItem(index) {
      const newArray = this.localValue.filter((_, i) => i !== index);
      this.localValue = newArray;
      this.itemKeys.splice(index, 1);
      this.$emit('input', newArray);
    },
    onItemChange(index, newValue) {
      // Prevent component from re-rendering on every keystroke
      // by modifying the value in-place rather than emitting an
      // entirely new array. This is a bit of a hack but could
      // possibly be revisited after migration to Vue 3,
      // which is supposed to handle cases like this a bit better.
      this.localValue[index] = newValue;
      this.$emit('input', this.localValue);
    },
    getDefaultValue() {
      const itemType = this.itemSchema.type;

      // Deep clone default values to avoid shared references.
      if (this.itemSchema.default !== undefined) {
        return JSON.parse(JSON.stringify(this.itemSchema.default));
      }

      switch (itemType) {
        case 'string':
          return '';
        case 'number':
        case 'integer':
          return 0;
        case 'boolean':
          return false;
        case 'object':
          return {};
        case 'array':
          return [];
        default:
          return null;
      }
    },
    // Extract nested validation errors for a given array index,
    // e.g. for index 0, extract "0.url" -> "url".
    getNestedValidationErrors(index) {
      const prefix = `${index}.`;
      const nestedErrors = {};

      Object.keys(this.validationErrors).forEach((key) => {
        if (key.startsWith(prefix)) {
          const nestedKey = key.substring(prefix.length);
          nestedErrors[nestedKey] = this.validationErrors[key];
        }
      });

      return nestedErrors;
    },
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
}
.align-items-start {
  align-items: flex-start;
}
.flex-grow-1 {
  flex-grow: 1;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
