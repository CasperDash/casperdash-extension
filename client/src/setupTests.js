/* eslint-disable no-console */
global.console = {
	log: console.log,
	error: jest.fn(),
	warn: jest.fn(),
	info: jest.fn(),
};

global.navigator.clipboard = { writeText: jest.fn() };
