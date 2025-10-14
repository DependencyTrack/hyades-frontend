<template>
  <div>
    <extension-config-form
      extension-name="osv"
      extension-point-name="vuln.datasource"
      @show-modal="openModal"
    />
    <ecosystem-modal
      id="osv-ecosystem-modal"
      :allowed-values="allowedValues"
      :selected-values="selectedValues"
      @selection="updateValues"
    />
  </div>
</template>

<script>
import ExtensionConfigForm from '@/views/components/ExtensionConfigForm.vue';
import EcosystemModal from '@/views/administration/vuln-sources/EcosystemModal.vue';

export default {
  components: { ExtensionConfigForm, EcosystemModal },
  data() {
    return {
      allowedValues: [],
      selectedValues: [],
      updateCallback: null,
    };
  },
  methods: {
    openModal({ configDef, update }) {
      this.allowedValues = configDef.allowed_values ?? [];
      this.selectedValues = (configDef.value ?? '').split(',');
      this.updateCallback = update;
      this.$root.$emit('bv::show::modal', 'osv-ecosystem-modal');
    },
    updateValues(values) {
      this.$root.$emit('bv::hide::modal', 'osv-ecosystem-modal');
      this.selectedValues = values;
      if (this.updateCallback) {
        this.updateCallback(values.join(','));
        this.updateCallback = null;
      }
    },
  },
};
</script>
