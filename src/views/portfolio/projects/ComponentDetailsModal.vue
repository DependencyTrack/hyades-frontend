<template>
  <b-modal
    id="componentDetailsModal"
    size="lg"
    hide-header-close
    no-stacking
    :title="$t('message.component_details')"
    @show="initializeSelectedLicense"
  >
    <b-tabs class="body-bg-color" style="border: 0; padding: 0">
      <b-tab class="body-bg-color" style="border: 0; padding: 0" active>
        <template v-slot:title
          ><i class="fa fa-cube"></i> {{ $t('message.identity') }}</template
        >
        <b-card>
          <b-input-group-form-input
            id="component-name-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.name"
            lazy="true"
            required="true"
            feedback="true"
            autofocus="false"
            :label="$t('message.component_name')"
            :tooltip="this.$t('message.component_name_desc')"
            :feedback-text="$t('message.required_component_name')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-version-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.version"
            lazy="true"
            required="true"
            feedback="true"
            autofocus="false"
            :label="$t('message.version')"
            :tooltip="this.$t('message.component_version_desc')"
            :feedback-text="$t('message.required_component_version')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-group-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.group"
            required="false"
            :label="$t('message.component_namespace_group_vendor')"
            :tooltip="this.$t('message.component_group_desc')"
            :readonly="!canEditComponent"
          />
          {{ $t('message.component_classification') }}
          <b-badge
            :variant="localComponent.isInternal ? 'tab-total' : 'tab-info'"
            v-b-tooltip.hover
            :title="$t('message.component_classification_desc')"
            >{{ localComponent.isInternal ? 'INTERNAL' : 'EXTERNAL' }}</b-badge
          >
          <p></p>
          <b-input-group-form-input
            id="component-author-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.author"
            required="false"
            :label="$t('message.component_author')"
            :tooltip="this.$t('message.component_author_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-purl-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.purl"
            required="false"
            :label="$t('message.package_url_full')"
            :tooltip="this.$t('message.component_package_url_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-cpe-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.cpe"
            required="false"
            :label="$t('message.cpe_full')"
            :tooltip="$t('message.component_cpe_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-swidTagId-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.swidTagId"
            required="false"
            :label="$t('message.swid_tagid')"
            :tooltip="$t('message.component_swid_tagid_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-uuid"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.uuid"
            lazy="false"
            required="false"
            feedback="false"
            autofocus="false"
            disabled="true"
            :label="$t('message.object_identifier')"
            :tooltip="this.$t('message.object_identifier_desc')"
            :readonly="true"
          />
        </b-card>
      </b-tab>
      <b-tab>
        <template v-slot:title
          ><i class="fa fa-caret-square-o-right"></i>
          {{ $t('message.extended') }}</template
        >
        <b-card>
          <b-input-group-form-select
            id="component-classifier-input"
            required="true"
            v-model="localComponent.classifier"
            :options="availableClassifiers"
            :label="$t('message.classifier')"
            :tooltip="$t('message.component_classifier_desc')"
            :disabled="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-filename-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.filename"
            required="false"
            :label="$t('message.filename')"
            :tooltip="$t('message.component_filename_desc')"
            :readonly="!canEditComponent"
          />
          <b-form-group
            id="component-description-form-group"
            :label="this.$t('message.description')"
            label-for="component-description-input"
          >
            <b-form-textarea
              id="component-description-description"
              v-model="localComponent.description"
              rows="3"
              :readonly="!canEditComponent"
            />
          </b-form-group>
        </b-card>
      </b-tab>
      <b-tab>
        <template v-slot:title
          ><i class="fa fa-balance-scale"></i>
          {{ $t('message.legal') }}</template
        >
        <b-card>
          <b-input-group-form-select
            id="component-license-input"
            required="false"
            v-model="selectedLicense"
            :options="selectableLicenses"
            :label="$t('message.license')"
            :tooltip="$t('message.component_spdx_license_desc')"
            :disabled="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-license-expression"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.licenseExpression"
            required="false"
            :label="$t('message.license_expression')"
            :tooltip="$t('message.component_license_expression_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-license-url-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.licenseUrl"
            required="false"
            :label="$t('message.license_url')"
            :tooltip="$t('message.component_license_url_desc')"
            :readonly="!canEditComponent"
          />
          <b-form-group
            id="component-copyright-form-group"
            :label="this.$t('message.copyright')"
            label-for="component-copyright-input"
          >
            <b-form-textarea
              id="component-description-description"
              v-model="localComponent.copyright"
              rows="3"
              :readonly="!canEditComponent"
            />
          </b-form-group>
        </b-card>
      </b-tab>
      <b-tab>
        <template v-slot:title
          ><i class="fa fa-barcode"></i> {{ $t('message.hashes') }}</template
        >
        <b-card>
          <b-input-group-form-input
            id="component-md5-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.md5"
            required="false"
            :label="$t('hashes.md5')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-sha1-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.sha1"
            required="false"
            :label="$t('hashes.sha_1')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-sha256-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.sha256"
            required="false"
            :label="$t('hashes.sha_256')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-sha512-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.sha512"
            required="false"
            :label="$t('hashes.sha_512')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-sha3256-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.sha3_256"
            required="false"
            :label="$t('hashes.sha3_256')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
          <b-input-group-form-input
            id="component-sha3512-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.sha3_512"
            required="false"
            :label="$t('hashes.sha3_512')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="!canEditComponent"
          />
        </b-card>
      </b-tab>
      <b-tab
        class="body-bg-color"
        style="border: 0; padding: 0"
        v-if="localComponent.supplier"
      >
        <template v-slot:title
          ><i class="fa fa-building-o"></i>
          {{ $t('message.supplier') }}</template
        >
        <b-card>
          <b-input-group-form-input
            id="component-supplier-name-input"
            input-group-size="mb-3"
            type="text"
            v-model="localComponent.supplier.name"
            required="false"
            readonly
            :label="$t('message.supplier_name')"
            :tooltip="this.$t('message.component_supplier_name_desc')"
          />
          <b-form-group
            id="supplierUrlsTable-Fieldset"
            :label="this.$t('message.urls')"
            label-for="supplierUrlsTable"
          >
            <bootstrap-table
              id="supplierUrlsTable"
              ref="supplierUrlsTable"
              :columns="supplierUrlsTableColumns"
              :data="localComponent.supplier.urls"
              :options="supplierUrlsTableOptions"
            >
            </bootstrap-table>
          </b-form-group>
          <b-form-group
            id="supplierContactsTable-Fieldset"
            :label="this.$t('message.contacts')"
            label-for="contactsTable"
          >
            <bootstrap-table
              id="supplierContactsTable"
              ref="supplierContactsTable"
              :columns="supplierContactsTableColumns"
              :data="localComponent.supplier.contacts"
              :options="supplierContactsTableOptions"
            >
            </bootstrap-table>
          </b-form-group>
        </b-card>
      </b-tab>
      <b-tab>
        <template v-slot:title
          ><i class="fa fa-external-link"></i>
          {{ $t('message.external_references') }}</template
        >
        <b-card>
          <bootstrap-table
            ref="referencesTable"
            :columns="referencesTableColumns"
            :data="localComponent.externalReferences"
            :options="referencesTableOptions"
          >
          </bootstrap-table>
        </b-card>
      </b-tab>
      <b-tab>
        <template v-slot:title
          ><i class="fa fa-file-text-o"></i> {{ $t('message.notes') }}</template
        >
        <b-card>
          <b-form-group
            id="component-notes-form-group"
            :label="this.$t('message.notes')"
            label-for="component-notes-input"
          >
            <b-form-textarea
              id="component-notes-description"
              v-model="localComponent.notes"
              rows="3"
              :readonly="!canEditComponent"
            />
          </b-form-group>
        </b-card>
      </b-tab>
    </b-tabs>
    <template v-slot:modal-footer="{ cancel }">
      <b-button
        size="md"
        variant="outline-danger"
        @click="deleteComponent()"
        v-permission="PERMISSIONS.PORTFOLIO_MANAGEMENT"
        >{{ $t('message.delete') }}</b-button
      >
      <b-button
        size="md"
        variant="outline-primary"
        v-b-modal.componentPropertiesModal
        v-permission="PERMISSIONS.PROJECT_READ"
        >{{ $t('message.properties') }}</b-button
      >
      <b-button size="md" variant="secondary" @click="cancel()">{{
        $t('message.close')
      }}</b-button>
      <b-button
        size="md"
        variant="primary"
        @click="updateComponent()"
        v-permission="PERMISSIONS.PORTFOLIO_MANAGEMENT"
        >{{ $t('message.update') }}</b-button
      >
    </template>
  </b-modal>
