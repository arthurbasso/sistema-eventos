export type Register = {
  id?: number;
  user_id: number;
  event_id: number;
  category: "registered" | "checked-in";
  date: string;
  synchronized: boolean;
};
