<template>
  <div>
    <b-form-group :label="configDef.name">
      <b-form-input
        :id="configDef.name"
        step=".001"
        type="datetime-local"
        :required="configDef.is_required"
        :state="isValid"
        :value="initialValue"
        @input="onInputChange"
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
    timezoneOffsetMillis() {
      // UTC+2 timezone yields -120 which is a bit counter-intuitive.
      // Invert it so it's easier to work with.
      const offsetMinutes = -new Date().getTimezoneOffset();
      return offsetMinutes * 60 * 1000;
    },
    initialValue() {
      if (!this.value) {
        return null;
      }

      // Initial value retrieved from the API is always in UTC.
      const timestampEpochMillis = Number(this.value);

      // Apply the local TZ's offset since datetime-local form inputs
      // always assume the browser's timezone.
      const timestampLocalMillis =
        timestampEpochMillis + this.timezoneOffsetMillis;

      return new Date(timestampLocalMillis).toISOString().replace(/Z$/, '');
    },
    isValid() {
      return (
        this.invalidFeedback === undefined || this.invalidFeedback === null
      );
    },
  },
  methods: {
    async onInputChange(inputText) {
      if (!inputText) {
        this.$emit('input', null);
        return;
      }

      // datetime-local form inputs assume the browser's timezone.
      // Subtract the TZ offset to get the corresponding UTC value.
      const timestampLocalMillis = new Date(inputText).getTime();
      const timestampEpochMillis =
        timestampLocalMillis - this.timezoneOffsetMillis;

      this.$emit('input', String(timestampEpochMillis));
    },
  },
};
</script>
