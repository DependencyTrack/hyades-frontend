<template>
  <extension-config-form
    extension-name="osv"
    extension-point-name="vuln-data-source"
  />
</template>

<script>
import ExtensionConfigForm from '@/views/components/ExtensionConfigForm.vue';

export default {
  components: {
    ExtensionConfigForm,
  },
};
</script>
