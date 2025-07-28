/* eslint-disable prettier/prettier */
// API Permissions
import EventBus from './eventbus';

export const ACCESS_MANAGEMENT = 'ACCESS_MANAGEMENT';
export const BADGES_READ = 'BADGES_READ';
export const BOM_CREATE = 'BOM_CREATE';
export const BOM_READ = 'BOM_READ';
export const FINDING_CREATE = 'FINDING_CREATE';
export const FINDING_READ = 'FINDING_READ';
export const FINDING_UPDATE = 'FINDING_UPDATE';
export const NOTIFICATION_RULE_MANAGEMENT = 'NOTIFICATION_RULE_MANAGEMENT';
export const POLICY_MANAGEMENT = 'POLICY_MANAGEMENT';
export const POLICY_VIOLATION_CREATE = 'POLICY_VIOLATION_CREATE';
export const POLICY_VIOLATION_READ = 'POLICY_VIOLATION_READ';
export const POLICY_VIOLATION_UPDATE = 'POLICY_VIOLATION_UPDATE';
export const PORTFOLIO_ACCESS_CONTROL_BYPASS = 'PORTFOLIO_ACCESS_CONTROL_BYPASS';
export const PORTFOLIO_MANAGEMENT = 'PORTFOLIO_MANAGEMENT';
export const PROJECT_DELETE = 'PROJECT_DELETE';
export const PROJECT_READ = 'PROJECT_READ';
export const PROJECT_UPDATE = 'PROJECT_UPDATE';
export const SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION';
export const TAG_MANAGEMENT = 'TAG_MANAGEMENT';
export const VULNERABILITY_MANAGEMENT = 'VULNERABILITY_MANAGEMENT';

export default Object.freeze({
  ACCESS_MANAGEMENT,
  BADGES_READ,
  BOM_CREATE,
  BOM_READ,
  FINDING_CREATE,
  FINDING_READ,
  FINDING_UPDATE,
  NOTIFICATION_RULE_MANAGEMENT,
  POLICY_MANAGEMENT,
  POLICY_VIOLATION_CREATE,
  POLICY_VIOLATION_READ,
  POLICY_VIOLATION_UPDATE,
  PORTFOLIO_ACCESS_CONTROL_BYPASS,
  PORTFOLIO_MANAGEMENT,
  PROJECT_DELETE,
  PROJECT_READ,
  PROJECT_UPDATE,
  SYSTEM_CONFIGURATION,
  TAG_MANAGEMENT,
  VULNERABILITY_MANAGEMENT,
});

let cachedToken = null;
const existingToken = getToken();

// On module load, try to cache the token if present
if (existingToken) {
  const decodedToken = decodeToken(existingToken);
  cachedToken = Object.freeze({
    raw: existingToken,
    decoded: decodedToken,
    permissions: decodedToken.permissions?.split(',') || [],
  });
}

// Listen for authentication events to update the cached token (e.g. login/logout)
EventBus.$on('authenticated', (jwt) => {
  if (!jwt) return;
  const decodedToken = decodeToken(jwt);
  cachedToken = Object.freeze({
    raw: jwt,
    decoded: decodedToken,
    permissions: decodedToken.permissions?.split(',') || [],
  });
});

/**
 * Determines if the current logged in user has a specific permission.
 */
export function hasPermission(permission, operation = 'and') {
  if (!cachedToken) return false;

  if (typeof permission === 'string') {
    return cachedToken.permissions.includes(permission);
  }

  if (typeof permission === 'object' && permission !== null) {
    return hasComplexPermission(permission);
  }

  if (Array.isArray(permission)) {
    switch (operation) {
      case 'and':
        return permission.every((perm) =>
          cachedToken.permissions.includes(perm),
        );
      case 'not':
        return permission.every((perm) => !cachedToken.permissions.includes(perm));
      case 'or':
      default:
        return permission.some((perm) =>
          cachedToken.permissions.includes(perm),
        );
    }
  }

  return false;
}

/**
 * Recursively determines if a user has complex permissions.
 * Complex permissions can be specified as:
 * - A string: single permission (e.g. "perm_x")
 * - An array: all permissions required (AND logic, e.g. ["perm_x", "perm_y"])
 * - An object:
 *     { and: [...] }  // All required (AND)
 *     { or: [...] }   // Any required (OR)
 *     { not: [...] }  // None must be present (NOT)
 * Nested structures are supported.
 *
 * Example:
 *   {
 *     and: [
 *       "perm_x",
 *       { or: ["perm_y", "perm_z"] },
 *       { not: ["perm_a"] }
 *     ]
 *   }
 * Means: perm_x AND (perm_y OR perm_z) AND (NOT perm_a)
 *
 * @param {string|Array|Object} requiredPermissions - The required permission(s).
 * @param {Array<string>} userPermissions - The user's permissions as an array of strings.
 * @returns {boolean} True if the user has the required permissions, false otherwise.
 */
export function hasComplexPermission(requiredPermissions) {
  try {
    if (!requiredPermissions) return true;

    if (typeof requiredPermissions === 'string')
      // return hasPermission(requiredPermissions);
      return cachedToken.permissions?.includes(requiredPermissions);

    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.every((r) => hasComplexPermission(r));
    }

    if (typeof requiredPermissions === 'object') {
      if (requiredPermissions.and) {
        return requiredPermissions.and.every((r) => hasComplexPermission(r));
      }

      if (requiredPermissions.or) {
        return requiredPermissions.or.some((r) => hasComplexPermission(r));
      }

      if (requiredPermissions.not) {
        return requiredPermissions.not.every((r) => !hasComplexPermission(r));
      }
    }

    // If the structure is not recognized, log and return false
    console.error('Unrecognized permission structure:', requiredPermissions);
    return false;
  } catch (err) {
    console.error('Error in hasComplexPermission:', err, requiredPermissions);
    return false;
  }
}
/**
 * Returns the decoded token as a JSON object.
 */
export function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

/**
 * Retrieves the token from session storage.
 */
export function getToken() {
  return sessionStorage.getItem('token');
}
