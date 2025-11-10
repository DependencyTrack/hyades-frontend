<template>
  <extension-config
    extension-name="nvd"
    extension-point-name="vuln.datasource"
  />
</template>

<script>
import ExtensionConfig from '@/views/components/ExtensionConfig.vue';

export default {
  components: {
    ExtensionConfig,
  },
};
</script>
