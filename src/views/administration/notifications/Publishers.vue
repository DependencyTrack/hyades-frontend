<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      <b-spinner />
      <p class="mt-2 mb-0">{{ $t('message.loading') }}</p>
    </div>
    <b-card
      v-else-if="selectedExtension && selectedExtension.configurable === false"
      no-body
      class="animated fadeIn"
    >
      <template #header>
        {{ $t('admin.publisher_card_title', { name: selectedExtensionTitle }) }}
      </template>
      <b-card-body>
        <p class="mb-0">{{ $t('admin.extension_no_config') }}</p>
      </b-card-body>
    </b-card>
    <extension-config-form
      v-else-if="$route.params.extensionName"
      :key="$route.params.extensionName"
      class="animated fadeIn"
      :extension-name="$route.params.extensionName"
      extension-point-name="notification-publisher"
      :testable="
        selectedExtension ? selectedExtension.testable !== false : true
      "
      :header="$t('admin.publisher_card_title', { name: routeExtensionTitle })"
    />
  </div>
</template>

<script>
import common from '@/shared/common';
import ExtensionConfigForm from '@/views/components/ExtensionConfigForm.vue';

export default {
  components: {
    ExtensionConfigForm,
  },
  data() {
    return {
      extensions: [],
      loading: true,
    };
  },
  computed: {
    selectedExtension() {
      const name = this.$route.params.extensionName;
      if (!name) return null;
      return this.extensions.find((e) => e.name === name) || null;
    },
    selectedExtensionTitle() {
      return this.selectedExtension
        ? common.titleCase(this.selectedExtension.name)
        : '';
    },
    routeExtensionTitle() {
      const name = this.$route.params.extensionName;
      return name ? common.titleCase(name) : '';
    },
  },
  async mounted() {
    await this.fetchExtensions();
    if (!this.$route.params.extensionName) {
      const first =
        this.extensions.find((e) => e.configurable) || this.extensions[0];
      if (first) {
        this.$router.replace({
          path: `/admin/notifications/publishers/${encodeURIComponent(first.name)}`,
        });
      }
    }
  },
  methods: {
    async fetchExtensions() {
      this.loading = true;
      try {
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/notification-publisher/extensions`,
        );
        this.extensions = response.data.items || [];
      } catch (error) {
        console.error('Failed to fetch notification publishers:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
