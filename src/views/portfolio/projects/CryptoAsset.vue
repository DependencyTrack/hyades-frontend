<template>
  <div class="animated fadeIn" v-permission="PERMISSIONS.VIEW_PORTFOLIO">
    <b-card :no-body="true" footer-class="px-3 py-2 card-footer-action">
      <b-card-body class="p-3 clearfix">
        <b-row>
          <b-col>
            <i class="fa fa-lock bg-primary p-3 font-2xl mr-3 float-left"></i>
            <div class="h5 mb-0 mt-2">{{ cryptoAssetLabel }}</div>
          </b-col>
        </b-row>
      </b-card-body>
      <div id="component-info-footer" slot="footer">
        <b-link class="font-weight-bold font-xs btn-block text-muted" v-b-modal.componentDetailsModal>{{ $t('message.view_details') }} <i class="fa fa-angle-right float-right font-lg"></i></b-link>
      </div>
    </b-card>
    <b-tabs class="body-bg-color" style="border-left: 0; border-right:0; border-top:0 ">
      <b-tab class="body-bg-color" style="border-left: 0; border-right:0; border-top:0; padding: 0;" active>
        <template v-slot:title><i class="fa fa-line-chart"></i> {{ $t('message.overview') }}</template>
        <crypto-asset-overview :key="this.uuid" :uuid="this.uuid" :cryptoAsset="this.cryptoAsset"/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import EventBus from "@/shared/eventbus";
import permissionsMixin from "@/mixins/permissionsMixin";

export default {
  mixins: [permissionsMixin],
  name: "CryptoAsset",
  title: '',
  computed: {
    projectLabel () {
      if (this.cryptoAsset.hasOwnProperty("project")) {
        if (this.cryptoAsset.project.name && this.cryptoAsset.project.version) {
          return this.cryptoAsset.project.name + ' ▸ ' + this.cryptoAsset.project.version;
        } else {
          return this.cryptoAsset.project.name;
        }
      }
    },
    cryptoAssetLabel () {
      if (this.cryptoAsset.name && this.cryptoAsset.version) {
        return this.cryptoAsset.name + ' ▸ ' + this.cryptoAsset.version;
      } else {
        return this.cryptoAsset.name;
      }
    }
  },

  data() {
    return {
      cryptoAsset: {},
      uuid: null,
    }
  },
  beforeMount() {
    this.uuid = this.$route.params.uuid;
  },
  mounted() {
    let cryptoAssetUrl = `${this.$api.BASE_URL}/${this.$api.URL_CRYPTO_ASSET}/${this.uuid}`;
    this.axios.get(cryptoAssetUrl).then((response) => {
      this.cryptoAsset = response.data;
      EventBus.$emit('addCrumb', this.cryptoAssetLabel, 'Project', this.cryptoAsset.project.uuid, this.projectLabel);
      this.$title = this.cryptoAssetLabel;
    });

  },
  destroyed() {
    EventBus.$emit('crumble');
  }

}

</script>

<style scoped>

</style>
