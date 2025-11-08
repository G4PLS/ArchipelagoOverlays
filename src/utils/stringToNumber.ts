export function stringToNumber(value: string, fallback: number): number {
    let number: number = fallback;

    if (value !== null) {
      number = Number(value);

      if (isNaN(number)) number = fallback;
    }

    return number;
}