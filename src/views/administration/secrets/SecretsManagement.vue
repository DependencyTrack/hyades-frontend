<template>
  <b-card no-body :header="$t('admin.secrets_management')">
    <b-card-body>
      <div id="customToolbar">
        <b-button
          size="md"
          variant="outline-primary"
          v-permission:or="[
            PERMISSIONS.SECRET_MANAGEMENT,
            PERMISSIONS.SECRET_MANAGEMENT_CREATE,
          ]"
          v-b-modal.createSecretModal
        >
          <span class="fa fa-plus"></span> {{ $t('message.create') }}
        </b-button>
      </div>
      <bootstrap-table
        ref="table"
        :columns="columns"
        :data="data"
        :options="options"
      >
      </bootstrap-table>
    </b-card-body>
    <create-secret-modal v-on:refreshTable="refreshTable" />
    <update-secret-modal
      v-on:refreshTable="refreshTable"
      :secret="selectedRow"
    />
  </b-card>
</template>

<script>
import common from '../../../shared/common';
import bootstrapTableMixin from '@/mixins/bootstrapTableMixin';
import permissionsMixin from '@/mixins/permissionsMixin';
import routerMixin from '@/mixins/routerMixin';
import xssFilters from 'xss-filters';
import CreateSecretModal from '@/views/administration/secrets/CreateSecretModal.vue';
import UpdateSecretModal from '@/views/administration/secrets/UpdateSecretModal.vue';

export default {
  mixins: [bootstrapTableMixin, permissionsMixin, routerMixin],
  props: {
    header: String,
  },
  components: {
    CreateSecretModal,
    UpdateSecretModal,
  },
  data() {
    return {
      selectedRow: null,
      columns: [
        {
          title: this.$t('message.name'),
          field: 'name',
          sortable: true,
          searchable: true,
          formatter(value) {
            return xssFilters.inHTMLData(value);
          },
        },
        {
          title: this.$t('message.description'),
          field: 'description',
          sortable: false,
          searchable: true,
          formatter(value) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, '-'));
          },
        },
        {
          title: this.$t('message.created'),
          field: 'created_at',
          sortable: true,
          searchable: false,
          formatter(value) {
            return common.formatTimestamp(value, true);
          },
        },
        {
          title: this.$t('message.updated'),
          field: 'updated_at',
          sortable: true,
          searchable: false,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: this.$t('message.actions'),
          align: 'center',
          sortable: false,
          searchable: false,
          formatter: () => {
            return `
              <button class="btn btn-sm btn-outline-primary action-btn" data-action="copy-to-clipboard" title=${JSON.stringify(this.$t('admin.copy_secret_expression_to_clipboard'))}>
                <i class="fa fa-clipboard"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary action-btn" data-action="edit" title=${JSON.stringify(this.$t('admin.edit_secret'))} ${!this.canUpdate ? 'disabled' : ''}>
                <i class="fa fa-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger action-btn" data-action="delete" title=${JSON.stringify(this.$t('admin.delete_secret'))} ${!this.canDelete ? 'disabled' : ''}>
                <i class="fa fa-trash"></i>
              </button>
            `;
          },
          events: {
            'click .action-btn': (event, _, row) => {
              const action = event.currentTarget.dataset.action;
              switch (action) {
                case 'copy-to-clipboard':
                  this.onCopyToClipboardClicked(row);
                  break;
                case 'edit':
                  this.onEditClicked(row);
                  break;
                case 'delete':
                  this.onDeleteClicked(row);
                  break;
              }
            },
          },
        },
      ],
      data: [],
      options: {
        search: true,
        searchable: false,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sortName: 'name',
        sortOrder: 'asc',
        sidePagination: 'client',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        queryParams: function () {
          // Don't send any query parameters for now,
          // since pagination happens on the client
          // and server-side filtering is not (yet) supported.
          return {};
        },
        icons: {
          refresh: 'fa-refresh',
        },
        toolbar: '#customToolbar',
        responseHandler: function (res) {
          res.total = res.secrets.length;
          return res.secrets;
        },
        url: `${this.$api.BASE_URL}/api/v2/secrets`,
      },
    };
  },
  computed: {
    isReadOnly() {
      return this.$dtrack.secretManager.readOnly;
    },
    canUpdate() {
      return (
        !this.isReadOnly &&
        (this.isPermitted(this.PERMISSIONS.SECRET_MANAGEMENT) ||
          this.isPermitted(this.PERMISSIONS.SECRET_MANAGEMENT_UPDATE))
      );
    },
    canDelete() {
      return (
        !this.isReadOnly &&
        (this.isPermitted(this.PERMISSIONS.SECRET_MANAGEMENT) ||
          this.isPermitted(this.PERMISSIONS.SECRET_MANAGEMENT_DELETE))
      );
    },
  },
  methods: {
    onCopyToClipboardClicked(row) {
      navigator.clipboard
        .writeText(`{{ secret('${row.name}') }}`)
        .then(() => {
          this.$toastr.s(this.$t('message.copied_to_clipboard'));
        })
        .catch((err) => {
          console.error(
            `Failed to copy secret expression to clipboard: ${err}`,
          );
          this.$toastr.e(this.$t('condition.unsuccessful_action'));
        });
    },
    onEditClicked(row) {
      this.selectedRow = row;
      this.$nextTick(() => {
        this.$bvModal.show('updateSecretModal');
      });
    },
    onDeleteClicked(row) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('admin.confirm_secret_deletion_message', { name: row.name }),
          {
            title: this.$t('admin.confirm_secret_deletion'),
            size: 'md',
            okVariant: 'danger',
            okTitle: this.$t('message.delete'),
            cancelTitle: this.$t('message.cancel'),
            centered: true,
          },
        )
        .then((confirmed) => {
          if (confirmed) {
            this.deleteSecret(row.name);
          }
        });
    },
    deleteSecret(name) {
      this.axios
        .delete(
          `${this.$api.BASE_URL}/api/v2/secrets/${encodeURIComponent(name)}`,
        )
        .then(() => {
          this.$toastr.s(
            this.$t('message.record_deleted_message'),
            this.$t('message.record_deleted_title'),
          );
          this.refreshTable();
        });
    },
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
  },
};
</script>
