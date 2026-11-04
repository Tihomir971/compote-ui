export type CsvOptions = {
	/** Field separator. Defaults to `;`, which Excel expects under most European locales. */
	separator?: string;
	/**
	 * Prepend a UTF-8 BOM so Excel reads the file as UTF-8 (otherwise č/ć/š/đ/ž break).
	 * Defaults to `true`.
	 */
	bom?: boolean;
};

const BOM = '﻿';

/** Quotes a field when it holds a quote, the separator or a line break (RFC 4180). */
export function escapeCsvField(value: string, separator: string): string {
	if (value.includes('"') || value.includes(separator) || /[\r\n]/.test(value)) {
		return `"${value.replaceAll('"', '""')}"`;
	}
	return value;
}

/** Serializes rows of text as CSV, records separated by CRLF. */
export function toCsv(rows: string[][], { separator = ';', bom = true }: CsvOptions = {}): string {
	if (separator.length === 0 || /["\r\n]/.test(separator)) {
		throw new Error(`Invalid CSV separator: ${JSON.stringify(separator)}`);
	}
	const body = rows
		.map((row) => row.map((field) => escapeCsvField(field, separator)).join(separator))
		.join('\r\n');
	return bom ? BOM + body : body;
}
