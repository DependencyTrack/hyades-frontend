<template>
  <div>
    <div id="componentsToolbar">
      <div class="btn-spaced-group" role="form">
        <b-button
          size="md"
          variant="outline-primary"
          v-b-modal.projectAddComponentModal
          v-permission:or="[
            PERMISSIONS.PORTFOLIO_MANAGEMENT,
            PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
          ]"
        >
          <span class="fa fa-plus"></span> {{ $t('message.add_component') }}
        </b-button>
        <b-button
          size="md"
          variant="outline-primary"
          @click="removeDependencies"
          v-permission:or="[
            PERMISSIONS.PORTFOLIO_MANAGEMENT,
            PERMISSIONS.PORTFOLIO_MANAGEMENT_DELETE,
          ]"
        >
          <span class="fa fa-minus"></span> {{ $t('message.remove_component') }}
        </b-button>
        <b-button
          id="upload-button"
          size="md"
          variant="outline-primary"
          v-b-modal.projectUploadBomModal
          v-permission="PERMISSIONS.BOM_UPLOAD"
        >
          <span class="fa fa-upload"></span> {{ $t('message.upload_bom') }}
        </b-button>
        <b-tooltip target="upload-button" triggers="hover focus">{{
          $t('message.upload_bom_tooltip')
        }}</b-tooltip>
        <b-dropdown
          variant="outline-primary"
          v-permission="PERMISSIONS.VIEW_PORTFOLIO"
        >
          <template #button-content>
            <span class="fa fa-download"></span>
            {{ $t('message.download_bom') }}
          </template>
          <b-dropdown-item @click="downloadBom('inventory')" href="#">{{
            $t('message.inventory')
          }}</b-dropdown-item>
          <b-dropdown-item
            @click="downloadBom('withVulnerabilities')"
            v-permission:or="[
              PERMISSIONS.VIEW_VULNERABILITY,
              PERMISSIONS.VULNERABILITY_ANALYSIS,
              PERMISSIONS.VULNERABILITY_ANALYSIS_READ,
            ]"
            href="#"
            >{{ $t('message.inventory_with_vulnerabilities') }}</b-dropdown-item
          >
        </b-dropdown>
        <b-dropdown
          variant="outline-primary"
          v-permission="PERMISSIONS.VIEW_PORTFOLIO"
        >
          <template #button-content>
            <span class="fa fa-download"></span>
            {{ $t('message.download_component') }}
          </template>
          <b-dropdown-item @click="downloadTable('csv')" href="#">{{
            $t('message.csv_filetype')
          }}</b-dropdown-item>
        </b-dropdown>
        <span
          id="switch-container-outdated"
          style="margin-left: 1rem; margin-right: 0.5rem"
          class="keep-together"
        >
          <c-switch
            id="only-outdated"
            :disabled="!project"
            color="primary"
            v-model="onlyOutdated"
            label
            v-bind="labelIcon"
          />
          <span class="text-muted">{{
            $t('message.outdated_only')
          }}</span></span
        >
        <b-tooltip target="switch-container-outdated" triggers="hover focus">{{
          $t('message.only_outdated_tooltip')
        }}</b-tooltip>
        <span
          id="switch-container-direct"
          style="margin-left: 1rem; margin-right: 0.5rem"
          class="keep-together"
        >
          <c-switch
            id="only-direct"
            :disabled="!project || !this.project.directDependencies"
            color="primary"
            v-model="onlyDirect"
            label
            v-bind="labelIcon"
          />
          <span class="text-muted">{{ $t('message.direct_only') }}</span></span
        >
        <b-tooltip target="switch-container-direct" triggers="hover focus">{{
          $t('message.only_direct_tooltip')
        }}</b-tooltip>
      </div>
    </div>
    <token-paginated-table
      ref="table"
      :base-url="tableDataUrl"
      :columns="columns"
      :options="options"
      @on-load-success="tableLoaded"
      :response-data-field="'components'"
    />
    <project-upload-bom-modal :uuid="this.uuid" />
    <project-add-component-modal
      :uuid="this.uuid"
      v-on:refreshTable="refreshTable"
    />
  </div>
</template>

