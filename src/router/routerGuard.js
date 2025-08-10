import { hasComplexPermission, hasPermission } from '../shared/permissions';

/**
 * Determines if the user can access the Dashboard route.
 *
 * @param {import('vue-router').Router} router - The Vue Router instance.
 * @returns {boolean} True if the user can access the Dashboard, false otherwise.
 */
export function canAccessDashboard(router) {
  // Find the root route ("/") and the dashboard child

  const rootRoute = router.options.routes[0];
  const dashboardRoute = rootRoute.children.find((r) => r.name === 'Dashboard');
  if (!dashboardRoute) return false;

  // Simulate the matched array as it would be during navigation
  const matched = [rootRoute, dashboardRoute];
  return resolveAuthorization(matched);
}

/**
 * Resolves whether the current route chain is authorized based on permissions and propagation rules.
 *
 * This function checks the matched route records from the deepest child up to the nearest ancestor
 * that does not propagate permissions. It verifies that all required permissions and complex permissions
 * are satisfied for each route in the propagation chain.
 *
 * @param {Array<Object>} matched - The array of matched route records, each containing a `meta` object.
 * @returns {boolean} Returns `true` if all required permissions are satisfied along the propagation chain, otherwise `false`.
 *
 * @note
 * Permissions can be propagated from ancestor routes to their children if the ancestor's `meta.propagatePermissionsToChildren` is `true`.
 * The function walks up the matched route chain, collecting all such ancestors, and checks permissions for each.
 */
export function resolveAuthorization(matched) {
  let idx = matched.length - 1;
  // Collect the propagation chain (from stop ancestor down to current)
  const chain = [matched[idx]];
  while (
    idx > 0 &&
    matched[idx - 1].meta &&
    matched[idx - 1].meta.propagatePermissionsToChildren
  ) {
    idx--;
    chain.unshift(matched[idx]);
  }
  // debugger;
  for (const r of chain) {
    if (
      r.meta.complexPermission &&
      !hasComplexPermission(r.meta.complexPermission)
    ) {
      return false;
    }
    if (r.meta.permissions && !hasPermission(r.meta.permissions)) {
      return false;
    }
    if (r.meta.permission && !hasPermission([r.meta.permission])) {
      return false;
    }
  }
  return true;
}
