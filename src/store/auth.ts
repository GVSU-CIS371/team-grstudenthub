import { defineStore } from "pinia";
import { auth, googleProvider } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    loading: true,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async login(email: string, pass: string) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        this.user = result.user;
      } catch (error: any) {
        console.error("Firebase Auth Error:", error.code);
        throw error;
      }
    },

    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        this.user = result.user;
      } catch (error) {
        console.error("Google Login failed:", error);
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },

    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.loading = false;
      });
    },

    async register(email: string, pass: string) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        this.user = result.user;
      } catch (error: any) {
        console.error("Registration failed:", error.code);
        throw error;
      }
    },
  },
});
