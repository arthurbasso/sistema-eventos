export type Register = {
  id?: number;
  user_id: number
  category: "registered" | "checked-in";
  date: string;
};
