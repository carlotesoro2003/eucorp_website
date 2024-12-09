import { supabase } from "$lib/supabaseClient";

/**
 * Fetch profile details for a given user ID.
 * @param userId - The ID of the user.
 * @returns The profile data, or null if not found.
 */
export const fetchProfileDetails = async (userId: string) => {
  try {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("id, role, is_verified, profile_pic, department_id, email")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // User not found in the profiles table
        return { notFound: true, data: null };
      }
      throw new Error(error.message);
    }

    return { notFound: false, data: profileData };
  } catch (err) {
    console.error("Error fetching profile details:", err);
    throw err;
  }
};

/**
 * Fetch department name for a given department ID.
 * @param departmentId - The ID of the department.
 * @returns The department name, or "No Department" if not found.
 */
export const fetchDepartmentName = async (departmentId: string) => {
  try {
    const { data: departmentData, error } = await supabase
      .from("departments")
      .select("name")
      .eq("id", departmentId)
      .single();

    if (error) {
      console.error("Error fetching department name:", error.message);
      return "No Department";
    }

    return departmentData?.name || "No Department";
  } catch (err) {
    console.error("Error fetching department details:", err);
    return "No Department";
  }
};

/**
 * Insert a new profile for a user.
 * @param user - The user object from the session.
 */
export const insertNewProfile = async (user: any) => {
  try {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "New",
      last_name: user.user_metadata?.last_name || "User",
      role: "user",
      is_verified: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("New user added to profiles.");
  } catch (err) {
    console.error("Error adding new user to profiles:", err);
    throw err;
  }
};
