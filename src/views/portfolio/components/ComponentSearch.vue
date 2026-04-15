<template>
  <div class="componentSearch animated fadeIn" v-permission="'VIEW_PORTFOLIO'">
    <portfolio-widget-row :fetch="true" />
    <div id="componentSearchToolbar">
      <b-row>
        <b-col md="4" lg="4">
          <b-input-group-form-select
            id="input-subject"
            required="true"
            v-model="subject"
            :options="subjects"
          />
        </b-col>
        <b-col md="7" lg="7">
          <b-input-group-form-input
            v-if="subject !== 'COORDINATES' && subject !== 'HASH'"
            id="input-value"
            required="true"
            type="text"
            v-model="value"
            lazy="true"
            v-on:keyup.enter="performSearch"
          />
          <b-input-group v-else-if="subject === 'HASH'">
            <b-form-select
              v-model="hashType"
              :options="hashTypes"
              class="mr-2"
            >
              <b-form-select-option :value="null" disabled>Select hash type</b-form-select-option>
            </b-form-select>
            <b-form-input
              id="input-value-hash"
              placeholder="Enter hash value"
              type="text"
              v-model="value"
              v-on:keyup.enter="performSearch"
            ></b-form-input>
          </b-input-group>
          <b-input-group v-else-if="subject === 'COORDINATES'">
            <b-form-input
              id="input-value-coordinates-group"
              :placeholder="$t('message.group')"
              type="text"
              v-model="coordinatesGroup"
              v-on:keyup.enter="performSearch"
            ></b-form-input>
            <b-form-input
              id="input-value-coordinates-name"
              :placeholder="$t('message.name')"
              type="text"
              v-model="coordinatesName"
              v-on:keyup.enter="performSearch"
            ></b-form-input>
            <b-form-input
              id="input-value-coordinates-version"
              :placeholder="$t('message.version')"
              type="text"
              v-model="coordinatesVersion"
              v-on:keyup.enter="performSearch"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col md="1" lg="1">
          <b-button
            variant="outline-primary"
            :disabled="isSearchDisabled"
            v-on:click="performSearch"
            >{{ $t('message.search') }}</b-button
          >
        </b-col>
      </b-row>
    </div>
    <token-paginated-table
      ref="table"
      :base-url="tableDataBaseUrl"
      :columns="columns"
      :options="tableOptions"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import common from '../../../shared/common';
import { Switch as cSwitch } from '@coreui/vue';
import PortfolioWidgetRow from '../../dashboard/PortfolioWidgetRow';
import permissionsMixin from '../../../mixins/permissionsMixin';
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import xssFilters from 'xss-filters';
import SeverityProgressBar from '@/views/components/SeverityProgressBar';
import TokenPaginatedTable from '@/views/components/TokenPaginatedTable.vue';
import { loadUserPreferencesForBootstrapTable } from '@/shared/utils';

