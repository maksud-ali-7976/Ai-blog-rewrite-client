"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthStore from "../auth.service";

const FormSchema = z.object({
  email: z.string().min(1, "ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function base64Decode(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParam = useSearchParams();
  const loginToken = searchParam.get("loginToken");

  const authStore = useAuthStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await authStore.actions.login(data);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  //   useEffect(() => {
  //     if (!loginToken) return;

  //     const decoded = base64Decode(loginToken);
  //     const [phone, password] = decoded?.split("|");

  //     if (!phone || !password) return;

  //     onSubmit({ phone, password });
  //   }, [loginToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            StoryGen Admin
          </h1>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Phone / ID */}
              <div className="space-y-2">
                <Label>ID</Label>
                <Input placeholder="Enter ID" {...form.register("email")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-red-500">
                  {form.formState.errors.password?.message}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 StoryGen. All rights reserved.
        </p>
      </div>
    </div>
  );
}
