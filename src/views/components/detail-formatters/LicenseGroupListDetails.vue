<template>
  <div>
    <b-row class="expanded-row">
      <b-col sm="6">
        <b-input-group-form-input
          id="input-license-group-name"
          :label="$t('message.name')"
          input-group-size="mb-3"
          required="true"
          type="text"
          v-model="name"
          lazy="true"
          autofocus="true"
          v-debounce:750ms="updateLicenseGroup"
          :debounce-events="'keyup'"
          :disabled="`${!hasPermission(PERMISSIONS.POLICY_MANAGEMENT)}`"
        />
      </b-col>
      <b-col sm="6"> </b-col>
    </b-row>
    <b-row class="expanded-row">
      <b-col sm="12">
        <b-form-group :label="this.$t('message.licenses')">
          <div class="list-group">
            <span v-for="license in licenses" :key="license.uuid">
              <actionable-list-group-item
                :value="license.name"
                :delete-icon="hasPermission(PERMISSIONS.POLICY_MANAGEMENT)"
                v-on:actionClicked="removeLicense(license)"
              />
            </span>
            <actionable-list-group-item
              v-permission="PERMISSIONS.POLICY_MANAGEMENT"
              :add-icon="true"
              v-on:actionClicked="
                $root.$emit('bv::show::modal', 'selectLicenseModal')
              "
            />
          </div>
        </b-form-group>
        <div style="text-align: right">
          <b-button
            v-permission="PERMISSIONS.POLICY_MANAGEMENT"
            variant="outline-danger"
            @click="deleteLicenseGroup"
            >{{ $t('message.delete_license_group') }}</b-button
          >
        </div>
      </b-col>
    </b-row>
    <select-license-modal v-on:selection="updateLicenseSelection" />
  </div>
</template>

<script>
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput.vue';
import permissionsMixin from '../../../mixins/permissionsMixin';
import ActionableListGroupItem from '../ActionableListGroupItem.vue';
import SelectLicenseModal from '../../policy/SelectLicenseModal.vue';
import i18n from '../../../i18n';
import EventBus from '../../../shared/eventbus';

export default {
  i18n,
  mixins: [permissionsMixin],
  components: {
    ActionableListGroupItem,
    BInputGroupFormInput,
    SelectLicenseModal,
  },
  props: {
    row: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      licenseGroup: this.row,
      name: this.row.name,
      licenses: this.row.licenses,
    };
  },
  methods: {
    updateLicenseGroup: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_GROUP}`;
      this.axios
        .post(url, {
          uuid: this.licenseGroup.uuid,
          name: this.name,
        })
        .then((response) => {
          this.licenseGroup = response.data;
          EventBus.$emit(
            'policyManagement:licenseGroups:rowUpdate',
            this.index,
            this.licenseGroup,
          );
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    deleteLicenseGroup: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_GROUP}/${this.licenseGroup.uuid}`;
      this.axios
        .delete(url)
        .then(() => {
          EventBus.$emit(
            'policyManagement:licenseGroups:rowDeleted',
            this.index,
          );
          this.$toastr.s(this.$t('message.license_group_deleted'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    removeLicense: function (license) {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_GROUP}/${this.licenseGroup.uuid}/license/${license.uuid}`;
      this.axios
        .delete(url)
        .then((response) => {
          this.syncVariables(response.data);
          this.$toastr.s(this.$t('message.updated'));
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    updateLicenseSelection: function (selections) {
      this.$root.$emit('bv::hide::modal', 'selectLicenseModal');
      for (let i = 0; i < selections.length; i++) {
        let selection = selections[i];
        const url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_GROUP}/${this.licenseGroup.uuid}/license/${selection.uuid}`;
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
    syncVariables: function (licenseGroup) {
      this.licenseGroup = licenseGroup;
      this.name = licenseGroup.name;
      this.licenses = licenseGroup.licenses;
    },
  },
};
</script>
