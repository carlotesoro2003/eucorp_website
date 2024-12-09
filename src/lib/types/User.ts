// src/lib/types/User.ts
export interface User {
    session: any | null; // Replace `any` with a specific type if available from Supabase
    isVerified: boolean;
    userRole: string | null;
    departmentName: string;
    profilePic: string | null;
    email: string | null;
    firstName: string; 
    lastName: string;  
  }
  