export type User = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  offline?: boolean;
  is_admin?: boolean;
};
