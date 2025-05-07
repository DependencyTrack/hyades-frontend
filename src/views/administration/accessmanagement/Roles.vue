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
import common from '../../../shared/common';
import i18n from '../../../i18n';
import CreateRoleModal from './CreateRoleModal';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import EventBus from '../../../shared/eventbus';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import SelectPermissionModal from './SelectPermissionModal';
import permissionsMixin from '../../../mixins/permissionsMixin';
import { Switch as cSwitch } from '@coreui/vue';
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import configPropertyMixin from '../mixins/configPropertyMixin';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin, configPropertyMixin],
  components: {
    cSwitch,
    CreateRoleModal,
    SelectPermissionModal,
  },
  mounted() {
    EventBus.$on('admin:roles:rowUpdate', (index, row) => {
      this.$refs.table.updateRow({ index: index, row: row });
      this.$refs.table.expandRow(index);
    });
    EventBus.$on('admin:roles:rowDeleted', (index, row) => {
      this.refreshTable();
    });
  },
  beforeDestroy() {
    EventBus.$off('admin:roles:rowUpdate');
    EventBus.$off('admin:roles:rowDeleted');
  },
  data() {
    return {
      isAclEnabled: false,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
      columns: [
        {
          title: this.$t('admin.role_name'),
          field: 'name',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('admin.permissions'),
          field: 'permissions',
          sortable: false,
          formatter(value, row, index) {
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
            i18n,
            template: `
                <b-row class="expanded-row">
                  <b-col sm="6">
                    <b-input-group-form-input id="input-role-name" :label="$t('admin.role_name')" input-group-size="mb-3"
                                              required="true" type="text" v-model="name" lazy="true" autofocus="true"
                                              v-debounce:750ms="updateRole" :debounce-events="'keyup'" />
                    <b-form-group :label="this.$t('admin.permissions')">
                      <div class="list-group">
                        <span v-for="permission in permissions">
                          <actionable-list-group-item :value="permission.name" :delete-icon="true" v-on:actionClicked="removePermission(permission)"/>
                        </span>
                        <actionable-list-group-item :add-icon="true" v-on:actionClicked="$root.$emit('bv::show::modal', 'selectPermissionModal')"/>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <div style="text-align:right">
                       <b-button variant="outline-danger" @click="deleteRole">{{ $t('admin.delete_role') }}</b-button>
                    </div>
                  </b-col>
                  <select-permission-modal v-on:selection="updatePermissionSelection" />
                </b-row>
              `,
            mixins: [permissionsMixin],
            components: {
              cSwitch,
              ActionableListGroupItem,
              SelectPermissionModal,
              BInputGroupFormInput,
            },
            data() {
              return {
                role: row,
                name: row.name,
                permissions: row.permissions,
                labelIcon: {
                  dataOn: '\u2713',
                  dataOff: '\u2715',
                },
              };
            },
            methods: {
              updateRole: function () {
                let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
                this.axios
                  .post(url, {
                    uuid: this.role.uuid,
                    name: this.name,
                  })
                  .then((response) => {
                    this.role = response.data;
                    EventBus.$emit('admin:roles:rowUpdate', index, this.role);
                    this.$toastr.s(this.$t('message.updated'));
                  })
                  .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              deleteRole: function () {
                let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
                this.axios
                  .delete(url, {
                    data: {
                      uuid: this.role.uuid,
                    },
                  })
                  .then((response) => {
                    EventBus.$emit('admin:roles:rowDeleted', index);
                    this.$toastr.s(this.$t('admin.role_deleted'));
                  })
                  .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              updatePermissionSelection: function (selections) {
                this.$root.$emit('bv::hide::modal', 'selectPermissionModal');
                for (let i = 0; i < selections.length; i++) {
                  let selection = selections[i];
                  let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${selection.name}/role/${this.role.uuid}`;
                  this.axios
                    .post(url)
                    .then((response) => {
                      this.syncVariables(response.data);
                      this.$toastr.s(this.$t('message.updated'));
                    })
                    .catch((error) => {
                      if (error.response.status === 304) {
                        //this.$toastr.w(this.$t('condition.unsuccessful_action'));
                      } else {
                        this.$toastr.w(
                          this.$t('condition.unsuccessful_action'),
                        );
                      }
                    });
                }
              },
              removePermission: function (permission) {
                let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/role/${this.role.uuid}`;
                this.axios
                  .delete(url)
                  .then((response) => {
                    this.syncVariables(response.data);
                    this.$toastr.s(this.$t('message.updated'));
                  })
                  .catch((error) => {
                    this.$toastr.w(this.$t('condition.unsuccessful_action'));
                  });
              },
              syncVariables: function (role) {
                this.role = role;
                this.permissions = role.permissions;
              },
            },
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
