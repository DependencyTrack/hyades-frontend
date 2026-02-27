<template>
  <extension-config-form
    :key="$route.params.extensionName"
    :extension-name="$route.params.extensionName"
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
