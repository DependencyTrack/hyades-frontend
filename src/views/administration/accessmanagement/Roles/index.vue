<template>
  <b-card no-body :header="header">
    <b-card-body>
      <div id="customToolbar">
        <b-button size="md" variant="outline-primary" v-b-modal.createRoleModal>
          <span class="fa fa-plus"></span> {{ $t('admin.create_role') }}
        </b-button>
        <c-switch
          id="isAclEnabled"
          color="primary"
          v-model="isAclEnabled"
          label
          v-bind="labelIcon"
        />{{ $t('admin.enable_acl') }}
      </div>
      <bootstrap-table
        ref="table"
        :columns="columns"
        :data="data"
        :options="options"
      >
      </bootstrap-table>
    </b-card-body>
    <create-role-modal v-on:refreshTable="refreshTable" />
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../../shared/common';
import CreateRoleModal from '../CreateRoleModal';
import bootstrapTableMixin from '../../../../mixins/bootstrapTableMixin';
import EventBus from '../../../../shared/eventbus';
import { Switch as cSwitch } from '@coreui/vue';
import configPropertyMixin from '../../mixins/configPropertyMixin';
import RoleDetails from './RoleDetails.vue';

export default {
  name: 'RolesView',
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin, configPropertyMixin],
  components: {
    cSwitch,
    CreateRoleModal,
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
    EventBus.$off(this.rowEvents.delete);
    EventBus.$off(this.rowEvents.update);
  },
  data() {
    return {
      isAclEnabled: false,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
      rowEvents: {
        update: 'admin:roles:rowUpdate',
        delete: 'admin:roles:rowDeleted',
      },
      columns: [
        {
          title: this.$t('admin.role_name'),
          field: 'name',
          sortable: false,
          formatter(value) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('admin.permissions'),
          field: 'permissions',
          sortable: false,
          formatter(value, row) {
            return value ? row.permissions.length : 0;
          },
        },
      ],
      data: [],
      options: {
        search: true,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sidePagination: 'client',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        icons: {
          refresh: 'fa-refresh',
        },
        detailView: true,
        detailViewIcon: false,
        detailViewByClick: true,
        detailFormatter: (index, row) => {
          return this.vueFormatter({
            render: () => (
              <RoleDetails index={index} row={row} rowEvents={this.rowEvents} />
            ),
          });
        },
        onExpandRow: this.vueFormatterInit,
        toolbar: '#customToolbar',
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`,
      },
    };
  },
  methods: {
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
    updateProperties: function () {
      this.updateConfigProperties([
        {
          groupName: 'access-management',
          propertyName: 'acl.enabled',
          propertyValue: this.isAclEnabled,
        },
      ]);
    },
  },
  watch: {
    isAclEnabled() {
      this.updateProperties();
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      let configItems = response.data.filter(function (item) {
        return item.groupName === 'access-management';
      });
      for (let i = 0; i < configItems.length; i++) {
        let item = configItems[i];
        switch (item.propertyName) {
          case 'acl.enabled':
            this.isAclEnabled = common.toBoolean(item.propertyValue);
            break;
        }
      }
    });
  },
};
</script>
