<template>
  <b-row class="expanded-row">
    <b-col sm="6">
      <div
        v-if="
          finding.vulnerability.aliases &&
          finding.vulnerability.aliases.length > 0
        "
      >
        <label>Aliases</label>
        <b-card class="font-weight-bold">
          <b-card-text>
            <span
              v-for="alias in resolveVulnAliases(
                finding.vulnerability.aliases,
                finding.vulnerability.source,
              )"
              :key="alias.vulnId"
            >
              <b-link
                style="margin-right: 1rem"
                :href="'/vulnerabilities/' + alias.source + '/' + alias.vulnId"
                >{{ alias.vulnId }}</b-link
              >
            </span>
          </b-card-text>
        </b-card>
      </div>
      <b-form-group
        v-if="finding.vulnerability.title"
        id="fieldset-1"
        :label="this.$t('message.title')"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          :value="finding.vulnerability.title"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="finding.vulnerability.subtitle"
        id="fieldset-2"
        :label="this.$t('message.subtitle')"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          :value="finding.vulnerability.subtitle"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="finding.vulnerability.description"
        id="fieldset-3"
        :label="this.$t('message.description')"
        label-for="input-3"
      >
        <b-form-textarea
          id="input-3"
          :value="finding.vulnerability.description"
          rows="7"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="finding.vulnerability.recommendation"
        id="fieldset-4"
        :label="this.$t('message.recommendation')"
        label-for="input-4"
      >
        <b-form-textarea
          id="input-4"
          :value="finding.vulnerability.recommendation"
          rows="7"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="finding.vulnerability.cvssV2Vector"
        id="fieldset-5"
        :label="this.$t('message.cvss_v2_vector')"
        label-for="input-5"
      >
        <b-form-input
          id="input-5"
          :value="finding.vulnerability.cvssV2Vector"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="finding.vulnerability.cvssV3Vector"
        id="fieldset-6"
        :label="this.$t('message.cvss_v3_vector')"
        label-for="input-6"
      >
        <b-form-input
          id="input-6"
          :value="finding.vulnerability.cvssV3Vector"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <b-form-group
        id="fieldset-7"
        :label="this.$t('message.audit_trail')"
        label-for="auditTrailField"
      >
        <b-form-textarea
          id="auditTrailField"
          v-model="auditTrail"
          rows="7"
          class="form-control disabled"
          readonly
          trim
        />
      </b-form-group>
      <b-form-group
        id="fieldset-8"
        v-if="
          this.isPermitted([
            this.PERMISSIONS.VULNERABILITY_ANALYSIS,
            this.PERMISSIONS.VULNERABILITY_ANALYSIS_UPDATE,
          ])
        "
        :label="this.$t('message.comment')"
        label-for="input-8"
      >
        <b-form-textarea
          id="input-8"
          v-model="comment"
          rows="4"
          class="form-control"
          trim
        />
        <div class="pull-right">
          <b-button size="sm" variant="outline-primary" @click="addComment"
            ><span class="fa fa-comment-o"></span>
            {{ this.$t('message.add_comment') }}</b-button
          >
        </div>
      </b-form-group>
      <b-form-group
        id="fieldset-9"
        v-if="
          this.isPermitted([
            this.PERMISSIONS.VULNERABILITY_ANALYSIS,
            this.PERMISSIONS.VULNERABILITY_ANALYSIS_UPDATE,
          ])
        "
        :label="this.$t('message.analysis')"
        label-for="input-9"
      >
        <b-input-group id="input-9">
          <b-form-select
            v-model="analysisState"
            :options="analysisChoices"
            @change="makeAnalysis"
            style="flex: 0 1 auto; width: auto; margin-right: 2rem"
            v-b-tooltip.hover
            :title="this.$t('message.analysis_tooltip')"
          />
          <bootstrap-toggle
            v-model="isSuppressed"
            :options="{
              on: this.$t('message.suppressed'),
              off: this.$t('message.suppress'),
              onstyle: 'warning',
              offstyle: 'outline-disabled',
            }"
            :disabled="analysisState === null"
          />
        </b-input-group>
      </b-form-group>
      <b-row
        v-if="
          this.isPermitted([
            this.PERMISSIONS.VULNERABILITY_ANALYSIS,
            this.PERMISSIONS.VULNERABILITY_ANALYSIS_UPDATE,
          ])
        "
      >
        <b-col sm="6">
          <b-form-group
            id="fieldset-10"
            :label="this.$t('message.justification')"
            label-for="input-10"
          >
            <b-input-group id="input-10">
              <b-form-select
                v-model="analysisJustification"
                :options="justificationChoices"
                @change="makeAnalysis"
                :disabled="
                  analysisState === null || analysisState !== 'NOT_AFFECTED'
                "
                v-b-tooltip.hover
                :title="$t('message.justification_tooltip')"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            id="fieldset-11"
            :label="this.$t('message.response')"
            label-for="input-11"
          >
            <b-input-group id="input-11">
              <b-form-select
                v-model="analysisResponse"
                :options="responseChoices"
                :disabled="analysisState === null"
                @change="makeAnalysis"
                v-b-tooltip.hover
                :title="this.$t('message.response_tooltip')"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group
        id="fieldset-12"
        v-if="
          this.isPermitted([
            this.PERMISSIONS.VULNERABILITY_ANALYSIS,
            this.PERMISSIONS.VULNERABILITY_ANALYSIS_UPDATE,
          ])
        "
        :label="this.$t('message.details')"
        label-for="analysisDetailsField"
      >
        <b-form-textarea
          id="analysisDetailsField"
          v-model="analysisDetails"
          rows="7"
          class="form-control"
          :disabled="
            analysisState === null ||
            !this.isPermitted([
              this.PERMISSIONS.VULNERABILITY_ANALYSIS,
              this.PERMISSIONS.VULNERABILITY_ANALYSIS_UPDATE,
            ])
          "
          v-b-tooltip.hover
          :title="this.$t('message.analysis_details_tooltip')"
        />
        <div class="pull-right">
          <b-button
            v-if="this.isPermitted(this.PERMISSIONS.VULNERABILITY_ANALYSIS)"
            :disabled="analysisState === null"
            size="sm"
            variant="outline-primary"
            @click="makeAnalysis"
            ><span class="fa fa-comment-o"></span>
            {{ this.$t('message.update_details') }}</b-button
          >
        </div>
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
import common from '@/shared/common';
import BootstrapToggle from 'vue-bootstrap-toggle';
import permissionsMixin from '@/mixins/permissionsMixin';

