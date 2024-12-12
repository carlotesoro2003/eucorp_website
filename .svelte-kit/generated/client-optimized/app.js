export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/classification": [3],
		"/dashboard": [4],
		"/departments": [5],
		"/leads": [6],
		"/login": [7],
		"/monitoring": [8],
		"/monitoring/mid-year": [9],
		"/monitoring/year-end": [10],
		"/opportunities": [11],
		"/plans": [12],
		"/plans/operationalPlans": [13],
		"/plans/operationalPlans/[id]": [14],
		"/plans/strategicPlans": [15],
		"/plans/[id]": [16],
		"/plans/[id]/[id]": [17],
		"/profile": [18],
		"/riskManagement": [19],
		"/risks": [20],
		"/risks/riskAssessment": [21],
		"/school-year": [22],
		"/test-sidebar": [23],
		"/users": [24]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';