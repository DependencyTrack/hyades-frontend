<template>
  <b-card no-body :header="header">
    <b-card-body>
      <div id="customToolbar">
        <text-filter-pill
          ref="nameFilterPill"
          :field-name="'name'"
          :field-label="'Name'"
          :operators="['contains']"
          v-model="nameFilter"
        />
      </div>
      <token-paginated-table
        ref="table"
        :base-url="tableDataUrl"
        :columns="columns"
        :options="options"
        :response-data-field="'teams'"
      />
    </b-card-body>
    <create-team-modal v-on:refreshTable="refreshTable" />
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../../shared/common';
import TokenPaginatedTable from '@/views/components/TokenPaginatedTable.vue';
import CreateTeamModal from '../CreateTeamModal';
import bootstrapTableMixin from '../../../../mixins/bootstrapTableMixin';
import EventBus from '../../../../shared/eventbus';
import TeamDetails from './TeamDetails.vue';
import TextFilterPill from '@/views/components/TextFilterPill.vue';

export default {
  name: 'TeamsView',
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  components: {
    TextFilterPill,
    TokenPaginatedTable,
    CreateTeamModal,
  },
  mounted() {
    EventBus.$on(this.rowEvents.update, (index, row) => {
      this.$refs.table.updateRow({ index, row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on(this.rowEvents.delete, () => {
      this.refreshTable();
    });
  },
  beforeDestroy() {
    EventBus.$off(this.rowEvents.update);
    EventBus.$off(this.rowEvents.delete);
  },
  data() {
    return {
      nameFilter: null,
      rowEvents: {
        update: 'admin:teams:rowUpdate',
        delete: 'admin:teams:rowDeleted',
      },
      columns: [
        {
          title: this.$t('admin.team_name'),
          field: 'name',
          sortable: false,
          formatter(value) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('admin.api_keys'),
          field: 'api_keys',
          sortable: false,
          formatter(value) {
            return value
              ? xssFilters.inHTMLData(
                  common.valueWithDefault(value.length, '0'),
                )
              : 0;
          },
        },
        {
          title: this.$t('admin.members'),
          field: 'members',
          sortable: false,
        },
      ],
      options: {
        detailView: true,
        detailViewIcon: false,
        detailViewByClick: true,
        detailFormatter: (index, row) => {
          return this.vueFormatter({
            render: () => (
              <TeamDetails row={row} index={index} rowEvents={this.rowEvents} />
            ),
          });
        },
        onExpandRow: this.vueFormatterInit,
        toolbar: '#customToolbar',
      },
    };
  },
  computed: {
    tableDataUrl() {
      const url = new URL('http://localhost:8080/api/v2/teams');
      if (this.nameFilter) {
        url.searchParams.set('name', this.nameFilter.value);
      }

      return url.toString();
    },
  },
  methods: {
    refreshTable: async function () {
      await this.$refs.table.refreshCurrentPage();
    },
  },
};
</script>
