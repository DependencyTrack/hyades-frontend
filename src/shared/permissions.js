/* eslint-disable prettier/prettier */
// API Permissions
export const ACCESS_MANAGEMENT = 'ACCESS_MANAGEMENT';
export const ACCESS_MANAGEMENT_CREATE = 'ACCESS_MANAGEMENT_CREATE';
export const ACCESS_MANAGEMENT_DELETE = 'ACCESS_MANAGEMENT_DELETE';
export const ACCESS_MANAGEMENT_READ = 'ACCESS_MANAGEMENT_READ';
export const ACCESS_MANAGEMENT_UPDATE = 'ACCESS_MANAGEMENT_UPDATE';
export const BOM_UPLOAD = 'BOM_UPLOAD';
export const POLICY_MANAGEMENT = 'POLICY_MANAGEMENT';
export const POLICY_MANAGEMENT_CREATE = 'POLICY_MANAGEMENT_CREATE';
export const POLICY_MANAGEMENT_DELETE = 'POLICY_MANAGEMENT_DELETE';
export const POLICY_MANAGEMENT_READ = 'POLICY_MANAGEMENT_READ';
export const POLICY_MANAGEMENT_UPDATE = 'POLICY_MANAGEMENT_UPDATE';
export const POLICY_VIOLATION_ANALYSIS = 'POLICY_VIOLATION_ANALYSIS';
export const PORTFOLIO_MANAGEMENT = 'PORTFOLIO_MANAGEMENT';
export const PORTFOLIO_MANAGEMENT_CREATE = 'PORTFOLIO_MANAGEMENT_CREATE';
export const PORTFOLIO_MANAGEMENT_DELETE = 'PORTFOLIO_MANAGEMENT_DELETE';
export const PORTFOLIO_MANAGEMENT_READ = 'PORTFOLIO_MANAGEMENT_READ';
export const PORTFOLIO_MANAGEMENT_UPDATE = 'PORTFOLIO_MANAGEMENT_UPDATE';
export const PROJECT_CREATION_UPLOAD = 'PROJECT_CREATION_UPLOAD';
export const ROLE_MANAGEMENT = 'ROLE_MANAGEMENT';
export const ROLE_MANAGEMENT_CREATE = 'ROLE_MANAGEMENT_CREATE';
export const ROLE_MANAGEMENT_DELETE = 'ROLE_MANAGEMENT_DELETE';
export const ROLE_MANAGEMENT_READ = 'ROLE_MANAGEMENT_READ';
export const ROLE_MANAGEMENT_UPDATE = 'ROLE_MANAGEMENT_UPDATE';
export const SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION';
export const SYSTEM_CONFIGURATION_CREATE = 'SYSTEM_CONFIGURATION_CREATE';
export const SYSTEM_CONFIGURATION_DELETE = 'SYSTEM_CONFIGURATION_DELETE';
export const SYSTEM_CONFIGURATION_READ = 'SYSTEM_CONFIGURATION_READ';
export const SYSTEM_CONFIGURATION_UPDATE = 'SYSTEM_CONFIGURATION_UPDATE';
export const TAG_MANAGEMENT = 'TAG_MANAGEMENT';
export const TAG_MANAGEMENT_DELETE = 'TAG_MANAGEMENT_DELETE';
export const VIEW_POLICY_VIOLATION = 'VIEW_POLICY_VIOLATION';
export const VIEW_PORTFOLIO = 'VIEW_PORTFOLIO';
export const VIEW_VULNERABILITY = 'VIEW_VULNERABILITY';
export const VULNERABILITY_ANALYSIS = 'VULNERABILITY_ANALYSIS';
export const VULNERABILITY_ANALYSIS_CREATE = 'VULNERABILITY_ANALYSIS_CREATE';
export const VULNERABILITY_ANALYSIS_READ = 'VULNERABILITY_ANALYSIS_READ';
export const VULNERABILITY_ANALYSIS_UPDATE = 'VULNERABILITY_ANALYSIS_UPDATE';
export const VULNERABILITY_MANAGEMENT = 'VULNERABILITY_MANAGEMENT';
export const VULNERABILITY_MANAGEMENT_CREATE = 'VULNERABILITY_MANAGEMENT_CREATE';
export const VULNERABILITY_MANAGEMENT_DELETE = 'VULNERABILITY_MANAGEMENT_DELETE';
export const VULNERABILITY_MANAGEMENT_READ = 'VULNERABILITY_MANAGEMENT_READ';
export const VULNERABILITY_MANAGEMENT_UPDATE = 'VULNERABILITY_MANAGEMENT_UPDATE';

/**
 * Determines if the current logged in user has a specific permission.
 * If the decodedToken is not passed, the function will automatically
 * retrieve and decode it.
 */
export const hasPermission = function hasPermission(permission, decodedToken) {
  const token = decodedToken || decodeToken(getToken());
  const permissions = token?.permissions?.split(',') || [];
  if (typeof permission == 'string') {
    return permissions.includes(permission);
  } else if (Array.isArray(permission)) {
    for (let perm of permission) {
      if (permissions.includes(perm)) {
        return true;
      }
    }
    return false;
  }
};

/**
 * Returns the decoded token as a JSON object.
 */
export const decodeToken = function decodeToken(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

/**
 * Retrieves the token from session storage.
 */
export const getToken = function getToken() {
  return sessionStorage.getItem('token');
};
