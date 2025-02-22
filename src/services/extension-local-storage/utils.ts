import cloneDeep from "lodash/cloneDeep";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] | undefined;
};

export const mergeUndefined = <T extends object>({
  target,
  source,
}: {
  target: DeepPartial<T>;
  source: T;
}): T => {
  const result = cloneDeep(source);

  function merge(targetObj: any, resultObj: any) {
    for (const key in targetObj) {
      if (targetObj[key] !== undefined) {
        if (typeof targetObj[key] === "object" && targetObj[key] !== null) {
          resultObj[key] = resultObj[key] ?? {};
          merge(targetObj[key], resultObj[key]);
        } else {
          resultObj[key] = targetObj[key];
        }
      }
    }
  }

  merge(target, result);
  return result;
};

export function setPathToUndefined({
  paths,
  obj,
}: {
  paths: string[];
  obj: Record<string, any>;
}): Record<string, any> {
  const result = cloneDeep(obj);

  let current = result;

  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (path != null && typeof current[path] === "object") {
      current = current[path];
    } else {
      return result;
    }
  }

  if (paths.length > 0) {
    const lastPath = paths[paths.length - 1];
    if (
      lastPath != null &&
      Object.prototype.hasOwnProperty.call(current, lastPath)
    ) {
      current[lastPath] = undefined;
    }
  }

  return result;
}
