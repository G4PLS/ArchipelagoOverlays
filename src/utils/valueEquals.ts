export function valueEquals<T>(value: T|undefined, baseValue: T|undefined): boolean {
    if (value === undefined || value === null)
        return true;

      if (typeof value === "object") {
        if (JSON.stringify(value) === JSON.stringify(baseValue))
          return true;
      }
      else if(value === baseValue)
        return true;

    return false;
}