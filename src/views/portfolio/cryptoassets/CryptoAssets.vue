<template>
  <div class="animated fadeIn" v-permission="'VIEW_PORTFOLIO'">
    <crypto-asset-widget-row ref="cryptoAssetWidgetRow" />

    <b-card>
      <div id="cryptoAssetSearchToolbar">
        <b-row>
          <b-col md="5" lg="5">
            <b-input-group-form-select
              id="input-subject"
              required="true"
              v-model="subject"
              :options="subjects"
            />
          </b-col>
          <b-col md="6" lg="6">
            <b-input-group-form-input
              v-if="subject !== 'ASSET TYPE'"
              id="input-value"
              required="true"
              type="text"
              v-model="value"
              lazy="true"
              v-on:keyup.enter="performSearch"
            />
            <b-form-select
              v-else-if="subject === 'ASSET TYPE'"
              v-model="value"
              :required="true"
              :options="assetTypeOptions"
              id="input-aead-value"
              v-on:keyup.enter="performSearch"
            />
          </b-col>
          <b-col md="1" lg="1">
            <b-button variant="outline-primary" v-on:click="performSearch">{{
              $t('message.search')
            }}</b-button>
          </b-col>
        </b-row>
      </div>
      <bootstrap-table
        ref="table"
        :columns="columns"
        :data="data"
        :options="options"
      >
      </bootstrap-table>
    </b-card>
  </div>
</template>

<script>
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import common from '@/shared/common';
import xssFilters from 'xss-filters';
import CryptoAssetWidgetRow from '@/views/dashboard/CryptoAssetWidgetRow';
import permissionsMixin from '@/mixins/permissionsMixin';

export default {
  mixins: [permissionsMixin],
  components: {
    CryptoAssetWidgetRow,
    BInputGroupFormSelect,
    BInputGroupFormInput,
  },
  name: 'CryptoAssets',
  methods: {
    createQueryParams: function () {
      if (this.subject === 'ASSET TYPE') {
        let v = common.trimToNull(this.value);
        return v != null ? 'assetType=' + encodeURIComponent(v) : '';
      }
    },
    performSearch: function () {
      let queryParams = this.createQueryParams();
      this.options.url = `${this.$api.BASE_URL}/${this.$api.URL_CRYPTO_ASSET}/identity?${queryParams}`;
      this.$refs.table.refresh({ silent: true });
    },
    extractStats(metrics) {
      if (!metrics || metrics.length === 0) {
        return;
      }
      let metric = metrics[metrics.length - 1]; //Use the most recent metric
      this.numberOfCryptoAssets = common.valueWithDefault(
        metric.numberOfCryptographicAssets,
        '0',
      );
      this.notEnoughInformationToStateQSComponents = common.valueWithDefault(
        metric.notEnoughInformationToStateQSComponents,
        '0',
      );
      this.numberOfQuantumSafeComponents = common.valueWithDefault(
        metric.quantumSafeComponents,
        '0',
      );
      this.consideredComponents =
        this.notEnoughInformationToStateQSComponents +
        this.numberOfQuantumSafeComponents;
      this.quantumSafeProgressPercent = common.calcProgressPercent(
        this.consideredComponents,
        this.numberOfQuantumSafeComponents,
      );
    },
  },
  data() {
    return {
      quantumSafeProgressPercent: 0,
      numberOfCryptoAssets: 0,
      numberOfQuantumSafeComponents: 0,
      notEnoughInformationToStateQSComponents: 0,
      consideredComponents: 0,

      subject: 'ASSET TYPE',
      value: null,
      coordinatesGroup: null,
      coordinatesName: null,
      coordinatesVersion: null,
      subjects: [
        { value: 'ASSET TYPE', text: this.$t('message.crypto_assetType') },
      ],
      assetTypeOptions: [
        { value: null, text: "ALL"},
        { value: 'ALGORITHM', text: 'Algorithm' },
        { value: 'CERTIFICATE', text: 'Certificate' },
        { value: 'RELATED_CRYPTO_MATERIAL', text: 'Related Crypto Material' },
        { value: 'PROTOCOL', text: 'Protocol' },
      ],
      columns: [
        {
          field: 'state',
          checkbox: true,
          align: 'center',
        },
        {
          title: this.$t('message.crypto_assets'),
          field: 'name',
          sortable: true,
          formatter(value, row, index) {
            let url = xssFilters.uriInUnQuotedAttr('../components/' + row.uuid);
            return `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`;
          },
        },
        {
          title: this.$t('message.version'),
          field: 'version',
          sortable: true,
          formatter(value, row) {
            if (
              Object.prototype.hasOwnProperty.call(row, 'repositoryMeta') &&
              Object.prototype.hasOwnProperty.call(
                row.repositoryMeta,
                'latestVersion',
              )
            ) {
              row.latestVersion = row.repositoryMeta.latestVersion;
              if (row.repositoryMeta.latestVersion !== row.version) {
                return (
                  '<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="Risk: Outdated component. Current version is: ' +
                  xssFilters.inHTMLData(row.repositoryMeta.latestVersion) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> ' +
                  xssFilters.inHTMLData(row.version)
                );
              } else {
                return (
                  '<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="Component version is the latest available from the configured repositories"><i class="fa fa-exclamation-triangle status-passed" aria-hidden="true"></i></span> ' +
                  xssFilters.inHTMLData(row.version)
                );
              }
            } else {
              return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
            }
          },
        },
        {
          title: this.$t('message.latest_version'),
          field: 'latestVersion',
          sortable: false,
          visible: false,
          formatter(value) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.crypto_assetType'),
          field: 'cryptoAssetProperties.assetType',
          sortable: true,
          formatter(value) {
            if (typeof value === 'undefined') {
              return '-'; // No primitive info available
            }
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.crypto_oid'),
          field: 'cryptoAssetProperties.oid',
          sortable: true,
          formatter(value) {
            if (typeof value === 'undefined') {
              return '-'; // No primitive info available
            }
            return xssFilters.inHTMLData(value);
          },
        },
        {
          title: this.$t('message.crypto_algo_primitive'),
          field: 'cryptoAssetProperties.algorithmProperties.primitive',
          sortable: true,
          formatter(value) {
            if (typeof value === 'undefined') {
              return '-'; // No primitive info available
            }
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.crypto_algo_nistQSL'),
          field:
            'cryptoAssetProperties.algorithmProperties.nistQuantumSecurityLevel',
          sortable: true,
          class: 'tight',
        },
        {
          title: this.$t('message.crypto_algo_classicalSL'),
          field:
            'cryptoAssetProperties.algorithmProperties.classicalSecurityLevel',
          sortable: true,
          class: 'tight',
        },
      ],
      data: [],
      options: {
        onPostBody: this.initializeTooltips,
        search: false,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        toolbar: '#cryptoAssetSearchToolbar',
        sidePagination: 'server',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        icons: {
          refresh: 'fa-refresh',
        },
        //toolbar: '#componentSearchToolbar',
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_CRYPTO_ASSET}/identity`,
      },
    };
  },
  mounted() {
    if (this.isPermitted(this.PERMISSIONS.VIEW_PORTFOLIO)) {
      const daysBack = 90;
      let url = `${this.$api.BASE_URL}/${this.$api.URL_METRICS}/cryptography/${daysBack}/days`;
      this.axios.get(url).then((response) => {
        this.$refs.cryptoAssetWidgetRow.render(response.data);
        this.extractStats(response.data);
      });
    }
  },
};
</script>

<style scoped></style>
