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
            v-model="component.name"
            lazy="true"
            required="true"
            feedback="true"
            autofocus="false"
            :label="$t('message.component_name')"
            :tooltip="this.$t('message.component_name_desc')"
            :feedback-text="$t('message.required_component_name')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-version-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.version"
            lazy="true"
            required="true"
            feedback="true"
            autofocus="false"
            :label="$t('message.version')"
            :tooltip="this.$t('message.component_version_desc')"
            :feedback-text="$t('message.required_component_version')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-group-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.group"
            required="false"
            :label="$t('message.component_namespace_group_vendor')"
            :tooltip="this.$t('message.component_group_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          {{ $t('message.component_classification') }}
          <b-badge
            :variant="component.isInternal ? 'tab-total' : 'tab-info'"
            v-b-tooltip.hover
            :title="$t('message.component_classification_desc')"
            >{{ component.isInternal ? 'INTERNAL' : 'EXTERNAL' }}</b-badge
          >
          <p></p>
          <b-input-group-form-input
            id="component-author-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.author"
            required="false"
            :label="$t('message.component_author')"
            :tooltip="this.$t('message.component_author_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-purl-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.purl"
            required="false"
            :label="$t('message.package_url_full')"
            :tooltip="this.$t('message.component_package_url_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-cpe-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.cpe"
            required="false"
            :label="$t('message.cpe_full')"
            :tooltip="$t('message.component_cpe_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-swidTagId-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.swidTagId"
            required="false"
            :label="$t('message.swid_tagid')"
            :tooltip="$t('message.component_swid_tagid_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-uuid"
            input-group-size="mb-3"
            type="text"
            v-model="component.uuid"
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
            v-model="component.classifier"
            :options="availableClassifiers"
            :label="$t('message.classifier')"
            :tooltip="$t('message.component_classifier_desc')"
            :disabled="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-filename-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.filename"
            required="false"
            :label="$t('message.filename')"
            :tooltip="$t('message.component_filename_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-form-group
            id="component-description-form-group"
            :label="this.$t('message.description')"
            label-for="component-description-input"
          >
            <b-form-textarea
              id="component-description-description"
              v-model="component.description"
              rows="3"
              :readonly="
                this.isNotPermitted([
                  PERMISSIONS.PORTFOLIO_MANAGEMENT,
                  PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
                ])
              "
            />
          </b-form-group>
        </b-card>
      </b-tab>
      <div v-if="component.cryptoAssetProperties != undefined">
        <b-tab>
          <template v-slot:title
            ><i class="fa fa-lock"></i>
            {{ $t('message.component_cryptographic_properties') }}</template
          >
          <b-card>
            <b-input-group-form-select
              id="component-assetType-input"
              required="true"
              v-model="component.cryptoAssetProperties.assetType"
              :options="assetTypeOptions"
              :label="$t('message.crypto_assetType')"
              :tooltip="$t('message.crypto_assetType_desc')"
              :disabled="this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)"
            />
            <b-input-group-form-input
              id="component-oid-input"
              input-group-size="mb-3"
              type="text"
              v-model="component.cryptoAssetProperties.oid"
              lazy="true"
              required="false"
              feedback="true"
              autofocus="false"
              :label="$t('message.crypto_oid')"
              :tooltip="this.$t('message.crypto_oid_desc')"
              :readonly="this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)"
            />
            <div
              v-if="component.cryptoAssetProperties.assetType === 'algorithm'"
            >
              <b-input-group-form-select
                id="component-algo-primitive-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties.primitive
                "
                :options="primitiveOptions"
                :label="$t('message.crypto_algo_primitive')"
                :tooltip="$t('message.crypto_algo_primitive_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-algo-parameter-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties
                    .parameterSetIdentifier
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_algo_parameterSetId')"
                :tooltip="this.$t('message.crypto_algo_parameterSetId_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-algo-curve-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties.curve
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_algo_curve')"
                :tooltip="this.$t('message.crypto_algo_curve_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-algo-execEnv-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties
                    .executionEnvironment
                "
                :options="execEnvOptions"
                :label="$t('message.crypto_algo_execEnv')"
                :tooltip="$t('message.crypto_algo_execEnv_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-algo-implPlfm-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties
                    .implementationPlatform
                "
                :options="implPflmOptions"
                :label="$t('message.crypto_algo_implPlfm')"
                :tooltip="$t('message.crypto_algo_implPlfm_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-algo-certLvl-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties
                    .certificationLevel
                "
                :options="certLvlOptions"
                :label="$t('message.crypto_algo_certLvl')"
                :tooltip="$t('message.crypto_algo_certLvl_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-algo-mode-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties.mode
                "
                :options="modeOptions"
                :label="$t('message.crypto_algo_mode')"
                :tooltip="$t('message.crypto_algo_mode_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-algo-padding-input"
                required="false"
                v-model="
                  component.cryptoAssetProperties.algorithmProperties.padding
                "
                :options="paddingOptions"
                :label="$t('message.crypto_algo_padding')"
                :tooltip="$t('message.crypto_algo_padding_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select-multiple
                id="component-algo-cryptoFunctions-input"
                required="false"
                v-model="
                  this.component.cryptoAssetProperties.algorithmProperties
                    .cryptoFunctions
                "
                :options="cryptoFunctionOptions"
                :label="$t('message.crypto_algo_cryptoFunctions')"
                :tooltip="$t('message.crypto_algo_cryptoFunctions_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input-number
                id="component-algo-classicalSL-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  this.component.cryptoAssetProperties.algorithmProperties
                    .classicalSecurityLevel
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_algo_classicalSL')"
                :tooltip="this.$t('message.crypto_algo_classicalSL_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input-number
                id="component-algo-nistQSL-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  this.component.cryptoAssetProperties.algorithmProperties
                    .nistQuantumSecurityLevel
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_algo_nistQSL')"
                :tooltip="this.$t('message.crypto_algo_nistQSL_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
            </div>
            <div
              v-else-if="
                component.cryptoAssetProperties.assetType === 'certificate'
              "
            >
              <b-input-group-form-input
                id="component-cert-subject-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .subjectName
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_subject')"
                :tooltip="this.$t('message.crypto_cert_subject_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-issuer-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .issuerName
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_issuer')"
                :tooltip="this.$t('message.crypto_cert_issuer_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-notValidBefore-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .notValidBefore
                "
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_notValidBefore')"
                :tooltip="this.$t('message.crypto_cert_notValidBefore_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-notValidAfter-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .notValidAfter
                "
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_notValidAfter')"
                :tooltip="this.$t('message.crypto_cert_notValidAfter_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-signAlgoRef-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .signatureAlgorithmRef
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_signAlgoRef')"
                :tooltip="this.$t('message.crypto_cert_signAlgoRef_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-subjPubKeyRef-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .subjectPublicKeyRef
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_subjPubKeyRef')"
                :tooltip="this.$t('message.crypto_cert_subjPubKeyRef_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-format-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .certificateFormat
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_format')"
                :tooltip="this.$t('message.crypto_cert_format_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-cert-ext-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.certificateProperties
                    .certificateExtension
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_cert_ext')"
                :tooltip="this.$t('message.crypto_cert_ext_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
            </div>
            <div
              v-else-if="
                component.cryptoAssetProperties.assetType ===
                'related-crypto-material'
              "
            >
              <b-input-group-form-select
                id="component-rcm-type-input"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties.type
                "
                required="false"
                :options="typeOptions"
                :label="$t('message.crypto_rcm_type')"
                :tooltip="$t('message.crypto_rcm_type_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-id-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .identifier
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_id')"
                :tooltip="this.$t('message.crypto_rcm_id_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-rcm-state-input"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .state
                "
                required="false"
                :options="stateOptions"
                :label="$t('message.crypto_rcm_state')"
                :tooltip="$t('message.crypto_rcm_state_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-algoRef-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .algorithmRef
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_algoRef')"
                :tooltip="this.$t('message.crypto_rcm_algoRef_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-cdate-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .creationDate
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_cdate')"
                :tooltip="this.$t('message.crypto_rcm_cdate_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-adate-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .activationDate
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_adate')"
                :tooltip="this.$t('message.crypto_rcm_adate_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-udate-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .updateDate
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_udate')"
                :tooltip="this.$t('message.crypto_rcm_udate_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-edate-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .expirationDate
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_edate')"
                :tooltip="this.$t('message.crypto_rcm_edate_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-value-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .value
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_value')"
                :tooltip="this.$t('message.crypto_rcm_value_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input-number
                id="component-rcm-size-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  this.component.cryptoAssetProperties.relatedMaterialProperties
                    .size
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_size')"
                :tooltip="this.$t('message.crypto_rcm_size_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-format-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .format
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_format')"
                :tooltip="this.$t('message.crypto_rcm_format_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-select
                id="component-rcm-secByMech-input"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .securedBy.mechanism
                "
                required="false"
                :options="mechanismOptions"
                :label="$t('message.crypto_rcm_secByMech')"
                :tooltip="$t('message.crypto_rcm_secByMech_desc')"
                :disabled="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-rcm-secByAlgoRef-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.relatedMaterialProperties
                    .securedBy.algorithmRef
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_rcm_secByAlgoRef')"
                :tooltip="this.$t('message.crypto_rcm_secByAlgoRef_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
            </div>
            <div
              v-else-if="
                component.cryptoAssetProperties.assetType === 'protocol'
              "
            >
              <b-input-group-form-select
                id="component-prot-type-input"
                v-model="
                  component.cryptoAssetProperties.protocolProperties.type
                "
                :options="protocolTypeOptions"
                :label="$t('message.crypto_prot_type')"
                :tooltip="this.$t('message.crypto_prot_type_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-version-input"
                input-group-size="mb-3"
                type="text"
                v-model="
                  component.cryptoAssetProperties.protocolProperties.version
                "
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_version')"
                :tooltip="this.$t('message.crypto_prot_version_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.cipherSuites"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_cipherSuites')"
                :tooltip="$t('message.crypto_prot_cipherSuites_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Encr"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Encr')"
                :tooltip="$t('message.crypto_prot_ikev2Encr_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Prf"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Prf')"
                :tooltip="$t('message.crypto_prot_ikev2Prf_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Integ"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Integ')"
                :tooltip="$t('message.crypto_prot_ikev2Integ_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Ke"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Ke')"
                :tooltip="$t('message.crypto_prot_ikev2Ke_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Esn"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Esn')"
                :tooltip="$t('message.crypto_prot_ikev2Esn_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <b-input-group-form-input
                id="component-prot-ciphersuites-input"
                input-group-size="mb-3"
                type="text"
                v-model="this.ikev2Auth"
                lazy="true"
                required="false"
                feedback="true"
                autofocus="false"
                :label="$t('message.crypto_prot_ikev2Auth')"
                :tooltip="$t('message.crypto_prot_ikev2Auth_desc')"
                :readonly="
                  this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)
                "
              />
              <!--b-input-group-form-input
              id="component-prot-cryptoRefs-input"
              input-group-size="mb-3"
              type="text"
              v-model="component.cryptoAssetProperties.protocolProperties.cryptoRefs"
              lazy="true"
              required="false"
              feedback="true"
              autofocus="false"
              :label="$t('message.crypto_prot_cryptoRefs')"
              :tooltip="this.$t('message.crypto_prot_cryptoRefs_desc')"
              :readonly="this.isNotPermitted(PERMISSIONS.PORTFOLIO_MANAGEMENT)"
            /-->
            </div>
          </b-card>
        </b-tab>
      </div>
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
            :disabled="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-license-expression"
            input-group-size="mb-3"
            type="text"
            v-model="component.licenseExpression"
            required="false"
            :label="$t('message.license_expression')"
            :tooltip="$t('message.component_license_expression_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-license-url-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.licenseUrl"
            required="false"
            :label="$t('message.license_url')"
            :tooltip="$t('message.component_license_url_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-form-group
            id="component-copyright-form-group"
            :label="this.$t('message.copyright')"
            label-for="component-copyright-input"
          >
            <b-form-textarea
              id="component-description-description"
              v-model="component.copyright"
              rows="3"
              :readonly="
                this.isNotPermitted([
                  PERMISSIONS.PORTFOLIO_MANAGEMENT,
                  PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
                ])
              "
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
            v-model="component.md5"
            required="false"
            :label="$t('hashes.md5')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-sha1-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.sha1"
            required="false"
            :label="$t('hashes.sha_1')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-sha256-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.sha256"
            required="false"
            :label="$t('hashes.sha_256')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-sha512-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.sha512"
            required="false"
            :label="$t('hashes.sha_512')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-sha3256-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.sha3_256"
            required="false"
            :label="$t('hashes.sha3_256')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
          <b-input-group-form-input
            id="component-sha3512-input"
            input-group-size="mb-3"
            type="text"
            v-model="component.sha3_512"
            required="false"
            :label="$t('hashes.sha3_512')"
            :tooltip="$t('message.component_hash_desc')"
            :readonly="
              this.isNotPermitted([
                PERMISSIONS.PORTFOLIO_MANAGEMENT,
                PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
              ])
            "
          />
        </b-card>
      </b-tab>
      <b-tab
        class="body-bg-color"
        style="border: 0; padding: 0"
        v-if="component.supplier"
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
            v-model="component.supplier.name"
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
              :data="component.supplier.urls"
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
              :data="component.supplier.contacts"
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
            :data="component.externalReferences"
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
              v-model="component.notes"
              rows="3"
              :readonly="
                this.isNotPermitted([
                  PERMISSIONS.PORTFOLIO_MANAGEMENT,
                  PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
                ])
              "
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
        v-permission:or="[
          PERMISSIONS.PORTFOLIO_MANAGEMENT,
          PERMISSIONS.PORTFOLIO_MANAGEMENT_DELETE,
        ]"
        >{{ $t('message.delete') }}</b-button
      >
      <b-button
        size="md"
        variant="outline-primary"
        v-b-modal.componentPropertiesModal
        v-permission:or="[
          PERMISSIONS.PORTFOLIO_MANAGEMENT,
          PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
        ]"
        >{{ $t('message.properties') }}</b-button
      >
      <b-button size="md" variant="secondary" @click="cancel()">{{
        $t('message.close')
      }}</b-button>
      <b-button
        size="md"
        variant="primary"
        @click="updateComponent()"
        v-permission:or="[
          PERMISSIONS.PORTFOLIO_MANAGEMENT,
          PERMISSIONS.PORTFOLIO_MANAGEMENT_UPDATE,
        ]"
        >{{ $t('message.update') }}</b-button
      >
    </template>
  </b-modal>
