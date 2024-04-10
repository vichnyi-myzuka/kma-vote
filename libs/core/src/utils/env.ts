export function get(key: string): string {
  return process?.env?.[key];
}

export function string(key: string, defaultValue?: string): string {
  return get(key) ?? defaultValue;
}

export function boolean(key: string, defaultValue?: boolean): boolean {
  const str: string = get(key);
  const value: boolean = str === undefined ? undefined : str === 'true';
  return value ?? defaultValue;
}

export const bool = boolean;

export function number(key: string, defaultValue?: number): number {
  return +(get(key) ?? defaultValue);
}

export default {
  get,
  string,
  bool,
  boolean,
  number,
};
