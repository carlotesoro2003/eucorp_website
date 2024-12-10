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
	likelihoodRating?: LikelihoodRating | null;
    severity?: Severity | null;
    riskControlRating?: RiskControlRating | null;
    riskMonitoringRating?: RiskMonitoringRating | null;
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
	rrn: string;
	risk_id: string;
	likelihoodRating: number | null;
	severity: number | null;
	riskControlRating: number | null;
	riskMonitoringRating: number | null;
}


export interface RiskMonitoring {
    id: number;
    rrn: string;
    risk_statement: string;
    likelihood_rating: string | null;
    severity: number | null;
    control_rating: string | null;
    monitoring_rating: string | null;
    is_achieved: boolean;
}

export interface LikelihoodRating {
    id: number;
    symbol: string;
    name: string;
}

export interface Severity {
    id: number;
	name: string;
    value: number;

}

export interface RiskControlRating {
    id: number;
    symbol: string;
    name: string;
}

export interface RiskMonitoringRating {
    id: number;
    status: string;
}

export interface RiskAssessment extends RiskMonitoring {
    likelihoodRating: number | null;
    severity: number | null;
    riskControlRating: number | null;
    riskMonitoringRating: number | null;
}