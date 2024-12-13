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
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/(app)/classification": [4,[2]],
		"/(app)/dashboard": [5,[2]],
		"/(app)/departments": [6,[2]],
		"/(app)/leads": [7,[2]],
		"/(app)/login": [8,[2]],
		"/(app)/monitoring": [9,[2]],
		"/(app)/monitoring/mid-year": [10,[2]],
		"/(app)/monitoring/year-end": [11,[2]],
		"/(app)/opportunities": [12,[2]],
		"/(app)/plans": [13,[2]],
		"/(app)/plans/operationalPlans": [14,[2]],
		"/(app)/plans/operationalPlans/[id]": [15,[2]],
		"/(app)/plans/strategicPlans": [16,[2]],
		"/(app)/plans/[id]": [17,[2]],
		"/(app)/plans/[id]/[id]": [18,[2]],
		"/(app)/profile": [19,[2]],
		"/(app)/riskManagement": [20,[2]],
		"/(app)/risks": [21,[2]],
		"/(app)/risks/riskAssessment": [22,[2]],
		"/(app)/school-year": [23,[2]],
		"/(app)/test-sidebar": [24,[2]],
		"/(app)/users": [25,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';