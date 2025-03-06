<template>
  <!-- <bootstrap-table
    ref="table"
    :columns="columns"
    :data="data"
    :options="options"
  >
  </bootstrap-table> -->
  <b-card no-body :header="header">
    <b-card-body>
      <b-input-group-form-select
        v-model="$selectedRole"
        :options="availableRoles"
        :label="$t('admin.role')"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../../shared/common';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import EventBus from '../../../shared/eventbus';
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import ApiKeyListGroupItem from './ApiKeyListGroupItem.vue';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  components: {
    BInputGroupFormSelect,
  },
  mounted() {
    EventBus.$on('admin:roles:rowUpdate', (index, row) => {
      this.$refs.table.updateRow({ index: index, row: row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on('admin:roles:rowDeleted', (index, row) => {
      this.refreshTable();
    });
    this.loadRoles();
  },
  beforeDestroy() {
    EventBus.$off('admin:roles:rowUpdate');
    EventBus.$off('admin:roles:rowDeleted');
  },
  data() {
    return {
      availableRoles: [],
      selectedRole: null,
      columns: [
        // {
        //   title: this.$t('admin.project'),
        //   field: 'name',
        //   sortable: false,
        //   formatter(value, row, index) {
        //     return `
        //       <b-input-group :size="md" class="mb-3">
        //         <span>
        //           <b-button size="md" variant="primary" v-on:actionClicked="selectProjectModal">{{
        //             $t('admin.select_project')
        //           }}</b-button>
        //         </span>
        //       <b-form-input></b-form-input>`;
        //   },
        // },
        {
          title: this.$t('admin.role'),
          field: 'role',
          sortable: false,
          formatter(value, row, index) {
            return `
              <b-input-group-form-select
                v-model="${this.selectedRole}"
                :options="${this.availableRoles}"
                :label="$t('admin.role')"
              />
            `;
          },
        },
      ],
    };
  },
  methods: {
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
    loadRoles: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      this.axios.get(url).then((response) => {
        this.availableRoles = response.data.map((d) => ({
          value: d.id,
          text: d.name,
        }));
        this.$toastr.s(this.$t(this.availableRoles[1].name));
      });
    },
  },
};
</script>
