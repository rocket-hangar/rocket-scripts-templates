/**
 * icu format based https://formatjs.io/docs/intl-messageformat
 * @param text source text (e.g. "Hello, {name}!")
 * @param vars variables (e.g. { name: "Jane" })
 * @return formatted text (e.g. "Hello, Jane!")
 */
export declare function icuFormat(text: string, vars: Record<string, string | number>): string;
