<template>
  <div>
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
    </b-row>
    <b-row class="expanded-row p-3" colspan="2">
      <div class="" style="width: 100%">
        <div v-if="loading" class="d-flex justify-content-center">
          <b-spinner variant="primary" type="grow" label="Loading"
            >Loading ...
          </b-spinner>
        </div>
        <div v-else>
          <label for="">{{ this.$t('message.projects') }}</label>
          <user-roles-table
            :parentContext="{ row, index }"
            :projectRoles="projectRoles"
            :availableRoles="availableRoles"
            @addProjectRole="addProjectRole"
            @updateProjectRole="updateProjectRole"
            @removeProjectRole="removeProjectRole"
          />
        </div>
      </div>
    </b-row>
    <select-team-modal
      :currentTeams="teams"
      v-on:selection="updateTeamSelection"
    />
    <select-permission-modal
      :currentPermissions="permissions"
      v-on:selection="updatePermissionSelection"
    />

    <change-password-modal :managed-user="this.row" />
  </div>
</template>

<script>
import ActionableListGroupItem from '../../../components/ActionableListGroupItem.vue';
import ChangePasswordModal from '../ChangePasswordModal.vue';
import SelectTeamModal from '../SelectTeamModal.vue';
import SelectPermissionModal from '../SelectPermissionModal.vue';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import { Switch as cSwitch } from '@coreui/vue';
import BInputGroupFormInput from '@/forms/BInputGroupFormInput';
import userManagementMixin from '../../../../mixins/userManagementMixin';
import EventBus from '../../../../shared/eventbus';
import i18n from '../../../../i18n';
import UserRolesTable from '../../../components/UserRolesTable.vue';

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
    ChangePasswordModal,
    BInputGroupFormInput,
    UserRolesTable,
  },
  data() {
    return {
      username: this.row.username,
      teams: this.row.teams,
      permissions: this.row.permissions,
      fullname: this.row.fullname,
      email: this.row.email,
      forcePasswordChange: this.row.forcePasswordChange,
      nonExpiryPassword: this.row.nonExpiryPassword,
      suspended: this.row.suspended,
      projectRoles: null,
      availableRoles: null,
      loading: true,
      counter: 0,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  mounted() {
    // Fetch user projects and available roles for each project (userManagementMixin)
    Promise.all([
      this.loadUserProjects(this.username),
      this.loadAvailableProjectRoles(),
    ])
      .then((response) => {
        this.projectRoles = response[0] || [];
        this.availableRoles = response[1] || [];
      })
      .catch((error) => {
        if (!this.axios.isAxiosError(error)) console.error(error);
        this.$toastr.e(this.$t('condition.unsuccessful_action'));
      })
      .finally(() => {
        this.loading = false;
      });
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
    openPermissionModal() {
      this.$root.$emit('bv::show::modal', 'selectPermissionModal');
    },
    openProjectModal() {
      this.$root.$emit('bv::show::modal', 'selectProjectModal');
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
          EventBus.$emit(this.rowEvents.update, this.index, response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    deleteUser: function () {
      const endpoint = `${this.$api.BASE_URL}/${this.$api.URL_USER_MANAGED}`;
      this._deleteUser(endpoint);
    },

    updateTeamSelection: function (selections) {
      this._updateTeamSelection(selections);
    },

    removeTeamMembership: function (teamUUID) {
      this._removeTeamMembership(teamUUID);
    },

    updatePermissionSelection: function (selections) {
      this._updatePermissionSelection(selections);
    },

    removePermission: function (permission) {
      this._removePermission(permission);
    },

    addProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('add', projectRole, callbacks).then(async () => {
        this.projectRoles = await this.loadUserProjects(this.username);
      });
    },

    updateProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('update', projectRole, callbacks);
    },

    removeProjectRole: function (projectRole, callbacks) {
      this._handleProjectRole('remove', projectRole, callbacks).then(
        async () => {
          this.projectRoles = await this.loadUserProjects(this.username);
        },
      );
    },
  },
};
</script>
