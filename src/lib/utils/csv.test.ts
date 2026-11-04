import { describe, expect, it } from 'vitest';
import { escapeCsvField, toCsv } from './csv';

describe('escapeCsvField', () => {
	it('leaves plain text alone', () => {
		expect(escapeCsvField('Ada Lovelace', ';')).toBe('Ada Lovelace');
	});

	it('quotes a field holding the separator', () => {
		expect(escapeCsvField('a;b', ';')).toBe('"a;b"');
		expect(escapeCsvField('a;b', ',')).toBe('a;b');
	});

	it('quotes a field holding a line break', () => {
		expect(escapeCsvField('a\nb', ';')).toBe('"a\nb"');
		expect(escapeCsvField('a\rb', ';')).toBe('"a\rb"');
	});

	it('doubles quotes inside a quoted field', () => {
		expect(escapeCsvField('say "hi"', ';')).toBe('"say ""hi"""');
	});
});

describe('toCsv', () => {
	const rows = [
		['Ime', 'Iznos'],
		['Đorđe', '1.234,56']
	];

	it('prepends a BOM and joins records with CRLF by default', () => {
		expect(toCsv(rows)).toBe('﻿Ime;Iznos\r\nĐorđe;1.234,56');
	});

	it('omits the BOM when asked', () => {
		expect(toCsv(rows, { bom: false }).startsWith('Ime')).toBe(true);
	});

	it('uses the given separator and quotes fields that hold it', () => {
		expect(toCsv([['a', 'b,c']], { separator: ',', bom: false })).toBe('a,"b,c"');
	});

	it('writes nothing but the BOM for no rows', () => {
		expect(toCsv([])).toBe('﻿');
	});

	it('rejects a separator that would corrupt the file', () => {
		expect(() => toCsv(rows, { separator: '' })).toThrow();
		expect(() => toCsv(rows, { separator: '"' })).toThrow();
		expect(() => toCsv(rows, { separator: '\n' })).toThrow();
	});
});