</template>

<script>
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import ComponentPropertiesModal from './ComponentPropertiesModal.vue';
import permissionsMixin from '../../../mixins/permissionsMixin';
import xssFilters from 'xss-filters';
import common from '@/shared/common';
import { cloneDeep } from 'lodash-es';

export default {
  name: 'ComponentDetailsModal',
  mixins: [permissionsMixin],
  components: {
    BInputGroupFormInput,
    BInputGroupFormSelect,
    ComponentPropertiesModal,
  },
  props: {
    component: Object,
  },
  computed: {
    canEditComponent() {
      return this.hasPermission(this.PERMISSIONS.PORTFOLIO_MANAGEMENT);
    },
  },
  data() {
    return {
      availableClassifiers: [
        {
          value: 'APPLICATION',
          text: this.$i18n.t('message.component_application'),
        },
        {
          value: 'FRAMEWORK',
          text: this.$i18n.t('message.component_framework'),
        },
        { value: 'LIBRARY', text: this.$i18n.t('message.component_library') },
        {
          value: 'CONTAINER',
          text: this.$i18n.t('message.component_container'),
        },
        {
          value: 'OPERATING_SYSTEM',
          text: this.$i18n.t('message.component_operating_system'),
        },
        { value: 'DEVICE', text: this.$i18n.t('message.component_device') },
        { value: 'FIRMWARE', text: this.$i18n.t('message.component_firmware') },
        { value: 'FILE', text: this.$i18n.t('message.component_file') },
      ],
      selectableLicenses: [],
      selectedLicense: '',
      supplierUrlsTableColumns: [
        {
          title: this.$t('message.urls'),
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(row, ''));
          },
        },
      ],
      supplierUrlsTableOptions: {
        search: false,
        showHeader: false,
        showColumns: false,
        showRefresh: false,
        pagination: true,
        silentSort: false,
        sidePagination: 'client',
        queryParamsType: 'pageSize',
        pageList: '[5, 10, 25]',
        pageSize: 5,
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
      },
      supplierContactsTableColumns: [
        {
          title: this.$t('message.name'),
          field: 'name',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.email'),
          field: 'email',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.phone'),
          field: 'phone',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
      ],
      supplierContactsTableOptions: {
        search: false,
        showColumns: false,
        showRefresh: false,
        pagination: true,
        silentSort: false,
        sidePagination: 'client',
        queryParamsType: 'pageSize',
        pageList: '[5, 10, 25]',
        pageSize: 5,
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
      },
      referencesTableColumns: [
        {
          title: this.$t('message.url'),
          field: 'url',
          sortable: false,
          formatter(value, row, index) {
            const url = xssFilters.uriInUnQuotedAttr(
              common.valueWithDefault(value, ''),
            );
            return `<a href="${url}">${xssFilters.inHTMLData(
              common.valueWithDefault(value, ''),
            )}</a>`;
          },
        },
        {
          title: this.$t('message.type'),
          field: 'type',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.comment'),
          field: 'comment',
          sortable: false,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
      ],
      referencesTableOptions: {
        search: false,
        showColumns: false,
        showRefresh: false,
        pagination: true,
        silentSort: false,
        sidePagination: 'client',
        queryParamsType: 'pageSize',
        pageList: '[5, 10, 25]',
        pageSize: 5,
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
      },
      localComponent: {},
    };
  },
  watch: {
    component: {
      handler(newVal) {
        this.localComponent = cloneDeep(newVal);
      },
      immediate: true,
    },
  },
  beforeMount() {
    this.retrieveLicenses();
  },
  beforeUpdate() {
    //console.log(this.component);
  },
  methods: {
    updateComponent: function () {
      this.$root.$emit('bv::hide::modal', 'componentDetailsModal');
      const url = `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}`;
      this.axios
        .post(url, { ...this.localComponent, license: this.selectedLicense })
        .then((response) => {
          this.$emit('componentUpdated', response.data);
          this.$toastr.s(this.$t('message.component_updated'));
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    deleteComponent: function () {
      this.$root.$emit('bv::hide::modal', 'componentDetailsModal');
      const url =
        `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}/` +
        this.component.uuid;
      this.axios
        .delete(url)
        .then((response) => {
          this.$toastr.s(this.$t('message.component_deleted'));
          this.$router.replace({
            path: '/projects/' + this.component.project.uuid,
          });
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    retrieveLicenses: function () {
      const url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_CONCISE}`;
      this.axios
        .get(url)
        .then((response) => {
          // Allow for license to be un-selected.
          this.selectableLicenses.push({ value: '', text: '' });
          for (let i = 0; i < response.data.length; i++) {
            let license = response.data[i];
            this.selectableLicenses.push({
              value: license.licenseId,
              text: license.name,
              uuid: license.uuid,
            });
          }
        })
        .catch((error) => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
    initializeSelectedLicense: function () {
      const resolvedLicense = this.component.resolvedLicense;
      if (!resolvedLicense) {
        this.selectedLicense = null;
        return;
      }
      this.selectedLicense =
        this.selectableLicenses
          .filter((license) => license.uuid == resolvedLicense.uuid)
          .map((license) => license.value)
          .find(() => true) || null;
    },
  },
};
</script>

<style scoped>
.tab-content .tab-pane {
  padding: 0 !important;
}
.tab-content {
  border: 0 !important;
}
.card {
  border: 0;
  padding: 0;
  margin-bottom: 0;
}
</style>
