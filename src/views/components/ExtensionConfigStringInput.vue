<template>
  <div>
    <b-form-group :label="configDef.name">
      <b-form-input
        :id="configDef.name"
        :value="value"
        :type="inputType"
        :required="configDef.is_required"
        :state="isValid"
        @input="$emit('input', $event)"
      />
      <b-form-invalid-feedback
        :id="`${configDef.name}-invalid-feedback`"
        v-show="!isValid"
        >{{ invalidFeedback }}
      </b-form-invalid-feedback>
      <p v-show="configDef.description" class="font-sm text-muted mt-1 mb-0">
        {{ configDef.description }}
      </p>
    </b-form-group>
  </div>
</template>
<script>
export default {
  props: {
    configDef: {
      type: Object,
      required: true,
    },
    invalidFeedback: {
      type: String,
      default: null,
    },
    value: {
      type: String,
    },
  },
  computed: {
    inputType() {
      switch (this.configDef.type) {
        case 'URL':
          return 'url';
        default:
          if (this.configDef.is_secret) {
            return 'password';
          }
          return 'text';
      }
    },
    isValid() {
      return (
        this.invalidFeedback === undefined || this.invalidFeedback === null
      );
    },
  },
};
</script>
