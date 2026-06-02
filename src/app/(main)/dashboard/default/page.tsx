"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  FileText,
  CreditCard,
  TrendingUp,
  Sparkles,
  Activity,
  Zap,
  User,
  BookTemplate,
  Subscript,
  FileEdit,
  BadgeCheck,
  Send,
} from "lucide-react";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, MouseEvent, ReactNode, useEffect } from "react";
import TiltCard from "./components/card";
import Particles from "./components/floating-particles";
import PulseRing from "./components/pulse-ring";
import SparkleIcon from "./components/sparkle";
import AnimatedNumber from "./components/animated-number";
import AnimatedCard from "./components/animated-card";
import useDashboardStore from "./dashboard.service";
import { PageHeader } from "../components/PageHeader";
import { BlogStatusCard } from "../components/BlogstatusCard";
import { StatusBadge } from "../components/StatusBadge";
import useAuthStore, { RoleLevel } from "../../auth/auth.service";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const store = useDashboardStore();

  useEffect(() => {
    store.actions.insights()
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of AI Blog Rewrite Management System"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {user?.super_admin ? <BlogStatusCard
          label="Total Blogs"
          value={store.total_blog}
          icon={FileText}
          tone="primary"
          hint="All blogs"
        /> : <></>}

        {user?.role?.level !== RoleLevel.L3 ? <BlogStatusCard
          label="Draft"
          value={store.draft_blog || 0}
          icon={FileEdit}
          tone="muted"
          hint="Pending review"
        /> : <></>}

        <BlogStatusCard
          label="Reviewed"
          value={store.reviewed_blog}
          icon={BadgeCheck}
          tone="info"
          hint="Ready to publish"
        />
        {user?.role?.level !== RoleLevel.L2 ? <BlogStatusCard
          label="Published"
          value={store.published_blog}
          icon={Send}
          tone="success"
          hint="Live blogs"
        /> : <></>}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Blogs */}
        {user?.super_admin ? <div className="rounded-xl border bg-card lg:col-span-2">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">Recent Blogs</h2>
            <p className="text-xs text-muted-foreground">
              Latest processed blog articles
            </p>
          </div>

          <ul className="divide-y">
            {store.recent_blogs.map((blog) => (
              <li
                key={blog._id}
                className="flex items-center gap-3 px-5 py-3"
              >
                <img
                  src={blog.cover_image}
                  alt={blog.original_title}
                  className="h-12 w-12 rounded-md object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{blog.rewrite_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {blog.source} • {blog.author}
                  </p>
                </div>

                {/* <StatusBadge status={blog.status} /> */}
              </li>
            ))}
          </ul>
        </div> : <></>}

        {/* Audit Logs */}
        {user?.super_admin ? <div className="rounded-xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-xs text-muted-foreground">
              Audit trail overview
            </p>
          </div>

          <ul className="divide-y">
            {store.recent_activity.map((log) => (
              <li key={log._id} className="px-5 py-3">
                <p className="text-sm font-medium">
                  {log.admin?.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {log.action}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {log.entity}
                </p>
              </li>
            ))}
          </ul>
        </div> : <></>}
      </div>
    </div>
  );
}
