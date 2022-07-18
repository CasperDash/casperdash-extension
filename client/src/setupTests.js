/* eslint-disable no-console */
import '@testing-library/jest-dom'
require("jest-extended");
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
