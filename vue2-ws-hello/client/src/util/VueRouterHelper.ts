import VueRouter, { RouteRecord } from 'vue-router';

export class VueRouterHelper {

  public static navigateToIfNeeded(router: VueRouter, targetPath: string){
    if (targetPath && targetPath != router.currentRoute.fullPath) {
      router.push(targetPath);
    }
  }

  /**
   * for the currentRoute, build a stack(list) that will be, 
   * from last to first, route and all parent routes,
   * with the route name and path. 
   * (except the root route)
   */
  public static buildCurrentRouteStack(route: RouteRecord, 
    routingParams: { [key: string]: string }, 
    stack: {name:string, path:string}[],
  ){
    let effTargetPath =  VueRouterHelper.getExactPathForRouteWithParams(route.path, routingParams);

    if (effTargetPath !== '/' &&
      effTargetPath !== '') {
      // skip adding root route
      stack.push({
        name: route.name || '',
        path: effTargetPath,
      });
    }
    if (route.parent) {
      VueRouterHelper.buildCurrentRouteStack(route.parent, routingParams, stack);
    }
  }

  /**
   * for a route (path) that contains path variables,
   * replace param symbol by actual values
   */
  public static getExactPathForRouteWithParams(
    routePath: string, 
    routingParams: { [key: string]: string },
  ){
    let effTargetPath = routePath;
    let paramPatternMatched = routePath.match(/\/:[A-Za-z0-9_]+/g);
    if (paramPatternMatched) {
      for (let matchedPattern of paramPatternMatched) {
        let pathVarValue = routingParams[matchedPattern.substr(2)];
        effTargetPath = effTargetPath.replace(matchedPattern, `/${pathVarValue}`);
      }
    }
    return effTargetPath;
  }

}
