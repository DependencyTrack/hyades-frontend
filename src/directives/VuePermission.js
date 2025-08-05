/*
 * Permissions Vue Directive
 */
import Vue from 'vue';
import { hasPermission, hasComplexPermission } from '../shared/permissions';

Vue.directive('permission', {
  inserted(el, binding) {
    const { arg, value, modifiers } = binding;
    const modifierKeys = Object.keys(modifiers);
    let permitted = false;

    if (arg === 'complex') {
      permitted = hasComplexPermission(value);
    } else {
      permitted = hasPermission(value, arg);
    }

    if (permitted) return; // User has permission, do nothing

    if (modifierKeys.length === 0) {
      el.style.display = 'none';
      return;
    }

    modifierKeys.forEach((modifier) => {
      switch (modifier.toLowerCase()) {
        case 'readonly':
          el.setAttribute('readonly', true);
          break;
        case 'disabled':
          el.setAttribute('disabled', true);
          break;
        case 'hide':
          el.style.display = 'none';
          break;
        case 'visibility':
          el.style.visibility = 'hidden';
          break;
        default:
          throw new Error(`Unknown modifier v-permission:${modifier}`);
      }
    });
  },
});
