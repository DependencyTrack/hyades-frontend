<template>
  <div>
    <b-form-group>
      <b-form-checkbox
        :id="configDef.name"
        color="primary"
        :checked="initialValue"
        @input="$emit('input', String($event))"
        switch
        >{{ configDef.name }}</b-form-checkbox
      >
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
    value: {
      type: String,
      default: 'false',
    },
  },
  computed: {
    initialValue() {
      return this.value === 'true';
    },
  },
};
</script>
