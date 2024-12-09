export interface Opportunity {
	id: number;
	opt_statement: string;
	kpi: string;
	planned_actions: string;
	evaluation: string | null;
	achieved: boolean;
	time_completed: string | null;
}
