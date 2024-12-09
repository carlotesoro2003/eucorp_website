// src/lib/stores/userStore.ts
import { writable } from "svelte/store";
import type { User } from "$lib/types/User";

export const userStore = writable<User>({
  session: null,
  isVerified: false,
  userRole: "user",
  departmentName: "",
  profilePic: null,
  email: null,
  firstName: "New",  // Default value
  lastName: "User",  // Default value
});
