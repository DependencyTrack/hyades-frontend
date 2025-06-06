<template>
  <b-modal
    id="selectPermissionModal"
    size="lg"
    hide-header-close
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
      <b-button
        size="md"
        variant="primary"
        :disabled="selectionHasChanged"
        @click="handleSelection"
        >{{ $t('message.select') }}</b-button
      >
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
      currentSelection: [],
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
          formatter(value) {
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
        onCheck: this.updateCurrentSelection,
        onUncheck: this.updateCurrentSelection,
        onCheckAll: this.updateCurrentSelection,
        onUncheckAll: this.updateCurrentSelection,
      },
    };
  },
  computed: {
    selectionHasChanged() {
      if (
        this.currentSelection.length === 0 &&
        this.currentPermissions.length === 0
      ) {
        return true;
      }

      if (this.currentSelection.length !== this.currentPermissions.length) {
        return false;
      }

      const isEqual = this.currentSelection.every((sel) =>
        this.currentPermissions.some((team) => team.name === sel.name),
      );

      return (
        isEqual &&
        this.currentPermissions.every((team) =>
          this.currentSelection.some((sel) => sel.name === team.name),
        )
      );
    },
  },
  methods: {
    handleSelection: function () {
      this.$root.$emit('bv::hide::modal', this.$children[0].id);
      this.$emit('selection', this.currentSelection);
    },
    updateCurrentSelection() {
      this.currentSelection = this.$refs.table.getSelections();
    },
  },
};
</script>
