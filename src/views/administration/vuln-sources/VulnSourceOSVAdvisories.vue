<template>
  <extension-config-form
    ref="extensionConfigForm"
    extension-name="osv"
    extension-point-name="vuln-data-source"
    :additional-fields="additionalFields"
  />
</template>

<script>
import ExtensionConfigForm from '@/views/components/ExtensionConfigForm.vue';
import common from '../../../shared/common';

export default {
  components: {
    ExtensionConfigForm,
  },
  computed: {
    additionalFields() {
      return {
        incrementalMirroringEnabled: {
          schema: {
            type: 'boolean',
            title: this.$t('admin.incremental_mirroring_enabled'),
            default: true,
          },
        },
      };
    },
  },
  mounted() {
    // Ensure default value is set after form initializes
    this.$nextTick(() => {
      setTimeout(() => {
        this.ensureDefaultValue();
      }, 100);
    });
  },
  methods: {
    ensureDefaultValue() {
      if (!this.$refs.extensionConfigForm) {
        return;
      }

      const formData = this.$refs.extensionConfigForm.formData;
      if (!formData) {
        return;
      }

      // Set default to true if not already set
      if (
        formData.incrementalMirroringEnabled === undefined ||
        formData.incrementalMirroringEnabled === null ||
        formData.incrementalMirroringEnabled === false
      ) {
        this.$set(formData, 'incrementalMirroringEnabled', true);
      }
    },
  },
};
</script>
