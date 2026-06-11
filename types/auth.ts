export interface AuthActionState {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: null,
};
