import PERMISSIONS, {
  hasPermission,
  hasComplexPermission,
} from '../shared/permissions';

export default {
  data() {
    return {
      PERMISSIONS,
      hasPermission,
      hasComplexPermission,
    };
  },
};
