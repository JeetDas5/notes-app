"use client";

import { axiosInstance } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { z } from "zod";
import { loginSchema, signupSchema } from "@/validations";

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await axiosInstance.post("/api/auth/signin", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.me, { user: data.user });
      toast.success("Signed in successfully");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await axiosInstance.post("/api/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