<script>
import {
  compareVersions,
  loadUserPreferencesForBootstrapTable,
} from '@/shared/utils';
import ComponentOccurrenceListModal from '@/views/portfolio/projects/ComponentOccurrenceListModal.vue';
import ProjectAddComponentModal from '@/views/portfolio/projects/ProjectAddComponentModal';
import ProjectUploadBomModal from '@/views/portfolio/projects/ProjectUploadBomModal';
import { Switch as cSwitch } from '@coreui/vue';
import $ from 'jquery';
import Vue from 'vue';
import xssFilters from 'xss-filters';
import permissionsMixin from '../../../mixins/permissionsMixin';
import common from '../../../shared/common';
import SeverityProgressBar from '../../components/SeverityProgressBar';
import { get } from 'lodash-es';
import i18n from '@/i18n';
import bootstrapTableMixin from '@/mixins/bootstrapTableMixin';
import TokenPaginatedTable from '@/views/components/TokenPaginatedTable.vue';

export default {
  components: {
    cSwitch,
    ProjectUploadBomModal,
    ProjectAddComponentModal,
    TokenPaginatedTable,
  },
  mixins: [bootstrapTableMixin, permissionsMixin],
  comments: {
    ProjectAddComponentModal,
    ProjectUploadBomModal,
  },
  props: {
    uuid: String,
    project: Object,
  },
  data() {
    return {
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
      onlyOutdated: false,
      onlyDirect: false,
      columns: [
        {
          field: 'state',
          checkbox: true,
          align: 'center',
        },
        {
          title: this.$t('message.component'),
          field: 'name',
          sortable: true,
          formatter: (value, row, index) => {
            let url = xssFilters.uriInUnQuotedAttr(
              '../../../components/' + row.uuid,
            );
            let dependencyGraphUrl = xssFilters.uriInUnQuotedAttr(
              '../../../projects/' + this.uuid + '/dependencyGraph/' + row.uuid,
            );
            return (
              `<a href="${dependencyGraphUrl}"<i class="fa fa-sitemap" aria-hidden="true" style="float:right; padding-top: 4px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Show in dependency graph"></i></a> ` +
              `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`
            );
          },
        },
        {
          title: this.$t('message.version'),
          field: 'version',
          sortable: true,
          formatter: (value, row, index) => {
            if (row.repositoryMeta && row.repositoryMeta.latestVersion) {
              row.latestVersion = row.repositoryMeta.latestVersion;
              if (
                compareVersions(row.repositoryMeta.latestVersion, row.version) >
                0
              ) {
                return (
                  '<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="Risk: Outdated component. Current version is: ' +
                  xssFilters.inHTMLData(row.repositoryMeta.latestVersion) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> ' +
                  xssFilters.inHTMLData(row.version)
                );
              } else if (
                compareVersions(row.repositoryMeta.latestVersion, row.version) <
                0
              ) {
                // should be unstable then
                return (
                  '<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="Risk: Unstable component. Current stable version is: ' +
                  xssFilters.inHTMLData(row.repositoryMeta.latestVersion) +
                  '"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span> ' +
                  xssFilters.inHTMLData(row.version)
                );
              } else {
                return (
                  '<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="Component version is the latest available from the configured repositories"><i class="fa fa-check status-passed" aria-hidden="true"></i></span> ' +
                  xssFilters.inHTMLData(row.version)
                );
              }
            } else {
              return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
            }
          },
        },
        {
          title: this.$t('message.published'),
          field: 'published',
          sortable: true,
          formatter(value, row, index) {
            if (value != null) {
              return xssFilters.inHTMLData(common.formatTimestamp(value));
            }
          },
        },
        {
          title: this.$t('message.latest_version'),
          field: 'latest_version',
          sortable: false,
          visible: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.group'),
          field: 'group',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.internal'),
          field: 'internal',
          sortable: false,
          align: 'center',
          class: 'tight',
          formatter: function (value, row, index) {
            return value === true ? '<i class="fa fa-check-square-o" />' : '';
          },
        },
        {
          title: this.$t('message.integrity'),
          field: 'integrity_check_status',
          sortable: true,
          visible: false,
          formatter: (value, row, index) => {
            if (row.integrity_check_status != null) {
              var lastFetchMessage = 'Last fetch unknown.';
              if (
                typeof row.last_fetched !==
                  'undefined' &&
                row.last_fetched != null
              ) {
                lastFetchMessage =
                  'Last fetched on ' +
                  common.formatTimestamp(
                    row.last_fetched,
                  ) +
                  '.';
              }

              if (
                typeof row.integrity_repo_url != null
              ) {
                lastFetchMessage +=
                  ' Source:  ' + row.integrity_repo_url;
              }
              if (
                row.integrity_check_status ==
                'HASH_MATCH_PASSED'
              ) {
                return (
                  '<span style="float:center" data-toggle="tooltip" data-placement="bottom" title="Component & repository hashes match. ' +
                  xssFilters.inHTMLData(lastFetchMessage) +
                  '"><i class="fa fa-check status-passed" aria-hidden="true"></i></span> '
                );
              } else if (
                row.integrity_check_status ===
                'HASH_MATCH_FAILED'
              ) {
                return (
                  '<span style="float:center" data-toggle="tooltip" data-placement="bottom" title="Component & repository hashes do not match. ' +
                  xssFilters.inHTMLData(lastFetchMessage) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> '
                );
              } else if (
                row.integrity_check_status ===
                'COMPONENT_MISSING_HASH'
              ) {
                return (
                  '<span style="float:center" data-toggle="tooltip" data-placement="bottom" title="Component hashes are missing. ' +
                  xssFilters.inHTMLData(lastFetchMessage) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> '
                );
              } else if (
                row.integrity_check_status ===
                'HASH_MATCH_UNKNOWN'
              ) {
                return (
                  '<span style="float:center" data-toggle="tooltip" data-placement="bottom" title="Repository hashes are missing. ' +
                  xssFilters.inHTMLData(lastFetchMessage) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> '
                );
              } else if (
                row.integrity_check_status ===
                'COMPONENT_MISSING_HASH_AND_MATCH_UNKNOWN'
              ) {
                return (
                  '<span style="float:center" data-toggle="tooltip" data-placement="bottom" title="Component & repository hashes are missing. ' +
                  xssFilters.inHTMLData(lastFetchMessage) +
                  '"><i class="fa fa-exclamation-triangle status-warning" aria-hidden="true"></i></span> '
                );
              }
            }
          },
        },
        {
          title: this.$t('message.license'),
          field: 'license',
          sortable: false,
          formatter(value, row, index) {
            if (Object.prototype.hasOwnProperty.call(row, 'resolved_license')) {
              let licenseurl =
                '../../../licenses/' + row.resolved_license.license_id;
              return (
                '<a href="' +
                licenseurl +
                '">' +
                xssFilters.inHTMLData(row.resolved_license.license_id) +
                '</a>'
              );
            } else if (value) {
              return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
            } else if (row.license_expression) {
              return xssFilters.inHTMLData(
                common.valueWithDefault(row.license_expression, ''),
              );
            } else {
              return '';
            }
          },
        },
        {
          title: this.$t('message.occurrences'),
          field: 'occurrence_count',
          sortable: true,
          class: 'tight',
          visible: false,
          formatter: (value, row, index) => {
            if (value) {
              return this.vueFormatter({
                i18n,
                components: {
                  ComponentOccurrenceListModal,
                },
                template: `
                  <div>
                    <b-link v-b-modal="\`componentOccurrenceListModal-${index}\`">{{ value }}</b-link>
                    <component-occurrence-list-modal :component-uuid="componentUuid" :component-name="componentName" :index="index"/>
                  </div>`,
                data() {
                  return {
                    index: index,
                    componentUuid: row.uuid,
                    componentName: row.name,
                    value: value,
                  };
                },
              });
            }

            return `<span style="float:right" data-toggle="tooltip" data-placement="bottom" title="${this.$t('message.occurrences_none_hint')}"><i class="fa fa-question-circle" aria-hidden="true"></i></span> ${value}`;
          },
        },
        {
          title: this.$t('message.risk_score'),
          field: 'last_inherited_risk_score',
          sortable: true,
          class: 'tight',
        },
        {
          title: this.$t('message.vulnerabilities'),
          field: 'vulnerabilities',
          sortable: false,
          formatter: function (value, row, index) {

            // Programmatically instantiate SeverityProgressBar Vue component
            let ComponentClass = Vue.extend(SeverityProgressBar);
            let progressBar = new ComponentClass({
              propsData: {
                vulnerabilities: row.vulnerabilities,
                critical: row.critical,
                high: row.high,
                medium: row.medium,
                low: row.low,
                unassigned: row.unassigned,
                $t: this.$t.bind(this),
              },
            });
            progressBar.$mount();
            return progressBar.$el.outerHTML;
          }.bind(this),
        },
      ],
      options: {
        onPostBody: this.initializeTooltips,
        toolbar: '#componentsToolbar',
        sortName:
          localStorage &&
          localStorage.getItem('ProjectComponentsSortName') !== null
            ? localStorage.getItem('ProjectComponentsSortName')
            : undefined,
        sortOrder:
          localStorage &&
          localStorage.getItem('ProjectComponentsSortOrder') !== null
            ? localStorage.getItem('ProjectComponentsSortOrder')
            : undefined,
        onPageChange: (number, size) => {
          if (localStorage) {
            localStorage.setItem('ProjectComponentsPageSize', size.toString());
          }
        },
        onColumnSwitch: (field, checked) => {
          if (localStorage) {
            localStorage.setItem(
              'ProjectComponentsShow' + common.capitalize(field),
              checked.toString(),
            );
          }
        },
        onSort: (name, order) => {
          if (localStorage) {
            localStorage.setItem('ProjectComponentsSortName', name);
            localStorage.setItem('ProjectComponentsSortOrder', order);
          }
        },
      },
    };
  },
  computed: {
    tableDataUrl() {
      const url = `${this.$api.BASE_URL}/api/v2/projects/${this.uuid}/components`;
      const queryParams = {
        onlyOutdated: this.onlyOutdated ?? false,
        onlyDirect: this.onlyDirect ?? false,
      };
      const queryString = Object.entries(queryParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      return `${url}?${queryString}`;
    },
  },
  methods: {
    initializeTooltips: function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    },
    removeDependencies: function () {
      let selections = this.$refs.table.getSelections();
      if (selections.length === 0) return;
      for (let i = 0; i < selections.length; i++) {
        let url = `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}/${selections[i].uuid}`;
        this.axios
          .delete(url)
          .then((response) => {
            this.$refs.table.refresh({ silent: true });
            this.$toastr.s(this.$t('message.component_deleted'));
          })
          .catch((error) => {
            this.$toastr.w(this.$t('condition.unsuccessful_action'));
          });
      }
      this.$refs.table.uncheckAll();
    },
    downloadBom: function (data) {
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
    buildTableFile: function (json, fileType) {
      if (fileType == 'csv') {
        const items = json.data;
        const header = [
          'name',
          'version',
          'group',
          'internal',
          'resolvedLicense.licenseId',
          'lastInheritedRiskScore',
          'metrics.vulnerabilities',
        ]; //Object.keys(items[0])//as long as the structure of the json doesnt change these can be static
        const csv = [
          header.join(','),
          ...items.map((row) =>
            header.map((header) => get(row, header)).join(','),
          ),
        ].join('\r\n');
        const url = window.URL.createObjectURL(new Blob([csv]));
        const link = document.createElement('a');
        link.href = url;
        let filename = 'componentTable.csv';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      }
    },
    downloadTable: async function (fileType) {
      const result = await this.downloadTableJson();
      this.buildTableFile(result, fileType);
    },
    downloadTableJson: async function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}/project/${this.uuid}?limit=1000000&offset=0`;
      try {
        let response = await this.axios.get(url);
        return response;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    tableLoaded: function (data) {
      loadUserPreferencesForBootstrapTable(
        this,
        'ProjectComponents',
        this.$refs.table.columns,
      );
      if (data && Object.prototype.hasOwnProperty.call(data, 'total')) {
        this.$emit('total', data.total);
      } else {
        this.$emit('total', '?');
      }
      this.$refs.table.hideLoading();
      this.vueFormatterInit();
    },
    refreshTable: async function () {
      await this.$refs.table.refreshCurrentPage();
    },
  },
  watch: {
    onlyOutdated() {
      this.$refs.table.showLoading();
      this.refreshTable();
    },
    onlyDirect() {
      this.$refs.table.showLoading();
      this.refreshTable();
    },
  },
};
</script>
