<template>
  <b-row class="expanded-row">
    <b-col sm="6">
      <b-input-group-form-input
        id="input-team-name"
        :label="$t('admin.team_name')"
        input-group-size="mb-3"
        required="true"
        type="text"
        v-model="name"
        lazy="true"
        autofocus="true"
        v-debounce:750ms="updateTeam"
        :debounce-events="'keyup'"
      />
      <b-form-group :label="this.$t('admin.api_keys')">
        <div class="list-group">
          <span v-for="key in sortedApiKeys">
            <api-key-list-group-item
              :team-uuid="team.uuid"
              :api-key="apiKeys[key]"
              :delete-icon="true"
              v-on:removeClicked="removeApiKey(apiKeys[key])"
              v-on:regenerateClicked="regenerateApiKey(apiKeys[key])"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="createApiKey()"
            :tooltip="$t('admin.new_api_key_title')"
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.permissions')">
        <div class="list-group">
          <span v-for="permission in permissions">
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
      <b-form-group :label="this.$t('admin.mapped_ldap_groups')">
        <div class="list-group">
          <span v-for="ldapGroup in ldapGroups">
            <actionable-list-group-item
              :value="ldapGroup.dn"
              :delete-icon="true"
              v-on:actionClicked="removeLdapGroupMapping(ldapGroup.uuid)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectLdapGroupModal')
            "
          />
        </div>
      </b-form-group>
      <b-form-group :label="this.$t('admin.mapped_oidc_groups')">
        <div class="list-group">
          <span v-for="mappedOidcGroup in mappedOidcGroups">
            <actionable-list-group-item
              :value="mappedOidcGroup.group.name"
              :delete-icon="true"
              v-on:actionClicked="removeOidcGroupMapping(mappedOidcGroup.uuid)"
            />
          </span>
          <actionable-list-group-item
            :add-icon="true"
            v-on:actionClicked="
              $root.$emit('bv::show::modal', 'selectOidcGroupModal')
            "
          />
        </div>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <b-form-group
        v-if="managedUsers && managedUsers.length > 0"
        :label="this.$t('admin.managed_users')"
      >
        <div class="list-group">
          <span v-for="managedUser in managedUsers">
            <actionable-list-group-item
              :value="managedUser.username"
              :delete-icon="true"
              v-on:actionClicked="removeUser(managedUser)"
            />
          </span>
        </div>
      </b-form-group>
      <b-form-group
        v-if="ldapUsers && ldapUsers.length > 0"
        :label="this.$t('admin.ldap_users')"
      >
        <div class="list-group">
          <span v-for="ldapUser in ldapUsers">
            <actionable-list-group-item
              :value="ldapUser.username"
              :delete-icon="true"
              v-on:actionClicked="removeUser(ldapUser)"
            />
          </span>
        </div>
      </b-form-group>
      <b-form-group
        v-if="oidcUsers && oidcUsers.length > 0"
        :label="this.$t('admin.oidc_users')"
      >
        <div class="list-group">
          <span v-for="oidcUser in oidcUsers">
            <actionable-list-group-item
              :value="oidcUser.username"
              :delete-icon="true"
              v-on:actionClicked="removeUser(oidcUser)"
            />
          </span>
        </div>
      </b-form-group>
      <div style="text-align: right">
        <b-button variant="outline-danger" @click="deleteTeam">{{
          $t('admin.delete_team')
        }}</b-button>
      </div>
    </b-col>
    <select-permission-modal v-on:selection="updatePermissionSelection" />
    <select-ldap-group-modal v-on:selection="updateLdapGroupSelection" />
    <select-oidc-group-modal v-on:selection="updateOidcGroupSelection" />
  </b-row>
</template>

<script>
import EventBus from '../../../../shared/eventbus';
import ActionableListGroupItem from '../../../components/ActionableListGroupItem';
import ApiKeyListGroupItem from '../ApiKeyListGroupItem.vue';
import SelectLdapGroupModal from '../SelectLdapGroupModal';
import SelectOidcGroupModal from '../SelectOidcGroupModal';
import SelectPermissionModal from '../SelectPermissionModal';
import permissionsMixin from '../../../../mixins/permissionsMixin';
import BInputGroupFormInput from '../../../../forms/BInputGroupFormInput';

