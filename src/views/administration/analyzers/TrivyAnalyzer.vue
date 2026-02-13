<template>
  <extension-config-form
    extension-name="trivy"
    extension-point-name="vuln-analyzer"
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
