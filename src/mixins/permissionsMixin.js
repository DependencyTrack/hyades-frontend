import PERMISSIONS, {
  hasPermission,
  hasComplexPermission,
} from '../shared/permissions';

function assertValidPermissionArg(permission) {
  if (typeof permission !== 'string' && !Array.isArray(permission)) {
    throw new Error('permission must be of type string or array');
  }
}

export default {
  data() {
    return {
      PERMISSIONS,
      hasPermission,
      hasComplexPermission,
    };
  },
  methods: {
    isPermitted(permission) {
      assertValidPermissionArg(permission);
      return hasPermission(permission, 'and');
    },
    isNotPermitted(permission) {
      assertValidPermissionArg(permission);
      return !hasPermission(permission, 'and');
    },
  },
};
