<template>
  <div>
    <b-alert v-if="loadError" variant="danger" show>
      {{ loadError }}
    </b-alert>

    <div v-else-if="loading" class="text-center">
      <b-spinner />
      <p class="mt-2">{{ $t('message.loading') }}</p>
    </div>

    <div v-else-if="extensions.length === 0" class="text-center">
      <p>{{ $t('admin.no_publishers_found') }}</p>
    </div>

    <div v-else>
      <b-nav tabs class="mb-3">
        <b-nav-item
          v-for="(ext, index) in extensions"
          :key="ext.name"
          :active="selectedIndex === index"
          @click="selectExtension(index)"
        >
          {{ ext.name }}
        </b-nav-item>
      </b-nav>

      <div v-if="checkingConfigurability" class="text-center py-3">
        <b-spinner />
        <p class="mt-2 mb-0">{{ $t('message.loading') }}</p>
      </div>

      <b-card v-else-if="isConfigurable === false">
        <p class="text-muted mb-0">
          {{ $t('admin.publisher_no_config') }}
        </p>
      </b-card>

      <extension-config-form
        v-else-if="isConfigurable === true && selectedExtension"
        :key="selectedExtension.name"
        :header="null"
        :extension-name="selectedExtension.name"
        extension-point-name="notification.publisher"
      />
    </div>
  </div>
</template>

<script>
import ExtensionConfigForm from '@/views/components/ExtensionConfigForm.vue';

export default {
  components: {
    ExtensionConfigForm,
  },
  data() {
    return {
      extensions: [],
      selectedIndex: 0,
      loading: true,
      loadError: null,
      isConfigurable: null,
      checkingConfigurability: false,
    };
  },
  computed: {
    selectedExtension() {
      return this.extensions[this.selectedIndex] || null;
    },
  },
  async mounted() {
    await this.fetchExtensions();
  },
  methods: {
    async fetchExtensions() {
      try {
        this.loading = true;
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/notification.publisher/extensions`,
        );
        this.extensions = response.data.extensions || [];
        if (this.extensions.length > 0) {
          await this.checkPublisherConfigurability();
        }
      } catch (error) {
        console.error('Failed to fetch notification publishers:', error);
        this.loadError = `Failed to load notification publishers: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    async selectExtension(index) {
      this.selectedIndex = index;
      this.isConfigurable = null;
      await this.checkPublisherConfigurability();
    },
    async checkPublisherConfigurability() {
      if (!this.selectedExtension) {
        this.isConfigurable = false;
        return;
      }
      try {
        this.checkingConfigurability = true;
        const response = await this.axios.get(
          `${this.$api.BASE_URL}/api/v2/extension-points/notification.publisher/extensions/${this.selectedExtension.name}/config-schema`,
          {
            validateStatus: (status) => status === 200 || status === 204,
          },
        );
        this.isConfigurable = response.status === 200;
      } catch (error) {
        console.error('Failed to check publisher configurability:', error);
        this.isConfigurable = false;
      } finally {
        this.checkingConfigurability = false;
      }
    },
  },
};
</script>