export default {
  mixins: [permissionsMixin],
  components: {
    cSwitch,
    PortfolioWidgetRow,
    BInputGroupFormSelect,
    BInputGroupFormInput,
    TokenPaginatedTable,
  },
  beforeCreate() {
    this.subject =
      localStorage && localStorage.getItem('ComponentSearchSubject') !== null
        ? localStorage.getItem('ComponentSearchSubject')
        : 'COORDINATES';
  },
  beforeMount() {
    if (this.$route.hash) {
      let pattern =
        /#\/search\/(COORDINATES)\/group=([^\/)]*)\/name=([^\/]*)\/version=([^\/]*)/gi;
      let matches = pattern.exec(this.$route.hash);
      if (matches) {
        this.subject = matches[1].toUpperCase();
        this.coordinatesGroup = decodeURIComponent(matches[2]);
        this.coordinatesName = decodeURIComponent(matches[3]);
        this.coordinatesVersion = decodeURIComponent(matches[4]);
      } else {
        pattern = /#\/search\/(?!COORDINATES)([^\/]*)\/(.*)/gi;
        matches = pattern.exec(this.$route.hash);
        if (
          matches &&
          this.subjects.some(
            (subject) => subject.value === matches[1].toUpperCase(),
          )
        ) {
          this.subject = matches[1].toUpperCase();
          this.value = decodeURIComponent(matches[2]);
        }
      }
      this.changeSearchUrl = false;
      this.$nextTick(() => {
        if (!this.isSearchDisabled) {
          this.performSearch();
        }
      });
    }
  },
  watch: {
    baseUrl(newVal) {
      if (!newVal) return;
      this.loadPage(newVal);
    },
    subject() {
      if (localStorage) {
        localStorage.setItem('ComponentSearchSubject', this.subject);
        // Reset ALL inputs when subject changes.
        this.value = null;
        this.hashType = null;
        this.coordinatesGroup = null;
        this.coordinatesName = null;
        this.coordinatesVersion = null;
      }
    },
  },
  mounted() {
    if (this.baseUrl) {
      this.loadPage(this.baseUrl);
    }
  },
  methods: {
    createQueryParams() {
      let params = {};

      if (this.subject === 'COORDINATES') {
        if (this.coordinatesGroup)
          params.group = common.trimToNull(this.coordinatesGroup);
        if (this.coordinatesName)
          params.name = common.trimToNull(this.coordinatesName);
        if (this.coordinatesVersion)
          params.version = common.trimToNull(this.coordinatesVersion);
      } else if (this.subject === 'PACKAGE_URL') {
        let v = common.trimToNull(this.value);
        if (v) params.purl = v;
      } else if (this.subject === 'CPE') {
        let v = common.trimToNull(this.value);
        if (v) params.cpe = v;
      } else if (this.subject === 'SWID_TAGID') {
        let v = common.trimToNull(this.value);
        if (v) params.swid_tag_id = v;
      } else if (this.subject === 'HASH') {
        let v = common.trimToNull(this.value);
        if (v) {
          params.hash = v;
          if (this.hashType) {
            params.hash_type = this.hashType;
          }
        }
      }

      return params;
    },
    performSearch: function () {
      if (this.isSearchDisabled) {
        return;
      }
      this.appliedFilters = this.createQueryParams();
    },
  },
  computed: {
    isSearchDisabled() {
      if (this.subject === 'COORDINATES') {
        return !(
          this.coordinatesGroup ||
          this.coordinatesName ||
          this.coordinatesVersion
        );
      }

      if (this.subject === 'HASH') {
        return !(this.value && this.hashType);
      }

      return !this.value;
    },
    tableDataBaseUrl() {
      if (!this.appliedFilters || Object.keys(this.appliedFilters).length === 0) {
        return null;
      }
      const url = `${this.$api.BASE_URL}/api/v2/components`;
      const queryParams = { ...this.appliedFilters };
      const sortBy = this.sortBy || 'name';
      const sortDirection = this.sortDirection || 'asc';
      queryParams.sort_by = sortBy;
      queryParams.sort_direction = sortDirection.toUpperCase();
      return common.setQueryParams(url, queryParams);
    },
  },
  data() {
    return {
      subject: this.subject,
      value: null,
      coordinatesGroup: null,
      coordinatesName: null,
      coordinatesVersion: null,
      sortBy: null,
      sortDirection: null,
      appliedFilters: null,
      hashType: null,
      hashTypes: [
        { value: 'MD5', text: this.$t('hashes.md5') },
        { value: 'SHA1', text: this.$t('hashes.sha_1') },
        { value: 'SHA_256', text: this.$t('hashes.sha_256') },
        { value: 'SHA_384', text: this.$t('hashes.sha_384') },
        { value: 'SHA_512', text: this.$t('hashes.sha_512') },
        { value: 'SHA3_256', text: this.$t('hashes.sha3_256') },
        { value: 'SHA3_384', text: this.$t('hashes.sha3_384') },
        { value: 'SHA3_512', text: this.$t('hashes.sha3_512') },
        { value: 'BLAKE2b_256', text: this.$t('hashes.blake_256') },
        { value: 'BLAKE2b_384', text: this.$t('hashes.blake_384') },
        { value: 'BLAKE2b_512', text: this.$t('hashes.blake_512') },
        { value: 'BLAKE3', text: this.$t('hashes.blake3') },
      ],
      subjects: [
        { value: 'COORDINATES', text: this.$t('message.coordinates') },
        { value: 'PACKAGE_URL', text: this.$t('message.package_url') },
        { value: 'CPE', text: this.$t('message.cpe_full') },
        { value: 'SWID_TAGID', text: this.$t('message.swid_tagid') },
        { value: 'HASH', text: this.$t('message.hashes_short_desc') },
      ],
      changeSearchUrl: false,
      columns: [
        {
          title: this.$t('message.component'),
          field: 'name',
          sortable: true,
          formatter(value, row, index) {
            let url = xssFilters.uriInUnQuotedAttr('../components/' + row.uuid);
            let dependencyGraphUrl = xssFilters.uriInUnQuotedAttr(
              '../../../projects/' +
                row.project.uuid +
                '/dependencyGraph/' +
                row.uuid,
            );
            return (
              `<a href="${dependencyGraphUrl}>"<i class="fa fa-sitemap" aria-hidden="true" style="float:right; padding-top: 4px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Show in dependency graph"></i></a> ` +
              `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`
            );
          },
        },
        {
          title: this.$t('message.version'),
          field: 'version',
          sortable: true,
          visible: true,
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
          title: this.$t('message.package_url'),
          field: 'purl',
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
          title: this.$t('message.cpe'),
          field: 'cpe',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.swid_tagid'),
          field: 'swid_tag_id',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.project_name'),
          field: 'project.name',
          sortable: false,
          formatter(value, row, index) {
            let url = xssFilters.uriInUnQuotedAttr(
              '../projects/' + row.project.uuid,
            );
            let name = common.concatenateComponentName(
              null,
              row.project.name,
              row.project.version,
            );
            return `<a href="${url}">${xssFilters.inHTMLData(name)}</a>`;
          },
        },
        {
          title: this.$t('message.license_name'),
          field: 'resolved_license.license_id',
          sortable: false,
          visible: false,
          formatter(resolved_license, row, index) {
            if (typeof resolved_license === 'undefined') {
              return '-'; // No resolvedLicense info available
            }

            let url = xssFilters.uriInUnQuotedAttr(
              '../licenses/' +
                encodeURIComponent(row.resolved_license.license_id),
            );
            return `<a href="${url}">${xssFilters.inHTMLData(row.resolved_license.name)}</a>`;
          },
        },
        {
          title: this.$t('message.risk_score'),
          field: 'last_inherited_risk_score',
          sortable: true,
          visible: false,
          class: 'tight',
        },
        {
          title: this.$t('message.vulnerabilities'),
          field: 'metrics',
          sortable: false,
          visible: false,
          formatter: function (metrics, row, index) {
            if (typeof metrics === 'undefined') {
              return '-'; // No vulnerability info available
            }

            // Programmatically instantiate SeverityProgressBar Vue component
            let ComponentClass = Vue.extend(SeverityProgressBar);
            let progressBar = new ComponentClass({
              propsData: {
                vulnerabilities: metrics.vulnerabilities,
                critical: metrics.critical,
                high: metrics.high,
                medium: metrics.medium,
                low: metrics.low,
                unassigned: metrics.unassigned,
                $t: this.$t.bind(this),
              },
            });
            progressBar.$mount();
            return progressBar.$el.outerHTML;
          }.bind(this),
        },
      ],
      tableOptions: {
        showColumns: true,
        showRefresh: true,
        silentSort: false,
        toolbar: '#componentSearchToolbar',
        icons: {
          refresh: 'fa-refresh',
        },
        sortName: 'name',
        sortOrder: 'asc',
        customSort: () => {},
        onSort: (name, order) => {
          this.sortBy = name;
          this.sortDirection = order;
        },
      },
    };
  },
};
</script>

<style>
.componentSearch .bootstrap-table .fixed-table-toolbar .bs-bars {
  width: 80%;
}
</style>
