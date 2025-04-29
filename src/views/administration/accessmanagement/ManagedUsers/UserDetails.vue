<template>
  <b-row class="expanded-row">
    <b-col sm="6">
      <b-form-group :label="this.$t('admin.team_membership')">
        <div class="list-group">
          <span v-for="team in teams" :key="team.name">
            <actionable-list-group-item
              :tooltip="$t('admin.remove_team_membership')"
              :value="team.name"
              :delete-icon="true"
              v-on:actionClicked="removeTeamMembership(team.uuid)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectTeamModal')
            "
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.roles')">
        <div class="list-group">
          <span v-for="projectRole in projectRoles" :key="projectRole.name">
            <project-role-list-group-item
              :projectRole="projectRole"
              :delete-icon="true"
              v-on:removeClicked="removeRole(projectRole)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectRoleModal')
            "
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.permissions')">
        <div class="list-group">
          <span v-for="permission in permissions" :key="permission.name">
            <actionable-list-group-item
              :tooltip="$t('admin.remove_permission')"
              :value="permission.name"
              :delete-icon="true"
              v-on:actionClicked="removePermission(permission)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="openPermissionModal"
          />
        </div>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <b-input-group-form-input
        id="input-managed-user-fullname"
        :label="$t('message.fullname')"
        input-group-size="mb-3"
        required="true"
        type="text"
        v-model="fullname"
        lazy="true"
        v-debounce:750ms="updateUser"
        :debounce-events="'keyup'"
      />
      <b-input-group-form-input
        id="input-managed-user-email"
        :label="$t('message.email')"
        input-group-size="mb-3"
        required="true"
        type="text"
        v-model="email"
        lazy="true"
        v-debounce:750ms="updateUser"
        :debounce-events="'keyup'"
      />
      <c-switch
        id="forcePasswordChange"
        color="primary"
        v-model="forcePasswordChange"
        label
        v-bind="labelIcon"
      />{{ $t('admin.change_password_next_login') }}
      <br />
      <c-switch
        id="nonExpiryPassword"
        color="primary"
        v-model="nonExpiryPassword"
        label
        v-bind="labelIcon"
      />{{ $t('admin.password_never_expires') }}
      <br />
      <c-switch
        id="suspended"
        color="primary"
        v-model="suspended"
        label
        v-bind="labelIcon"
      />{{ $t('admin.suspended') }}
      <div style="text-align: right">
        <b-button
          variant="outline-primary"
          @click="$root.$emit('bv::show::modal', 'changePasswordModal')"
          >{{ $t('admin.change_password') }}</b-button
        >
        <b-button variant="outline-danger" @click="deleteUser">{{
          $t('admin.delete_user')
        }}</b-button>
      </div>
    </b-col>
    <select-team-modal
      :currentTeams="teams"
      v-on:selection="updateTeamSelection"
    />
    <select-role-modal
      :username="username"
      v-on:selection="updateRoleSelection"
    />
    <select-permission-modal
      :currentPermissions="permissions"
      v-on:selection="updatePermissionSelection"
    />
    <change-password-modal :managed-user="this.row" />
  </b-row>
</template>

<script>
import ActionableListGroupItem from '../../../components/ActionableListGroupItem.vue';
import ChangePasswordModal from '../ChangePasswordModal.vue';
import SelectTeamModal from '../SelectTeamModal.vue';
import SelectPermissionModal from '../SelectPermissionModal.vue';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import { Switch as cSwitch } from '@coreui/vue';
import BInputGroupFormInput from '@/forms/BInputGroupFormInput';
import SelectRoleModal from '../SelectRoleModal.vue';
import ProjectRoleListGroupItem from '../ProjectRoleListGroupItem.vue';
import userManagementMixin from '../../../../mixins/userManagementMixin';
import EventBus from '../../../../shared/eventbus';
import i18n from '../../../../i18n';

export default {
  i18n,
  props: {
    index: { type: Number, required: true },
    row: { type: Object, required: true },
    rowEvents: { update: { type: String }, delete: { type: String } },
  },
  mixins: [permissionsMixin, userManagementMixin],
  components: {
    cSwitch,
    ActionableListGroupItem,
    SelectTeamModal,
    SelectPermissionModal,
    // SelectProjectModal,
    SelectRoleModal,
    ChangePasswordModal,
    BInputGroupFormInput,
    ProjectRoleListGroupItem,
  },
  data() {
    return {
      managedUser: this.row,
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      fullname: this.row.fullname,
      email: this.row.email,
      forcePasswordChange: this.row.forcePasswordChange,
      nonExpiryPassword: this.row.nonExpiryPassword,
      suspended: this.row.suspended,
      identifierField: 'username',
      projectRoles: [],
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  created() {
    this.loadUserRoles(this.username);
  },
  watch: {
    forcePasswordChange() {
      this.updateUser();
    },
    nonExpiryPassword() {
      this.updateUser();
    },
    suspended() {
      this.updateUser();
    },
  },
  methods: {
    getUserObjectKey: function () {
      return 'managedUser';
    },
    getUserObject: function () {
      return this.managedUser;
    },
    openPermissionModal() {
      this.$root.$emit('bv::show::modal', 'selectPermissionModal');
    },
    updateUser: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
      this.axios
        .post(url, {
          username: this.username,
          fullname: this.fullname,
          email: this.email,
          newPassword: null,
          confirmPassword: null,
          forcePasswordChange: this.forcePasswordChange,
          nonExpiryPassword: this.nonExpiryPassword,
          suspended: this.suspended,
        })
        .then((response) => {
          // update will cascade down to the table
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          // console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    deleteUser: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
      this._deleteUser(url, event);
    },
    updateTeamSelection: function (selections) {
      this.$root.$emit('bv::hide::modal', 'selectTeamModal');
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MEMBERSHIP}`;
      this._updateTeamSelection(endpoint, selections);
    },
    removeTeamMembership: function (teamUUID) {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.username}/membership`;
      this._removeTeamMembership(url, teamUUID);
    },
    updateRoleSelection: function (selection) {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${this.managedUser.username}/role`;
      this._updateRoleSelection(url, selection);
    },
    removeRole: function (projectRole) {
      this._removeRole(projectRole);
    },
    updatePermissionSelection: function (selections) {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_PERMISSION}`;
      this._updatePermissionSelection(endpoint, selections);
    },
    removePermission: function (permission) {
      this._removePermission(permission);
    },
  },
};
</script>