</template>

<script>
import BInputGroupFormInput from '../../../forms/BInputGroupFormInput';
import BInputGroupFormInputNumber from '../../../forms/BInputGroupFormInputNumber';
import BInputGroupFormSelect from '../../../forms/BInputGroupFormSelect';
import BInputGroupFormSelectMultiple from '../../../forms/BInputGroupFormSelectMultiple';
import ComponentPropertiesModal from './ComponentPropertiesModal.vue';
import permissionsMixin from '../../../mixins/permissionsMixin';
import xssFilters from 'xss-filters';
import common from '@/shared/common';

export default {
  name: 'ComponentDetailsModal',
  mixins: [permissionsMixin],
  components: {
    BInputGroupFormInput,
    BInputGroupFormInputNumber,
    BInputGroupFormSelect,
    BInputGroupFormSelectMultiple,
    ComponentPropertiesModal,
  },
  props: {
    component: Object,
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
        {
          value: 'CRYPTOGRAPHIC_ASSET',
          text: this.$i18n.t('message.component_cryptographic_asset'),
        },
      ],
      assetTypeOptions: [
        { value: 'algorithm', text: 'Algorithm' },
        { value: 'certificate', text: 'Certificate' },
        { value: 'related-crypto-material', text: 'Related Crypto Material' },
        { value: 'protocol', text: 'Protocol' },
      ],
      primitiveOptions: [
        { value: 'drbg', text: 'Deterministic Random Bit Generator' },
        { value: 'mac', text: 'Message Authentication Code' },
        { value: 'block-cipher', text: 'Block Cipher' },
        { value: 'stream-cipher', text: 'Stream Cipher' },
        { value: 'signature', text: 'Signature' },
        { value: 'hash', text: 'Hash' },
        { value: 'pke', text: 'Public Key Encryption' },
        { value: 'xof', text: 'XOF' },
        { value: 'kdf', text: 'Key Derivation Function' },
        { value: 'key-agree', text: 'Key Agreement' },
        { value: 'kem', text: 'Key Encapsulation Mechanism' },
        { value: 'ae', text: 'Authenticated Encryption' },
        { value: 'other', text: 'Other' },
      ],
      execEnvOptions: [
        { value: 'software-plain-ram', text: 'Plain RAM Software' },
        { value: 'software-encrypted-ram', text: 'Encrypted RAM Software' },
        {
          value: 'software-tee',
          text: 'Software in Trusted Execution Environment',
        },
        { value: 'hardware', text: 'Hardware' },
        { value: 'other', text: 'Other' },
      ],
      implPflmOptions: [
        { value: 'generic', text: 'generic' },
        { value: 'x86_32', text: 'x86_32' },
        { value: 'x86_64', text: 'X86_64' },
        { value: 'armv7-a', text: 'armv7-a' },
        { value: 'armv7-m', text: 'armv7-m' },
        { value: 'armv8-a', text: 'armv8-a' },
        { value: 'armv8-m', text: 'armv8-m' },
        { value: 'armv9-a', text: 'armv9-a' },
        { value: 'armv9-m', text: 'armv9-m' },
        { value: 's390x', text: 's390x' },
        { value: 'ppc64', text: 'ppc64' },
        { value: 'ppc64le', text: 'ppc64le' },
        { value: 'other', text: 'Other' },
      ],
      certLvlOptions: [
        { value: 'none', text: 'None' },
        { value: 'fips140-1-l1', text: 'FIPS 140-1 Level 1' },
        { value: 'fips140-1-l2', text: 'FIPS 140-1 Level 2' },
        { value: 'fips140-1-l3', text: 'FIPS 140-1 Level 3' },
        { value: 'fips140-1-l4', text: 'FIPS 140-1 Level 4' },
        { value: 'fips140-2-l1', text: 'FIPS 140-2 Level 1' },
        { value: 'fips140-2-l2', text: 'FIPS 140-2 Level 2' },
        { value: 'fips140-2-l3', text: 'FIPS 140-2 Level 3' },
        { value: 'fips140-2-l4', text: 'FIPS 140-2 Level 4' },
        { value: 'fips140-3-l1', text: 'FIPS 140-3 Level 1' },
        { value: 'fips140-3-l2', text: 'FIPS 140-3 Level 2' },
        { value: 'fips140-3-l3', text: 'FIPS 140-3 Level 3' },
        { value: 'fips140-3-l4', text: 'FIPS 140-3 Level 4' },
        {
          value: 'cc-eal1',
          text: 'Common Criteria - Evaluation Assurance Level 1',
        },
        {
          value: 'cc-eal1+',
          text: 'Common Criteria - Evaluation Assurance Level 1 (Augmented)',
        },
        {
          value: 'cc-eal2',
          text: 'Common Criteria - Evaluation Assurance Level 2',
        },
        {
          value: 'cc-eal2+',
          text: 'Common Criteria - Evaluation Assurance Level 2 (Augmented)',
        },
        {
          value: 'cc-eal3',
          text: 'Common Criteria - Evaluation Assurance Level 3',
        },
        {
          value: 'cc-eal3+',
          text: 'Common Criteria - Evaluation Assurance Level 3 (Augmented)',
        },
        {
          value: 'cc-eal4',
          text: 'Common Criteria - Evaluation Assurance Level 4',
        },
        {
          value: 'cc-eal4+',
          text: 'Common Criteria - Evaluation Assurance Level 4 (Augmented)',
        },
        {
          value: 'cc-eal5',
          text: 'Common Criteria - Evaluation Assurance Level 5',
        },
        {
          value: 'cc-eal5+',
          text: 'Common Criteria - Evaluation Assurance Level 5 (Augmented)',
        },
        {
          value: 'cc-eal6',
          text: 'Common Criteria - Evaluation Assurance Level 6',
        },
        {
          value: 'cc-eal6+',
          text: 'Common Criteria - Evaluation Assurance Level 6 (Augmented)',
        },
        {
          value: 'cc-eal7',
          text: 'Common Criteria - Evaluation Assurance Level 7',
        },
        {
          value: 'cc-eal7+',
          text: 'Common Criteria - Evaluation Assurance Level 7 (Augmented)',
        },
        { value: 'other', text: 'Other' },
      ],
      modeOptions: [
        { value: 'cbc', text: 'Cipher Block Chaining' },
        { value: 'ecb', text: 'Electronic Codebook' },
        { value: 'gcm', text: 'Galois/counter' },
        { value: 'ofb', text: 'Output Feedback' },
        { value: 'ctr', text: 'Counter' },
        { value: 'other', text: 'Other' },
      ],
      paddingOptions: [
        {
          value: 'pkcs5',
          text: 'Public Key Cryptography Standard: Password-Based Cryptography',
        },
        {
          value: 'pkcs7',
          text: 'Public Key Cryptography Standard: Cryptographic Message Syntax',
        },
        {
          value: 'pkcs1v15',
          text: 'Public Key Cryptography Standard: RSA Cryptography v1.5r',
        },
        { value: 'oaep', text: 'Optimal Asymmetric Encryption Padding' },
        { value: 'raw', text: 'Raw' },
        { value: 'other', text: 'Other' },
      ],
      cryptoFunctionOptions: [
        { value: 'generate', text: 'generate' },
        { value: 'keygen', text: 'keygen' },
        { value: 'encrypt', text: 'encrypt' },
        { value: 'decrypt', text: 'decrypt' },
        { value: 'digest', text: 'digest' },
        { value: 'tag', text: 'tag' },
        { value: 'keyderive', text: 'keyderive' },
        { value: 'sign', text: 'sign' },
        { value: 'verify', text: 'verify' },
        { value: 'encapsulate', text: 'encapsulate' },
        { value: 'decapsulate', text: 'decapsulate' },
        { value: 'other', text: 'Other' },
      ],
      typeOptions: [
        { value: 'private_key', text: 'Private Key (asymmetric)' },
        { value: 'public-key', text: 'Public Key (asymmetric)' },
        { value: 'secret-key', text: 'Secret Key (symmetric)' },
        { value: 'key', text: 'Key' },
        { value: 'ciphertext', text: 'Ciphertext' },
        { value: 'signature', text: 'Signature' },
        { value: 'digest', text: 'Digest' },
        { value: 'initialization-vector', text: 'Initialization Vector' },
        { value: 'seed', text: 'Seed' },
        { value: 'salt', text: 'Salt' },
        { value: 'shared-secret', text: 'Shared Secret' },
        { value: 'tag', text: 'Authentication Tag' },
        { value: 'additional-data', text: 'Additional Data' },
        { value: 'password', text: 'Password' },
        { value: 'credential', text: 'Credential' },
        { value: 'token', text: 'Token' },
        { value: 'other', text: 'Other' },
      ],
      stateOptions: [
        { value: 'pre-activation', text: 'pre-activation' },
        { value: 'active', text: 'active' },
        { value: 'suspended', text: 'suspended' },
        { value: 'deactivated', text: 'deactivated' },
        { value: 'compromised', text: 'compromised' },
        { value: 'destroyed', text: 'destroyed' },
      ],
      mechanismOptions: [
        { value: 'HSM', text: 'Hardware Secirity Module' },
        { value: 'TPM', text: 'Trusted Platform Module' },
        { value: 'SGX', text: 'Software Guard Extensions' },
        { value: 'Software', text: 'Software' },
      ],
      protocolTypeOptions: [
        { value: 'tls', text: 'Transport Layer Security' },
        { value: 'ssh', text: 'Secure Shell' },
        { value: 'ipsec', text: 'Internet Protocol Security' },
        { value: 'ike', text: 'Internet Key Exchange' },
        { value: 'sstp', text: 'Secure Socket Tunneling Protocol' },
        { value: 'wpa', text: 'Wi-Fi Protected Access' },
        { value: 'other', text: 'Other' },
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
            let url = xssFilters.uriInUnQuotedAttr(
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
    };
  },
  beforeMount() {
    this.retrieveLicenses();
  },
  beforeUpdate() {
    //console.log(this.component);
    if (
      this.component.hasOwnProperty('cryptoAssetProperties') &&
      this.component.cryptoAssetProperties.hasOwnProperty('protocolProperties')
    ) {
      let pp = this.component.cryptoAssetProperties.protocolProperties;
      if (pp.hasOwnProperty('cipherSuites')) {
        this.cipherSuites = pp.cipherSuites.map((a) => a.name).join(', ');
      }

      if (pp.hasOwnProperty('ikev2Types')) {
        if (pp.ikev2Types.hasOwnProperty('encr')) {
          this.ikev2Encr = pp.ikev2Types.encr.join(', ');
        }
        if (pp.ikev2Types.hasOwnProperty('prf')) {
          this.ikev2Prf = pp.ikev2Types.prf.join(', ');
        }
        if (pp.ikev2Types.hasOwnProperty('integ')) {
          this.ikev2Integ = pp.ikev2Types.integ.join(', ');
        }
        if (pp.ikev2Types.hasOwnProperty('ke')) {
          this.ikev2Ke = pp.ikev2Types.ke.join(', ');
        }
        if (pp.ikev2Types.hasOwnProperty('esn')) {
          this.ikev2Esn = pp.ikev2Types.esn.join(', ');
        }
        if (pp.ikev2Types.hasOwnProperty('auth')) {
          this.ikev2Auth = pp.ikev2Types.auth.join(', ');
        }
      }
    }
  },
  methods: {
    updateComponent: function () {
      this.$root.$emit('bv::hide::modal', 'componentDetailsModal');
      let url = `${this.$api.BASE_URL}/${this.$api.URL_COMPONENT}`;
      this.axios
        .post(url, {
          uuid: this.component.uuid,
          supplier: this.component.supplier,
          name: this.component.name,
          version: this.component.version,
          group: this.component.group,
          author: this.component.author,
          description: this.component.description,
          license: this.selectedLicense,
          licenseExpression: this.component.licenseExpression,
          licenseUrl: this.component.licenseUrl,
          filename: this.component.filename,
          classifier: this.component.classifier,
          purl: this.component.purl,
          cpe: this.component.cpe,
          swidTagId: this.component.swidTagId,
          copyright: this.component.copyright,
          md5: this.component.md5,
          sha1: this.component.sha1,
          sha256: this.component.sha256,
          sha512: this.component.sha512,
          sha3_256: this.component.sha3_256,
          sha3_512: this.component.sha3_512,
          notes: this.component.notes,
        })
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
      let url =
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
      let url = `${this.$api.BASE_URL}/${this.$api.URL_LICENSE_CONCISE}`;
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
