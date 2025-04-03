<template>
  <b-modal
    id="selectPermissionModal"
    size="lg"
    hide-header-close
    no-stacking
    :title="$t('admin.select_permission')"
  >
    <bootstrap-table
      ref="table"
      :columns="columns"
      :data="data"
      :options="options"
    >
    </bootstrap-table>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="md" variant="secondary" @click="cancel()">{{
        $t('message.cancel')
      }}</b-button>
      <b-button size="md" variant="primary" @click="handleSelection">{{
        $t('message.select')
      }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../shared/common';

export default {
  mixins: [],
  props: {
    currentPermissions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns: [
        {
          field: 'state',
          checkbox: true, // Enable checkboxes
          align: 'center',
        },
        {
          title: this.$t('message.name'),
          field: 'name',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
      ],
      data: [], // retrieved list of addable permissions
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
        maintainMetaData: true,
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}`,
        // must use function arrow notation to access 'this'
        onLoadSuccess: () => {
          // when the addable permissions load
          const mappedPermissions = this.currentPermissions.map(
            (perm) => perm.name,
          );
          this.$refs.table.checkBy({
            field: 'name',
            values: mappedPermissions,
          });
        },
      },
    };
  },
  methods: {
    handleSelection: function () {
      const selections = this.$refs.table.getSelections();
      this.$root.$emit('bv::hide::modal', this.$children[0].id);
      this.$emit('selection', selections);
    },
  },
};
</script>
