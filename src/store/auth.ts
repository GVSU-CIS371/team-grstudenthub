import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: {
      uid: null as string | null,
      email: null as string | null,
      displayName: null as string | null,
    },
    registeredUsers: [] as any[],
  }),
  actions: {
    async register(email: string, pass: string, name: string) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        uid: Date.now().toString(),
        email,
        name,
        password: pass,
      };
      this.registeredUsers.push(newUser);
      return { success: true };
    },

    async login(email: string, pass: string) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const found = this.registeredUsers.find(
        (u) => u.email === email && u.password === pass,
      );
      if (found) {
        this.isLoggedIn = true;
        this.user = {
          uid: found.uid,
          email: found.email,
          displayName: found.name,
        };
        return { success: true };
      }
      return { success: false, msg: "Invalid credentials" };
    },

    async logout() {
      this.isLoggedIn = false;
      this.user = {
        uid: null,
        email: null,
        displayName: null,
      };
    },
  },
  persist: true,
});
