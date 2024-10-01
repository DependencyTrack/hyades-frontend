<template>
  <div>
    <div id="cbomToolbar">
      <div class="form-inline btn-spaced-group" role="form">
        <b-button
          size="md"
          variant="outline-primary"
          v-b-modal.projectAddComponentModal
          v-permission="PERMISSIONS.PORTFOLIO_MANAGEMENT"
        >
          <span class="fa fa-plus"></span> {{ $t('message.add_cryptoAsset') }}
        </b-button>
        <b-button
          size="md"
          variant="outline-primary"
          @click="removeDependencies"
          v-permission="PERMISSIONS.PORTFOLIO_MANAGEMENT"
        >
          <span class="fa fa-minus"></span>
          {{ $t('message.remove_cryptoAsset') }}
        </b-button>
        <b-button
          size="md"
          variant="outline-primary"
          v-b-modal.projectUploadBomModal
          v-permission:or="[
            PERMISSIONS.PORTFOLIO_MANAGEMENT,
            PERMISSIONS.BOM_UPLOAD,
          ]"
        >
          <span class="fa fa-upload"></span> {{ $t('message.upload_cbom') }}
        </b-button>
        <b-dropdown
          variant="outline-primary"
          v-permission="PERMISSIONS.PORTFOLIO_MANAGEMENT"
        >
          <template #button-content>
            <span class="fa fa-download"></span>
            {{ $t('message.download_cbom') }}
          </template>
          <b-dropdown-item @click="downloadCbom('cbom')" href="#">{{
            $t('message.inventory')
          }}</b-dropdown-item>
          <b-dropdown-item
            @click="downloadCbom('cbom_withVulnerabilities')"
            href="#"
            >{{ $t('message.inventory_with_vulnerabilities') }}</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>
    <bootstrap-table
      ref="table"
      :columns="columns"
      :data="data"
      :options="options"
      @on-load-success="tableLoaded"
    >
    </bootstrap-table>
  </div>
</template>

<script>
import $ from 'jquery';
import common from '../../../shared/common';
import xssFilters from 'xss-filters';
import permissionsMixin from '../../../mixins/permissionsMixin';

export default {
  mixins: [permissionsMixin],
  props: {
    uuid: String,
  },
  data() {
    return {
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
            let url = xssFilters.uriInUnQuotedAttr(
              '../../../components/' + row.uuid,
            );
            return `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`;
          },
        },
        {
          title: this.$t('message.version'),
          field: 'version',
          sortable: true,
          formatter(value, row, index) {
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
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.crypto_assetType'),
          field: 'cryptoAssetProperties.assetType',
          sortable: true,
          formatter(value, row, index) {
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
          formatter(value, row, index) {
            if (typeof value === 'undefined') {
              return '-'; // No primitive info available
            }
            return xssFilters.inHTMLData(value);
          },
        },
        {
          title: this.$t('message.crypto_algo_primitive'),
          field: 'cryptoAssetProperties.primitive',
          sortable: true,
          formatter(value, row, index) {
            if (typeof value === 'undefined') {
              return '-'; // No primitive info available
            }
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.crypto_quantumSecurityLevel'),
          field: 'cryptoAssetProperties.quantumSecurityLevel',
          sortable: true,
          class: 'tight',
        },
        {
          title: this.$t('message.crypto_classicalSecurityLevel'),
          field: 'cryptoAssetProperties.classicalSecurityLevel',
          sortable: true,
          class: 'tight',
        },
        {
          title: this.$t('message.crypto_nistQscLevel'),
          field: 'cryptoAssetProperties.nistQscLevel',
          sortable: true,
        },
      ],
      data: [],
      options: {
        onPostBody: this.initializeTooltips,
        search: true,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sidePagination: 'server',
        toolbar: '#cbomToolbar',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/api/v1/crypto/project/${this.uuid}`,
      },
    };
  },
  methods: {
    initializeTooltips: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },
    removeDependencies: function () {
      let selections = this.$refs.table.getSelections();
      if (selections.length === 0) return;
      for (let i = 0; i < selections.length; i++) {
        let url = `${this.$api.BASE_URL}/${this.$api.URL_CRYPTO_ASSET}/${selections[i].uuid}`;
        this.axios
          .delete(url)
          .then((response) => {
            this.$refs.table.refresh({ silent: true });
            this.$toastr.s(this.$t('message.cryptoAsset_deleted'));
          })
          .catch((error) => {
            this.$toastr.w(this.$t('condition.unsuccessful_action'));
          });
      }
      this.$refs.table.uncheckAll();
    },
    downloadCbom: function (data) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_BOM}/cyclonedx/project/${this.uuid}`;
      this.axios
        .request({
          responseType: 'blob',
          url: url,
          method: 'get',
          params: {
            format: 'json',
            variant: data,
            download: 'true',
          },
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          let filename = 'bom.json';
          let disposition = response.headers['content-disposition'];
          if (disposition && disposition.indexOf('attachment') !== -1) {
            let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
        });
    },
    tableLoaded: function (data) {
      if (data && Object.prototype.hasOwnProperty.call(data, 'total')) {
        this.$emit('total', data.total);
      } else {
        this.$emit('total', '?');
      }
    },
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
  },
};
</script>
