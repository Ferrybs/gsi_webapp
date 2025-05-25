export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error_message?: string;
};