export default {
  props: {
    finding: Object,
    projectUuid: String,
  },
  data() {
    return {
      auditTrail: null,
      comment: null,
      isSuppressed: !!this.finding?.analysis?.isSuppressed,
      analysisChoices: [
        { value: 'NOT_SET', text: this.$t('message.not_set') },
        { value: 'EXPLOITABLE', text: this.$t('message.exploitable') },
        { value: 'IN_TRIAGE', text: this.$t('message.in_triage') },
        { value: 'RESOLVED', text: this.$t('message.resolved') },
        { value: 'FALSE_POSITIVE', text: this.$t('message.false_positive') },
        { value: 'NOT_AFFECTED', text: this.$t('message.not_affected') },
      ],
      justificationChoices: [
        { value: 'NOT_SET', text: this.$t('message.not_set') },
        {
          value: 'CODE_NOT_PRESENT',
          text: this.$t('message.code_not_present'),
        },
        {
          value: 'CODE_NOT_REACHABLE',
          text: this.$t('message.code_not_reachable'),
        },
        {
          value: 'REQUIRES_CONFIGURATION',
          text: this.$t('message.requires_configuration'),
        },
        {
          value: 'REQUIRES_DEPENDENCY',
          text: this.$t('message.requires_dependency'),
        },
        {
          value: 'REQUIRES_ENVIRONMENT',
          text: this.$t('message.requires_environment'),
        },
        {
          value: 'PROTECTED_BY_COMPILER',
          text: this.$t('message.protected_by_compiler'),
        },
        {
          value: 'PROTECTED_AT_RUNTIME',
          text: this.$t('message.protected_at_runtime'),
        },
        {
          value: 'PROTECTED_AT_PERIMETER',
          text: this.$t('message.protected_at_perimeter'),
        },
        {
          value: 'PROTECTED_BY_MITIGATING_CONTROL',
          text: this.$t('message.protected_by_mitigating_control'),
        },
      ],
      responseChoices: [
        { value: 'NOT_SET', text: this.$t('message.not_set') },
        { value: 'CAN_NOT_FIX', text: this.$t('message.can_not_fix') },
        { value: 'WILL_NOT_FIX', text: this.$t('message.will_not_fix') },
        { value: 'UPDATE', text: this.$t('message.update') },
        { value: 'ROLLBACK', text: this.$t('message.rollback') },
        {
          value: 'WORKAROUND_AVAILABLE',
          text: this.$t('message.workaround_available'),
        },
      ],
      analysisState: null,
      analysisJustification: null,
      analysisResponse: null,
      analysisDetails: null,
    };
  },
  watch: {
    isSuppressed: function (currentValue, oldValue) {
      if (oldValue != null) {
        this.callRestEndpoint(
          this.analysisState,
          this.analysisJustification,
          this.analysisResponse,
          null,
          null,
          currentValue,
        );
      }
    },
  },
  mixins: [permissionsMixin],
  methods: {
    resolveVulnAliases: function (aliases, vulnSource) {
      return common.resolveVulnAliases(
        vulnSource ? vulnSource : this.source,
        aliases,
      );
    },
    getAnalysis: function () {
      let queryString =
        '?project=' +
        this.projectUuid +
        '&component=' +
        this.finding.component.uuid +
        '&vulnerability=' +
        this.finding.vulnerability.uuid;
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ANALYSIS}` + queryString;
      this.axios
        .get(url, {
          validateStatus: (status) => status === 200 || status === 404,
        })
        .then((response) => {
          this.updateAnalysisData(response.data);
        });
    },
    updateAnalysisData: function (analysis) {
      if (Object.prototype.hasOwnProperty.call(analysis, 'analysisComments')) {
        let trail = '';
        for (let i = 0; i < analysis.analysisComments.length; i++) {
          if (
            Object.prototype.hasOwnProperty.call(
              analysis.analysisComments[i],
              'commenter',
            )
          ) {
            trail += analysis.analysisComments[i].commenter + ' - ';
          }
          trail += common.formatTimestamp(
            analysis.analysisComments[i].timestamp,
            true,
          );
          trail += '\n';
          trail += analysis.analysisComments[i].comment;
          trail += '\n\n';
        }
        this.auditTrail = trail;
      }
      if (Object.prototype.hasOwnProperty.call(analysis, 'analysisState')) {
        this.analysisState = analysis.analysisState;
      }
      if (
        Object.prototype.hasOwnProperty.call(analysis, 'analysisJustification')
      ) {
        this.analysisJustification = analysis.analysisJustification;
      }
      if (Object.prototype.hasOwnProperty.call(analysis, 'analysisResponse')) {
        this.analysisResponse = analysis.analysisResponse;
      }
      if (Object.prototype.hasOwnProperty.call(analysis, 'analysisDetails')) {
        this.analysisDetails = analysis.analysisDetails;
      }
      if (Object.prototype.hasOwnProperty.call(analysis, 'isSuppressed')) {
        this.isSuppressed = analysis.isSuppressed;
      } else {
        this.isSuppressed = false;
      }
    },
    makeAnalysis: function () {
      this.callRestEndpoint(
        this.analysisState,
        this.analysisJustification,
        this.analysisResponse,
        this.analysisDetails,
        null,
        null,
      );
    },
    addComment: function () {
      if (this.comment != null) {
        this.callRestEndpoint(
          this.analysisState,
          this.analysisJustification,
          this.analysisResponse,
          this.analysisDetails,
          this.comment,
          null,
        );
      }
      this.comment = null;
    },
    callRestEndpoint: function (
      analysisState,
      analysisJustification,
      analysisResponse,
      analysisDetails,
      comment,
      isSuppressed,
    ) {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_ANALYSIS}`;
      this.axios
        .put(url, {
          project: this.projectUuid,
          component: this.finding.component.uuid,
          vulnerability: this.finding.vulnerability.uuid,
          analysisState: analysisState,
          analysisJustification: analysisJustification,
          analysisResponse: analysisResponse,
          analysisDetails: analysisDetails,
          comment: comment,
          isSuppressed: isSuppressed,
        })
        .then((response) => {
          this.$toastr.s(this.$t('message.updated'));
          this.updateAnalysisData(response.data);
        })
        .catch(() => {
          this.$toastr.w(this.$t('condition.unsuccessful_action'));
        });
    },
  },
  beforeMount() {
    this.finding && this.getAnalysis();
  },
  components: {
    BootstrapToggle,
  },
};
</script>
