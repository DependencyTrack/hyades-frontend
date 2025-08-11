<template>
  <div class="app">
    <DefaultHeader />
    <div class="app-body">
      <AppSidebar ref="sidebar" fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :navItems="permissibleNav"></SidebarNav>
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list" />
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <DefaultFooter />
    <profile-edit-modal />
  </div>
</template>

<script>
import {
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  Breadcrumb,
} from '@coreui/vue';
import DefaultHeaderProfileDropdown from './DefaultHeaderProfileDropdown';
import DefaultHeader from './DefaultHeader';
import DefaultFooter from './DefaultFooter';
import EventBus from '../shared/eventbus';
import ProfileEditModal from '../views/components/ProfileEditModal';
import PERMISSIONS, {
  hasComplexPermission,
  hasPermission,
} from '../shared/permissions';

export default {
  name: 'DefaultContainer',
  components: {
    ProfileEditModal,
    AppSidebar,
    AppAside,
    Breadcrumb,
    DefaultHeaderProfileDropdown,
    SidebarForm,
    SidebarFooter,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    DefaultFooter,
    DefaultHeader,
  },
  data() {
    return {
      isSidebarMinimized: true,
      breadcrumbs: [],
      nav: [
        {
          name: this.$t('message.dashboard'),
          url: '/dashboard',
          icon: 'icon-speedometer',
        },
        {
          title: true,
          name: this.$t('message.portfolio'),
          class: '',
          wrapper: {
            element: '',
            attributes: {},
          },
        },
        {
          name: this.$t('message.projects'),
          url: '/projects',
          icon: 'fa fa-sitemap',
          permission: PERMISSIONS.PROJECT_READ,
        },
        {
          name: this.$t('message.components'),
          url: '/components',
          icon: 'fa fa-cubes',
          permission: PERMISSIONS.PROJECT_READ,
        },
        {
          name: this.$t('message.vulnerabilities'),
          url: '/vulnerabilities',
          icon: 'fa fa-shield',
          permission: PERMISSIONS.VULNERABILITY_MANAGEMENT,
        },
        {
          name: this.$t('message.licenses'),
          url: '/licenses',
          icon: 'fa fa-balance-scale',
        },
        {
          name: this.$t('message.tags'),
          url: '/tags',
          icon: 'fa fa-tag',
          permission: PERMISSIONS.TAG_MANAGEMENT,
        },
        {
          title: true,
          name: this.$t('message.global_audit'),
          class: '',
          wrapper: {
            element: '',
            attributes: {},
          },
          permissions: [
            PERMISSIONS.PROJECT_READ,
            PERMISSIONS.FINDING_READ,
            PERMISSIONS.POLICY_VIOLATION_READ,
          ],
        },
        {
          name: this.$t('message.vulnerability_audit'),
          url: '/vulnerabilityAudit',
          icon: 'fa fa-tasks',
          permissions: [PERMISSIONS.PROJECT_READ, PERMISSIONS.FINDING_READ],
        },
        {
          name: this.$t('message.policy_violation_audit'),
          url: '/policyViolationAudit',
          icon: 'fa fa-fire',
          permission: PERMISSIONS.POLICY_VIOLATION_READ,
        },
        {
          title: true,
          name: this.$t('message.administration'),
          class: '',
          wrapper: {
            element: '',
            attributes: {},
          },
          permission: PERMISSIONS.SYSTEM_CONFIGURATION,
        },
        {
          name: this.$t('message.policy_management'),
          url: '/policy',
          icon: 'fa fa-list-alt',
          permission: PERMISSIONS.POLICY_MANAGEMENT,
        },
        {
          name: this.$t('message.administration'),
          url: '/admin',
          icon: 'fa fa-cogs',
          permission: PERMISSIONS.SYSTEM_CONFIGURATION,
        },
      ],
    };
  },
  methods: {
    handleMinimizedUpdate() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
      if (localStorage) {
        localStorage.setItem('isSidebarMinimized', this.isSidebarMinimized);
      }
    },
    generateBreadcrumbs: function generateBreadcrumbs(
      crumbName,
      subSectionName,
      subSectionUuid,
      subSectionLabel,
    ) {
      let sectionName = this.$route.meta.sectionName;
      let sectionLabel = this.$t(this.$route.meta.i18n);
      let sectionPath = this.$route.meta.sectionPath;
      if (crumbName && subSectionName && subSectionUuid && subSectionLabel) {
        return [
          { path: '', name: 'Home', meta: { label: this.$t('message.home') } },
          {
            path: sectionPath,
            name: sectionName,
            meta: { label: sectionLabel },
          },
          {
            name: subSectionName,
            params: { uuid: subSectionUuid },
            meta: { label: subSectionLabel },
          },
          { name: crumbName, active: true },
        ];
      } else if (crumbName) {
        return [
          { path: '', name: 'Home', meta: { label: this.$t('message.home') } },
          {
            path: sectionPath,
            name: sectionName,
            meta: { label: sectionLabel },
          },
          { name: crumbName, active: true },
        ];
      } else {
        return [
          { path: '', name: 'Home', meta: { label: this.$t('message.home') } },
          {
            path: sectionPath,
            name: sectionName,
            meta: { label: sectionLabel },
          },
        ];
      }
    },
  },
  mounted() {
    this.isSidebarMinimized =
      localStorage?.getItem('isSidebarMinimized') === 'true';

    const sidebar = document.body;
    if (sidebar) {
      if (this.isSidebarMinimized) {
        sidebar.classList.add('sidebar-minimized');
      } else {
        sidebar.classList.remove('sidebar-minimized');
      }
    }
    this.$nextTick(() => {
      const sidebarMinimizer = this.$el.querySelector('.sidebar-minimizer');
      if (sidebarMinimizer) {
        sidebarMinimizer.addEventListener('click', this.handleMinimizedUpdate);
      }
    });
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      if (this.breadcrumbs.length === 0) {
        return this.generateBreadcrumbs();
      } else {
        return this.breadcrumbs;
      }
    },
    permissibleNav() {
      return this.nav.filter((item) => {
        if (item.permission && !hasPermission(item.permission)) {
          return false;
        }
        if (item.permissions && !hasPermission(item.permissions)) {
          return false;
        }
        if (
          item.complexPermission &&
          !hasComplexPermission(item.complexPermission)
        ) {
          return false;
        }
        return true;
      });
    },
  },
  created() {
    EventBus.$on('crumble', () => {
      this.breadcrumbs = [];
    });
    EventBus.$on(
      'addCrumb',
      (crumb, subSectionName, subSectionUuid, subsectionLabel) => {
        if (crumb) {
          this.breadcrumbs = this.generateBreadcrumbs(
            crumb,
            subSectionName,
            subSectionUuid,
            subsectionLabel,
          );
        } else {
          this.breadcrumbs = [];
        }
      },
    );
  },
};
</script>
