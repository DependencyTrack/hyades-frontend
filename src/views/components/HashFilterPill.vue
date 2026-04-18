<template>
  <filter-pill-dropdown
    ref="pill"
    :field-name="fieldName"
    :field-label="fieldLabel"
    icon="fa-hashtag"
    :has-filter="hasFilter"
    @show="onDropdownShow"
    @hide="onDropdownHide"
    @clear="clearFilter"
    @dismiss="$emit('dismiss')"
  >
    <template #value>{{ value.hashType }} = "{{ value.hash }}"</template>

    <b-input-group class="mb-2">
      <b-input-group-prepend>
        <b-form-select
          v-model="tmpHashType"
          :options="hashTypeOptions"
          size="sm"
        ></b-form-select>
      </b-input-group-prepend>
      <b-form-input
        ref="valueInput"
        v-model="tmpHash"
        :placeholder="$t('message.value')"
        size="sm"
        @keyup.enter="applyFilter"
      ></b-form-input>
    </b-input-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="!tmpHash || !tmpHashType"
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

export default {
  name: 'HashFilterPill',
  components: { FilterPillDropdown },
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
    hashTypes: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tmpHashType: null,
      tmpHash: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.hashType && val.hash) {
          this.tmpHashType = val.hashType;
          this.tmpHash = val.hash;
        } else {
          this.tmpHashType = null;
          this.tmpHash = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && this.value.hashType && this.value.hash;
    },
    hashTypeOptions() {
      return [
        {
          value: null,
          text: `-- ${this.$t('message.hash_type')} --`,
          disabled: true,
        },
        ...this.hashTypes,
      ];
    },
  },
  methods: {
    onDropdownShow() {
      this.$nextTick(() => {
        if (this.$refs.valueInput) {
          this.$refs.valueInput.focus();
        }
      });
    },
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpHashType = this.value.hashType;
        this.tmpHash = this.value.hash;
      } else {
        this.tmpHashType = null;
        this.tmpHash = '';
      }
    },
    applyFilter() {
      const trimmed = this.tmpHash ? this.tmpHash.trim() : '';
      if (!trimmed || !this.tmpHashType) {
        return;
      }

      this.$emit('input', {
        hashType: this.tmpHashType,
        hash: trimmed,
      });
      this.$refs.pill.hide();
    },
    clearFilter() {
      this.tmpHashType = null;
      this.tmpHash = '';
      this.$refs.pill.hide();
      this.$emit('input', null);
    },
  },
};
</script>
