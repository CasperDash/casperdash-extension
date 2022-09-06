/* eslint-disable no-console */
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import 'mockzilla-webextension';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.console = {
	log: console.log,
	error: jest.fn(),
	warn: jest.fn(),
	info: jest.fn(),
};

global.navigator.clipboard = { writeText: jest.fn() };
Object.assign(global, require('jest-chrome'));
