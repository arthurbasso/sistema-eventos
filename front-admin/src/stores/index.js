import { useAppStore } from "./app.store";
import { useUserStore } from "./user.store";

export const fetchStores = () => {
  const appStore = useAppStore();
  const userStore = useUserStore();

  appStore.fetch();
  userStore.fetch();
}
