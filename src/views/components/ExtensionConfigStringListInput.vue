<template>
  <b-form-group :label="configDef.name">
    <div class="list-group" style="width: 40%">
      <span v-for="val in selectedValues" :key="val">
        <actionable-list-group-item
          :value="val"
          :delete-icon="true"
          @actionClicked="removeValue(val)"
        />
      </span>

      <actionable-list-group-item
        :add-icon="true"
        @actionClicked="$emit('show-modal', configDef)"
      />
    </div>

    <p v-if="configDef.description" class="font-sm text-muted mt-1 mb-0">
      {{ configDef.description }}
    </p>
  </b-form-group>
</template>

<script>
import ActionableListGroupItem from './ActionableListGroupItem.vue';

export default {
  props: {
    configDef: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  components: { ActionableListGroupItem },
  data() {
    return {
      selectedValues: this.value ? this.value.split(',') : [],
    };
  },
  watch: {
    value(newVal) {
      this.selectedValues = newVal ? newVal.split(',') : [];
    },
  },
  methods: {
    removeValue(val) {
      this.selectedValues = this.selectedValues.filter((v) => v !== val);
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('input', this.selectedValues.join(','));
    },
  },
};
</script>
