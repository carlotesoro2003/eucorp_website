export const types = {
	Risk: {
		id: "string",
		rrn: "string",
		risk_statement: "string",
		classification: "number | null",
		actions: "string",
		key_persons: "string",
		budget: "number",
		profile_id: "string",
	},
	Classification: {
		id: "number",
		name: "string",
	},
	LikelihoodRating: {
		id: "number",
		name: "string",
		symbol: "string",
	},
	Severity: {
		id: "number",
		name: "string",
		value: "number",
	},
	RiskControlRating: {
		id: "number",
		name: "string",
		symbol: "string",
	},
	RiskMonitoringRating: {
		id: "number",
		status: "string",
	},
	RiskAssessment: {
        rrn: "string",
        risk_statement: "string",
		risk_id: "string",
		likelihoodRating: "number | null",
		severity: "number | null",
		riskControlRating: "number | null",
		riskMonitoringRating: "number | null",
	},
};
