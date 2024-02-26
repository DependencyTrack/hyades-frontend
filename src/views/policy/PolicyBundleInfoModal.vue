<template>
  <b-modal id="policyBundleInfoModal" size="lg" hide-header-close no-stacking :title="$t('message.policy_bundle_info')">
    <b-tabs class="body-bg-color" style="border:0;padding:0">
      <b-tab class="body-bg-color" style="border:0;padding:0" active>
        <template v-slot:title><i class="fa fa-edit"></i> {{ $t('message.general') }}</template>
        <b-card>
          <b-input-group-form-input id="bundle-url" input-group-size="mb-3" type="text" v-model="bundleInfo.url"
                                    lazy="true" feedback="false" autofocus="true"
                                    :label="$t('message.policy_bundle_url')" disabled="true" />
          <b-input-group-form-input id="bundle-hash" input-group-size="mb-3" type="text" v-model="bundleInfo.hash"
                                    lazy="true" feedback="false" autofocus="false"
                                    :label="$t('message.policy_bundle_hash')" disabled="true" />
          <b-input-group-form-input id="bundle-created" input-group-size="mb-3" type="text" :value="bundleCreated"
                                    lazy="true" feedback="false" autofocus="false"
                                    :label="$t('message.created')" disabled="true" />
          <b-input-group-form-input id="bundle-last-sync" :value="bundleLastSynced" feedback="false"
                                    :label="$t('message.policy_bundle_sync_timestamp')" disabled="true" />
        </b-card>
      </b-tab>
    </b-tabs>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="md" variant="secondary" @click="cancel()">{{ $t('message.close') }}</b-button>
    </template>
  </b-modal>
</template>

<script>
  import BInputGroupFormInput from "../../forms/BInputGroupFormInput";
  import BInputGroupFormSelect from "../../forms/BInputGroupFormSelect";
  import { Switch as cSwitch } from '@coreui/vue';
  import permissionsMixin from "../../mixins/permissionsMixin";
  import Multiselect from "vue-multiselect"
  import VueTagsInput from '@johmun/vue-tags-input';
  import common from "../../shared/common";

  export default {
    name: "PolicyBundleInfoModal",
    mixins: [permissionsMixin],
    components: {
      BInputGroupFormInput,
      VueTagsInput,
      BInputGroupFormSelect,
      cSwitch,
      Multiselect
    },
    props: {
      bundleInfo: Object,
    },
    data() {
      return {
        syncToken: {}
      }
    },
    computed: {
      bundleCreated: {
        get() {
          return (typeof this.bundleInfo.created !== 'undefined' && this.bundleInfo.created != null) ? common.formatTimestamp(this.bundleInfo.created) : "-";
        }
      },
      bundleLastSynced: {
        get() {
          return typeof (this.bundleInfo.lastSuccessfulSync != null && this.bundleInfo.lastSuccessfulSync === "number")
          ? common.formatTimestamp(this.bundleInfo.lastSuccessfulSync, true)
          : "-";
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/scss/vendors/vue-tags-input/vue-tags-input";
</style>

<style scoped>
.tab-content .tab-pane{
  padding: 0 !important;
}
.tab-content {
  border: 0 !important;
}
.card {
  border:0;
  padding:0;
  margin-bottom:0;
}
</style>
