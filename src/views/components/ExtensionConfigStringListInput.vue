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
        @actionClicked="$root.$emit('bv::show::modal', modalId)"
      />
    </div>

    <p v-if="configDef.description" class="font-sm text-muted mt-1 mb-0">
      {{ configDef.description }}
    </p>

    <string-list-select-modal
      :id="modalId"
      :allowed-values="configDef.allowed_values"
      :selected-values="selectedValues"
      @selection="updateValues"
    />
  </b-form-group>
</template>

<script>
import ActionableListGroupItem from './ActionableListGroupItem.vue';
import StringListSelectModal from './StringListSelectModal.vue';

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
  components: {
    ActionableListGroupItem,
    StringListSelectModal,
  },
  data() {
    return {
      selectedValues: this.value ? this.value.split(',') : [],
      modalId: `${this.configDef.name}-modal`,
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
    updateValues(values) {
      this.$root.$emit('bv::hide::modal', this.modalId);
      // Update selected values
      this.selectedValues = values;
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('input', this.selectedValues.join(','));
    },
  },
};
</script>
