<template>
  <b-card no-body :header="header">
    <b-card-body>
      <b-form-group
        :label="$t('admin.metrics')"
        label-size="lg"
        label-class="font-weight-bold pt-0 mb-0"
      >
        <b-form-group :label="$t('admin.retention')">
          <b-input-group :append="$t('admin.days')">
            <b-form-input
              type="number"
              v-model="metricsRetentionDays"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group
        :label="$t('message.projects')"
        label-size="lg"
        label-class="font-weight-bold pt-0 mb-0"
      >
        <b-form-group>
          <c-switch
            color="primary"
            v-model="enableProjectRetention"
            label
            v-bind="switchLabelIcon"
          />
          {{ $t('admin.project_retention_enable') }}
        </b-form-group>
        <b-form-group
          :label="$t('message.project_retention_type')"
          v-slot="{ projectRetention }"
        >
          <b-form-radio-group
            v-model="projectRetentionTypeSelected"
            :options="projectRetentionTypes"
            :aria-describedby="projectRetention"
            name="radios-btn-default"
            button-variant="outline-primary"
            class="cvss-calc cvss-calc-3-btn"
            buttons
          />
        </b-form-group>
        <b-form-group :label="$t('message.age')">
          <b-input-group :append="$t('admin.days')">
            <b-form-input
              type="number"
              v-model="projectRetentionDays"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group :label="$t('admin.versions')">
          <b-input-group :append="$t('message.inactive_versions')">
            <b-form-input
              type="number"
              v-model="projectRetentionVersions"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group
        :label="$t('admin.tags')"
        label-size="lg"
        label-class="font-weight-bold pt-0 mb-0"
      >
        <c-switch
          color="primary"
          v-model="tagsDeleteUnused"
          label
          v-bind="switchLabelIcon"
        />{{ $t('admin.tags_delete_unused') }}
      </b-form-group>
      <b-form-group
        :label="$t('admin.vulnerability_scans')"
        label-size="lg"
        label-class="font-weight-bold pt-0 mb-0"
      >
        <b-form-group :label="$t('admin.retention')">
          <b-input-group :append="$t('admin.hours')">
            <b-form-input
              type="number"
              v-model="vulnScanRetentionHours"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group
        :label="$t('admin.workflows')"
        label-size="lg"
        label-class="font-weight-bold pt-0 mb-0"
      >
        <b-form-group :label="$t('admin.retention')">
          <b-input-group :append="$t('admin.hours')">
            <b-form-input
              type="number"
              v-model="workflowRetentionHours"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group :label="$t('admin.workflow_step_timeout')">
          <b-input-group :append="$t('admin.minutes')">
            <b-form-input
              type="number"
              v-model="workflowStepTimeoutMinutes"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-form-group>
    </b-card-body>
    <b-card-footer>
      <b-button variant="outline-primary" class="px-4" @click="saveChanges">{{
        $t('message.update')
      }}</b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
import common from '../../../shared/common';
import configPropertyMixin from '../mixins/configPropertyMixin';

export default {
  mixins: [configPropertyMixin],
  props: {
    header: String,
  },
  components: {
    cSwitch,
  },
  data() {
    return {
      metricsRetentionDays: null,
      enableProjectRetention: null,
      projectRetentionTypes: ['AGE', 'VERSIONS'],
      projectRetentionTypeSelected: '',
      projectRetentionDays: null,
      projectRetentionVersions: null,
      tagsDeleteUnused: null,
      vulnScanRetentionHours: null,
      workflowRetentionHours: null,
      workflowStepTimeoutMinutes: null,
      switchLabelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
    };
  },
  methods: {
    saveChanges: function () {
      this.updateConfigProperties([
        {
          groupName: 'maintenance',
          propertyName: 'metrics.retention.days',
          propertyValue: this.metricsRetentionDays,
        },
        {
          groupName: 'maintenance',
          propertyName: 'projects.retention.type',
          propertyValue: this.enableProjectRetention
            ? this.projectRetentionTypeSelected
            : null,
        },
        {
          groupName: 'maintenance',
          propertyName: 'projects.retention.days',
          propertyValue: this.projectRetentionDays,
        },
        {
          groupName: 'maintenance',
          propertyName: 'projects.retention.versions',
          propertyValue: this.projectRetentionVersions,
        },
        {
          groupName: 'maintenance',
          propertyName: 'tags.delete.unused',
          propertyValue: this.tagsDeleteUnused,
        },
        {
          groupName: 'maintenance',
          propertyName: 'vuln.scan.retention.hours',
          propertyValue: this.vulnScanRetentionHours,
        },
        {
          groupName: 'maintenance',
          propertyName: 'workflow.retention.hours',
          propertyValue: this.workflowRetentionHours,
        },
        {
          groupName: 'maintenance',
          propertyName: 'workflow.step.timeout.minutes',
          propertyValue: this.workflowStepTimeoutMinutes,
        },
      ]);
    },
  },
  created() {
    this.axios.get(this.configUrl).then((response) => {
      let configItems = response.data.filter(
        (item) => item.groupName === 'maintenance',
      );
      for (let i = 0; i < configItems.length; i++) {
        let item = configItems[i];
        switch (item.propertyName) {
          case 'metrics.retention.days':
            this.metricsRetentionDays = item.propertyValue;
            break;
          case 'projects.retention.type':
            this.enableProjectRetention =
              item.propertyValue == null ? false : true;
            this.projectRetentionTypeSelected = item.propertyValue;
            break;
          case 'projects.retention.days':
            this.projectRetentionDays = item.propertyValue;
            break;
          case 'projects.retention.versions':
            this.projectRetentionVersions = item.propertyValue;
            break;
          case 'tags.delete.unused':
            this.tagsDeleteUnused = common.toBoolean(item.propertyValue);
            break;
          case 'vuln.scan.retention.hours':
            this.vulnScanRetentionHours = item.propertyValue;
            break;
          case 'workflow.retention.hours':
            this.workflowRetentionHours = item.propertyValue;
            break;
          case 'workflow.step.timeout.minutes':
            this.workflowStepTimeoutMinutes = item.propertyValue;
            break;
        }
      }
    });
  },
};
</script>
