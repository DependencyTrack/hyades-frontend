<template>
  <b-row class="expanded-row">
    <b-col sm="6">
      <b-input-group-form-input
        id="input-role-name"
        :label="$t('admin.role_name')"
        input-group-size="mb-3"
        required="true"
        type="text"
        v-model="name"
        lazy="true"
        autofocus="true"
        v-debounce:750ms="updateRole"
        :debounce-events="'keyup'"
      />
      <b-form-group :label="this.$t('admin.permissions')">
        <div class="list-group">
          <span v-for="permission in permissions" :key="permission.name">
            <actionable-list-group-item
              :value="permission.name"
              :delete-icon="true"
              v-on:actionClicked="removePermission(permission)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectPermissionModal')
            "
          />
        </div>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <div style="text-align: right">
        <b-button variant="outline-danger" @click="deleteRole">{{
          $t('admin.delete_role')
        }}</b-button>
      </div>
    </b-col>
    <select-permission-modal v-on:selection="updatePermissionSelection" />
  </b-row>
</template>
<script>
import ActionableListGroupItem from '../../../components/ActionableListGroupItem';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import BInputGroupFormInput from '../../../../forms/BInputGroupFormInput';
import SelectPermissionModal from '../SelectPermissionModal';
import i18n from '../../../../i18n';
import EventBus from '../../../../shared/eventbus';
export default {
  props: {
    index: { type: Number, required: true },
    row: { type: Object, required: true },
    rowEvents: { update: { type: String }, delete: { type: String } },
  },
  i18n,
  mixins: [permissionsMixin],
  components: {
    ActionableListGroupItem,
    SelectPermissionModal,
    BInputGroupFormInput,
  },
  data() {
    return {
      role: this.row,
      name: this.row.name,
      permissions: this.row.permissions,
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
          // this.role = response.data;
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
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
        .then(() => {
          EventBus.$emit(this.rowEvents.delete, this.index);
          this.$toastr.s(this.$t('admin.role_deleted'));
        })
        .catch(() => {
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
              this.$toastr.w(this.$t('condition.unsuccessful_action'));
            }
          });
      }
    },
    removePermission: function (permission) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/role/${this.role.uuid}`;
      this.axios
        .delete(url)
        .then((response) => {
          // this.syncVariables(response.data);
          EventBus.$emit(this.rowEvents.delete, this.index, response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    syncVariables: function (role) {
      this.role = role;
      this.permissions = role.permissions;
    },
  },
};
</script>
