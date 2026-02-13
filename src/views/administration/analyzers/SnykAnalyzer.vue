<template>
  <extension-config-form
    extension-name="snyk"
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
