<template>
  <extension-config-form
    extension-name="nvd"
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
