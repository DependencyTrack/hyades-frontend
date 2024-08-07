<template>
  <div
    class="animated fadeIn"
    v-permission:or="[
      PERMISSIONS.POLICY_MANAGEMENT,
      PERMISSIONS.POLICY_MANAGEMENT_CREATE,
      PERMISSIONS.POLICY_MANAGEMENT_READ,
      PERMISSIONS.POLICY_MANAGEMENT_UPDATE,
      PERMISSIONS.POLICY_MANAGEMENT_DELETE,
    ]"
  >
    <b-tabs
      class="body-bg-color"
      style="border-left: 0; border-right: 0; border-top: 0"
    >
      <b-tab
        ref="policies"
        class="body-bg-color overview-chart"
        style="border-left: 0; border-right: 0; border-top: 0"
        active
        @click="routeTo()"
      >
        <template v-slot:title
          ><i class="fa fa-list-alt"></i> {{ $t('message.policies') }}
          <b-badge variant="tab-total">{{ totalPolicies }}</b-badge></template
        >
        <policy-list v-on:total="totalPolicies = $event" />
      </b-tab>
      <b-tab ref="licensegroups" @click="routeTo('licenseGroups')">
        <template v-slot:title
          ><i class="fa fa-balance-scale"></i>
          {{ $t('message.license_groups') }}
          <b-badge variant="tab-total">{{
            totalLicenseGroups
          }}</b-badge></template
        >
        <license-group-list v-on:total="totalLicenseGroups = $event" />
      </b-tab>
      <b-tab
        ref="vulnerability"
        class="body-bg-color overview-chart"
        style="border-left: 0; border-right: 0; border-top: 0"
        @click="routeTo('vulnerability')"
      >
        <template v-slot:title
          ><i class="fa fa-list-alt"></i>
          {{ $t('message.vulnerability_policies') }}
          <b-badge variant="tab-total">{{
            totalVulnerabilityPolicies
          }}</b-badge></template
        >
        <vulnerability-policy-list
          v-on:total="totalVulnerabilityPolicies = $event"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import permissionsMixin from '../../mixins/permissionsMixin';
import PolicyList from './PolicyList';
import LicenseGroupList from './LicenseGroupList';
import VulnerabilityPolicyList from './VulnerabilityPolicyList';

export default {
  mixins: [permissionsMixin],
  components: {
    LicenseGroupList,
    PolicyList,
    VulnerabilityPolicyList,
  },
  data() {
    return {
      totalPolicies: 0,
      totalLicenseGroups: 0,
      totalVulnerabilityPolicies: 0,
    };
  },
  methods: {
    routeTo(path) {
      if (path) {
        if (
          !this.$route.fullPath.toLowerCase().includes('/' + path.toLowerCase())
        ) {
          this.$router.push({ path: '/policy/' + path });
        }
      } else if (
        this.$route.fullPath !== '/policy' &&
        this.$route.fullPath !== '/policy/'
      ) {
        this.$router.push({ path: '/policy' });
      }
    },
    getTabFromRoute: function () {
      let pattern = new RegExp('/policy\/([^\\/]*)', 'gi');
      let tab = pattern.exec(this.$route.fullPath.toLowerCase());
      return this.$refs[tab && tab[1] ? tab[1].toLowerCase() : 'policies'];
    },
  },
  mounted() {
    const tab = this.getTabFromRoute();
    if (tab) {
      tab.active = true;
    }
  },
  watch: {
    $route() {
      const tab = this.getTabFromRoute();
      if (tab) {
        tab.activate();
      }
    },
  },
};
</script>
