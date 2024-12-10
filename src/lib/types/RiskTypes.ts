export interface Risk {
	id?: string;
	rrn: string;
	risk_statement: string;
	classification: number | null;
	actions: string;
	key_persons: string;
	budget: number;
	profile_id: string;
	department_id: string;
}

export interface Classification {
	id: number;
	name: string;
}

export interface LikelihoodRating {
	id: number;
	name: string;
	symbol: string;
}

export interface Severity {
	id: number;
	name: string;
	value: number;
}

export interface RiskControlRating {
	id: number;
	name: string;
	symbol: string;
}

export interface RiskMonitoringRating {
	id: number;
	status: string;
}

export interface RiskAssessment {
	risk_id: string;
	likelihoodRating: number | null;
	severity: number | null;
	riskControlRating: number | null;
	riskMonitoringRating: number | null;
}