import { Switch as cSwitch } from '@coreui/vue';
import i18n from '../../../../i18n';

export default {
  i18n,
  mixins: [permissionsMixin],
  components: {
    cSwitch,
    ActionableListGroupItem,
    ApiKeyListGroupItem,
    SelectLdapGroupModal,
    SelectOidcGroupModal,
    SelectPermissionModal,
    BInputGroupFormInput,
  },
  props: {
    row: { type: Object, required: true },
    index: { type: Number, required: true },
    rowEvents: { update: { type: String }, delete: { type: String } },
  },
  data() {
    return {
      team: this.row,
      name: this.row.name,
      apiKeys: this.apiKeysToDict(this.row.apiKeys ?? []),
      permissions: this.row.permissions,
      ldapGroups: this.row.mappedLdapGroups,
      mappedOidcGroups: this.row.mappedOidcGroups,
      managedUsers: this.row.managedUsers,
      ldapUsers: this.row.ldapUsers,
      oidcUsers: this.row.oidcUsers,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  computed: {
    sortedApiKeys() {
      return Object.keys(this.apiKeys).sort((a, b) => {
        return (
          new Date(this.apiKeys[a].created) - new Date(this.apiKeys[b].created)
        );
      });
    },
  },
  methods: {
    apiKeysToDict: function (apiKeys) {
      const dict = {};
      apiKeys.forEach((item) => {
        dict[item.publicId] = item;
      });
      return dict;
    },
    updateTeam: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}`;
      this.axios
        .post(url, {
          uuid: this.team.uuid,
          name: this.name,
        })
        .then((response) => {
          this.team = response.data;
          EventBus.$emit(this.rowEvents.update, this.index, this.team);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    deleteTeam: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}`;
      this.axios
        .delete(url, {
          data: {
            uuid: this.team.uuid,
          },
        })
        .then((response) => {
          EventBus.$emit(this.rowEvents.delete, this.index);
          this.$toastr.s(this.$t('admin.team_deleted'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    popup: function (title, message, key) {
      const h = this.$createElement;
      const titleVNode = h('div', {
        domProps: { innerHTML: title },
      });
      const messageVNode = h('div', { class: ['foobar'] }, [
        h('p', { class: ['text-center'] }, [message]),
        h(
          'pre',
          {
            class: ['b-input-group-form-input', 'text-white', 'plaintext'],
            style: { overflowX: 'auto' },
          },
          key,
        ),
      ]);
      this.$bvModal.msgBoxOk([messageVNode], {
        title: [titleVNode],
        buttonSize: 'sm',
        centered: true,
        size: 'md',
        footerClass: 'd-flex justify-content-center',
        bodyClass: 'd-flex flex-column align-items-center',
      });
    },
    createApiKey() {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}/${this.team.uuid}/key`;
      this.axios
        .put(url)
        .then((response) => {
          if (!this.apiKeys) {
            this.apiKeys = {};
          }
          this.$set(this.apiKeys, response.data.publicId, response.data);
          this.popup(
            this.$t('admin.new_api_key_title'),
            this.$t('admin.new_api_key'),
            response.data.key,
          );
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    regenerateApiKey: function (apiKey) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}/key/${apiKey.publicId}`;
      this.axios
        .post(url)
        .then((response) => {
          this.$delete(this.apiKeys, apiKey.publicId);
          this.$set(this.apiKeys, response.data.publicId, response.data);
          this.popup(
            this.$t('admin.regenerate_api_key_title'),
            this.$t('admin.regenerate_api_key'),
            response.data.key,
          );
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    removeApiKey: function (apiKey) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_TEAM}/key/${apiKey.publicId}`;
      this.axios
        .delete(url)
        .then((response) => {
          this.$delete(this.apiKeys, apiKey.publicId);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    updateLdapGroupSelection: function (selections) {
      this.$root.$emit('bv::hide::modal', 'selectLdapGroupModal');
      for (let i = 0; i < selections.length; i++) {
        let selection = selections[i];
        let url = `${this.$api.BASE_URL}/${this.$api.URL_LDAP_MAPPING}`;
        this.axios
          .put(url, {
            team: this.team.uuid,
            dn: selection.dn,
          })
          .then((response) => {
            if (this.ldapGroups === undefined || this.ldapGroups === null) {
              this.ldapGroups = [];
            }
            this.ldapGroups.push(response.data);
            this.ldapGroups.sort();
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
    removeLdapGroupMapping: function (mappingUuid) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_LDAP_MAPPING}/${mappingUuid}`;
      this.axios
        .delete(url)
        .then((response) => {
          let k = [];
          for (let i = 0; i < this.ldapGroups.length; i++) {
            if (this.ldapGroups[i].uuid !== mappingUuid) {
              k.push(this.ldapGroups[i]);
            }
          }
          this.ldapGroups = k;
          this.team.mappedLdapGroups = this.ldapGroups;
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    updateOidcGroupSelection: function (selections) {
      this.$root.$emit('bv::hide::modal', 'selectOidcGroupModal');
      for (let i = 0; i < selections.length; i++) {
        let selection = selections[i];
        let url = `${this.$api.BASE_URL}/${this.$api.URL_OIDC_MAPPING}`;
        this.axios
          .put(url, {
            team: this.team.uuid,
            group: selection.uuid,
          })
          .then((response) => {
            if (
              this.mappedOidcGroups === undefined ||
              this.mappedOidcGroups === null
            ) {
              this.mappedOidcGroups = [];
            }
            this.mappedOidcGroups.push(response.data);
            this.mappedOidcGroups.sort();
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
    removeOidcGroupMapping: function (mappingUuid) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_OIDC_MAPPING}/${mappingUuid}`;
      this.axios
        .delete(url)
        .then((response) => {
          let k = [];
          for (let i = 0; i < this.mappedOidcGroups.length; i++) {
            if (this.mappedOidcGroups[i].uuid !== mappingUuid) {
              k.push(this.mappedOidcGroups[i]);
            }
          }
          this.mappedOidcGroups = k;
          this.team.mappedOidcGroups = this.mappedOidcGroups;
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    updatePermissionSelection: function (selections) {
      this.$root.$emit('bv::hide::modal', 'selectPermissionModal');
      for (let i = 0; i < selections.length; i++) {
        let selection = selections[i];
        let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${selection.name}/team/${this.team.uuid}`;
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
      let url = `${this.$api.BASE_URL}/${this.$api.URL_PERMISSION}/${permission.name}/team/${this.team.uuid}`;
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
    removeUser: function (user) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_USER}/${user.username}/membership`;
      this.axios
        .delete(url, {
          data: {
            uuid: this.team.uuid,
          },
        })
        .then((response) => {
          if (this.managedUsers) {
            let k = [];
            for (let i = 0; i < this.managedUsers.length; i++) {
              if (this.managedUsers[i].username !== user.username) {
                k.push(this.managedUsers[i]);
              }
            }
            this.managedUsers = k;
          }
          if (this.ldapUsers) {
            let k = [];
            for (let i = 0; i < this.ldapUsers.length; i++) {
              if (this.ldapUsers[i].username !== user.username) {
                k.push(this.ldapUsers[i]);
              }
            }
            this.ldapUsers = k;
          }
          if (this.oidcUsers) {
            let k = [];
            for (let i = 0; i < this.oidcUsers.length; i++) {
              if (this.oidcUsers[i].username !== user.username) {
                k.push(this.oidcUsers[i]);
              }
            }
            this.oidcUsers = k;
          }
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    syncVariables: function (team) {
      this.team = team;
      if (team.apiKeys) {
        // Some API server responses don't include API keys.
        // Take care to not wipe existing API keys from the UI in those cases.
        this.apiKeys = this.apiKeysToDict(team.apiKeys);
      }
      this.permissions = team.permissions;
      //this.ldapGroups = team.mappedLdapGroups;
    },
  },
};
</script>
