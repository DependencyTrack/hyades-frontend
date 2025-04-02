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
  props: {
    selectedPermissions: {
      type: Array,
      required: true, // Pass the already selected permissions as a prop
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
      data: [], // Permissions data
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
      },
    };
  },
  mounted() {
    const url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}`;
    console.log('API URL:', url); // Debugging: Log the URL
    console.log('API Object:', this.$api); // Debugging: Log the $api object

    this.$http
      .get(url)
      .then((response) => {
        const permissions = response.data;

        // Debugging: Log the permissions fetched from the backend
        console.log('Fetched Permissions:', permissions);

        // Debugging: Log the selectedPermissions passed as a prop
        console.log('Selected Permissions:', this.selectedPermissions);

        // Mark permissions as checked if they are already selected
        this.data = permissions.map((permission) => {
          const isSelected = this.selectedPermissions.some(
            (selected) => selected.id === permission.id,
          );
          return {
            ...permission,
            state: isSelected, // Pre-check if already selected
          };
        });
        console.log('Processed Permissions:', this.data); // Debugging: Log the processed permissions
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error); // Debugging: Log any errors
        this.$bvToast.toast(this.$t('message.error_fetching_permissions'), {
          title: this.$t('message.error'),
          variant: 'danger',
          autoHideDelay: 5000,
        });
      });
  },
  methods: {
    handleSelection: function () {
      const selections = this.$refs.table.getSelections(); // Get selected rows
      this.$root.$emit('bv::hide::modal', this.$children[0].id);
      this.$emit('selection', selections); // Emit the selected permissions
    },
  },
};
</script>
