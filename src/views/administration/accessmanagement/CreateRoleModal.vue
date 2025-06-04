<template>
  <b-modal
    id="createRoleModal"
    size="md"
    @hide="resetValues()"
    hide-header-close
    :title="$t('admin.create_role')"
  >
    <b-input-group-form-input
      id="name-input"
      input-group-size="mb-3"
      type="text"
      v-model="name"
      lazy="true"
      required="true"
      feedback="true"
      autofocus="false"
      :label="$t('admin.role_name')"
      :feedback-text="$t('admin.required_role_name')"
    />

    <b-form-group :label="$t('admin.permissions')">
      <div class="list-group">
        <span v-for="permission in permissions" :key="permission.id">
          <actionable-list-group-item
            :value="permission.name"
            :delete-icon="true"
            @actionClicked="removePermission(permission)"
          />
        </span>
        <actionable-list-group-item
          :add-icon="true"
          @actionClicked="showSelectPermissionModal"
        />
      </div>
    </b-form-group>

    <template v-slot:modal-footer="{ cancel }">
      <b-button size="md" variant="secondary" @click="cancel()">
        {{ $t('message.close') }}
      </b-button>
      <b-button
        size="md"
        variant="primary"
        @click="createRole()"
        :disabled="!name"
      >
        {{ $t('message.create') }}
      </b-button>
    </template>

    <select-permission-modal @selection="updatePermissionSelection" />
  </b-modal>
</template>

<script>
import permissionsMixin from '../../../mixins/permissionsMixin';
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import ActionableListGroupItem from '../../components/ActionableListGroupItem';
import SelectPermissionModal from './SelectPermissionModal';

export default {
  mixins: [permissionsMixin],
  components: {
    BInputGroupFormInput,
    ActionableListGroupItem,
    SelectPermissionModal,
  },
  data() {
    return {
      name: null,
      permissions: [],
    };
  },
  methods: {
    createRole() {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ROLE}`;
      const requestBody = {
        name: this.name,
        permissions: this.permissions.map((permission) => permission.name),
      };
      this.axios
        .put(url, {
          name: this.name,
          permissions: this.permissions.map((perm) => perm.name),
        })
        .then(() => {
          this.$emit('refreshTable');
          this.$toastr.s(this.$t('admin.role_created'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
      this.$root.$emit('bv::hide::modal', 'createRoleModal');
      this.resetValues();
    },
    resetValues() {
      this.name = null;
      this.permissions = [];
    },
    removePermission(permission) {
      let index = this.permissions.indexOf(permission);
      if (index > -1) {
        this.permissions.splice(index, 1);
      }
    },
    showSelectPermissionModal() {
      this.$root.$emit('bv::show::modal', 'selectPermissionModal');
    },
    updatePermissionSelection(selections) {
      this.permissions = selections;
    },
  },
};
</script>
