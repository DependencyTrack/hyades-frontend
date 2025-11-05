/* eslint-disable prettier/prettier */
import * as permissions from '../shared/permissions';

export default {
  data() {
    return {
      PERMISSIONS: {
        BOM_UPLOAD: permissions.BOM_UPLOAD,
        VIEW_PORTFOLIO: permissions.VIEW_PORTFOLIO,
        PORTFOLIO_MANAGEMENT: permissions.PORTFOLIO_MANAGEMENT,
        PORTFOLIO_MANAGEMENT_CREATE: permissions.PORTFOLIO_MANAGEMENT_CREATE,
        PORTFOLIO_MANAGEMENT_READ: permissions.PORTFOLIO_MANAGEMENT_READ,
        PORTFOLIO_MANAGEMENT_UPDATE: permissions.PORTFOLIO_MANAGEMENT_UPDATE,
        PORTFOLIO_MANAGEMENT_DELETE: permissions.PORTFOLIO_MANAGEMENT_DELETE,
        VIEW_VULNERABILITY: permissions.VIEW_VULNERABILITY,
        VULNERABILITY_ANALYSIS: permissions.VULNERABILITY_ANALYSIS,
        VULNERABILITY_ANALYSIS_CREATE:
          permissions.VULNERABILITY_ANALYSIS_CREATE,
        VULNERABILITY_ANALYSIS_READ: permissions.VULNERABILITY_ANALYSIS_READ,
        VULNERABILITY_ANALYSIS_UPDATE:
          permissions.VULNERABILITY_ANALYSIS_UPDATE,
        VIEW_POLICY_VIOLATION: permissions.VIEW_POLICY_VIOLATION,
        VULNERABILITY_MANAGEMENT: permissions.VULNERABILITY_MANAGEMENT,
        VULNERABILITY_MANAGEMENT_CREATE:
          permissions.VULNERABILITY_MANAGEMENT_CREATE,
        VULNERABILITY_MANAGEMENT_READ:
          permissions.VULNERABILITY_MANAGEMENT_READ,
        VULNERABILITY_MANAGEMENT_UPDATE:
          permissions.VULNERABILITY_MANAGEMENT_UPDATE,
        VULNERABILITY_MANAGEMENT_DELETE:
          permissions.VULNERABILITY_MANAGEMENT_DELETE,
        POLICY_VIOLATION_ANALYSIS: permissions.POLICY_VIOLATION_ANALYSIS,
        ACCESS_MANAGEMENT: permissions.ACCESS_MANAGEMENT,
        ACCESS_MANAGEMENT_CREATE: permissions.ACCESS_MANAGEMENT_CREATE,
        ACCESS_MANAGEMENT_READ: permissions.ACCESS_MANAGEMENT_READ,
        ACCESS_MANAGEMENT_UPDATE: permissions.ACCESS_MANAGEMENT_UPDATE,
        ACCESS_MANAGEMENT_DELETE: permissions.ACCESS_MANAGEMENT_DELETE,
        SECRET_MANAGEMENT: permissions.SECRET_MANAGEMENT,
        SECRET_MANAGEMENT_CREATE: permissions.SECRET_MANAGEMENT_CREATE,
        SECRET_MANAGEMENT_READ: permissions.SECRET_MANAGEMENT_READ,
        SECRET_MANAGEMENT_UPDATE: permissions.SECRET_MANAGEMENT_UPDATE,
        SECRET_MANAGEMENT_DELETE: permissions.SECRET_MANAGEMENT_DELETE,
        SYSTEM_CONFIGURATION: permissions.SYSTEM_CONFIGURATION,
        SYSTEM_CONFIGURATION_CREATE: permissions.SYSTEM_CONFIGURATION_CREATE,
        SYSTEM_CONFIGURATION_READ: permissions.SYSTEM_CONFIGURATION_READ,
        SYSTEM_CONFIGURATION_UPDATE: permissions.SYSTEM_CONFIGURATION_UPDATE,
        SYSTEM_CONFIGURATION_DELETE: permissions.SYSTEM_CONFIGURATION_DELETE,
        PROJECT_CREATION_UPLOAD: permissions.PROJECT_CREATION_UPLOAD,
        POLICY_MANAGEMENT: permissions.POLICY_MANAGEMENT,
        POLICY_MANAGEMENT_CREATE: permissions.POLICY_MANAGEMENT_CREATE,
        POLICY_MANAGEMENT_READ: permissions.POLICY_MANAGEMENT_READ,
        POLICY_MANAGEMENT_UPDATE: permissions.POLICY_MANAGEMENT_UPDATE,
        POLICY_MANAGEMENT_DELETE: permissions.POLICY_MANAGEMENT_DELETE,
        TAG_MANAGEMENT: permissions.TAG_MANAGEMENT,
        TAG_MANAGEMENT_DELETE: permissions.TAG_MANAGEMENT_DELETE,
      },
    };
  },
  computed: {
    decodedToken() {
      return permissions.decodeToken(permissions.getToken());
    },
  },
  methods: {
    isPermitted(permission) {
      // return permissions.hasPermission(permission, this.decodedToken);
      if (typeof permission == 'string') {
        return permissions.hasPermission(permission, this.decodedToken);
      } else if (Array.isArray(permission)) {
        for (let perm of permission) {
          if (permissions.hasPermission(perm, this.decodedToken)) {
            return true;
          }
        }
        return false;
      } else {
        throw new Error('permission must be of type string or array');
      }
    },
    isNotPermitted(permission) {
      if (typeof permission == 'string') {
        return !permissions.hasPermission(permission, this.decodedToken);
      } else if (Array.isArray(permission)) {
        for (let perm of permission) {
          if (permissions.hasPermission(perm, this.decodedToken)) {
            return false;
          }
        }
        return true;
      } else {
        throw new Error('permission must be of type string or array');
      }
    },
  },
};
