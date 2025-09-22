<template>
  <extension-config-form
    extension-name="github"
    extension-point-name="vuln.datasource"
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
