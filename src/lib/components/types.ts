// Action Plan type
export const ActionPlan = {
	id: String,
	department_name: String,
	actions_taken: String,
	kpi: String,
	target_output: String,
	key_person_responsible: String,
	is_approved: Boolean,
	is_approved_vp: Boolean,
	is_approved_president: Boolean,
};

// User roles
export const UserRoles = {
	ADMIN: "admin",
	VICE_PRESIDENT: "vice_president",
	PRESIDENT: "president",
};
