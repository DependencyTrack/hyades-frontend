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
            v-if="subject !== 'COORDINATES'"
            id="input-value"
            required="true"
            type="text"
            v-model="value"
            lazy="true"
            v-on:keyup.enter="performSearch"
          />
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
          <b-button variant="outline-primary" v-on:click="performSearch">{{
            $t('message.search')
          }}</b-button>
        </b-col>
      </b-row>
    </div>
    <token-paginated-table
      ref="table"
      :base-url="tableBaseUrl"
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
    }
  },
  watch: {
    subject() {
      if (localStorage) {
        localStorage.setItem('ComponentSearchSubject', this.subject);
      }
    },
  },
  mounted() {
    this.changeSearchUrl = true;
  },
  methods: {
    createQueryParams: function () {
      if (this.subject === 'COORDINATES') {
        let params = {
          group: common.trimToNull(this.coordinatesGroup),
          name: common.trimToNull(this.coordinatesName),
          version: common.trimToNull(this.coordinatesVersion),
        };
        let esc = encodeURIComponent;
        return Object.keys(params)
          .filter((k) => params[k])
          .map((k) => esc(k) + '=' + esc(params[k]))
          .join('&');
      } else if (this.subject === 'PACKAGE_URL') {
        let v = common.trimToNull(this.value);
        return v != null ? 'purl=' + encodeURIComponent(v) : '';
      } else if (this.subject === 'CPE') {
        let v = common.trimToNull(this.value);
        return v != null ? 'cpe=' + encodeURIComponent(v) : '';
      } else if (this.subject === 'SWID_TAGID') {
        let v = common.trimToNull(this.value);
        return v != null ? 'swidTagId=' + encodeURIComponent(v) : '';
      }
    },
    performSearch: function () {
      let url;
      if (this.subject === 'HASH') {
        let hash = encodeURIComponent(common.trimToNull(this.value));
        url = `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}/hash/${hash}`;
      } else {
        let queryParams = this.createQueryParams();
        url = `${this.$api.BASE_URL}/api/v2/components?${queryParams}`;
      }
      this.tableBaseUrl = url;
      this.$nextTick(() => {
        this.$refs.table.refresh({ silent: true });
      });

      if (this.changeSearchUrl) {
        if (this.subject === 'COORDINATES') {
          let urlCoordinatesGroup = this.coordinatesGroup
            ? encodeURIComponent(this.coordinatesGroup)
            : '';
          let urlCoordinatesName = this.coordinatesName
            ? encodeURIComponent(this.coordinatesName)
            : '';
          let urlCoordinatesVersion = this.coordinatesVersion
            ? encodeURIComponent(this.coordinatesVersion)
            : '';
          this.$router.replace({
            path: 'components',
            hash:
              '#/search/' +
              this.subject +
              '/group=' +
              urlCoordinatesGroup +
              '/name=' +
              urlCoordinatesName +
              '/version=' +
              urlCoordinatesVersion,
          });
        } else {
          let urlValue = this.value ? encodeURIComponent(this.value) : '';
          this.$router.replace({
            path: 'components',
            hash: '#/search/' + this.subject + '/' + urlValue,
          });
        }
      }
    },
    onPreBody: function () {
      loadUserPreferencesForBootstrapTable(
        this,
        'ComponentSearch',
        this.$refs.table.columns,
      );
    },
  },
  data() {
    return {
      subject: this.subject,
      value: null,
      coordinatesGroup: null,
      coordinatesName: null,
      coordinatesVersion: null,
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
            return row.project.direct_dependencies
              ? `<a href="${dependencyGraphUrl}"<i class="fa fa-sitemap" aria-hidden="true" style="float:right; padding-top: 4px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Show in dependency graph"></i></a> ` +
                  `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`
              : `<a href="${url}">${xssFilters.inHTMLData(value)}</a>`;
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
          sortable: true,
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
        icons: {
          refresh: 'fa-refresh',
        },
      },
      tableBaseUrl: null,
    };
  },
};
</script>

<style>
.componentSearch .bootstrap-table .fixed-table-toolbar .bs-bars {
  width: 80%;
}
</style>
