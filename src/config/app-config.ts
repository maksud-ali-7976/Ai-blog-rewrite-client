import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Ai Blog Rewrite",
  version: packageJson.version,
  copyright: `© ${currentYear}, Ai Blog Rewrite .`,
  meta: {
    title: "Ai Blog Rewrite - Modern Next.js Dashboard Starter Template",
    description:
      "Ai Blog Rewrite is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v3, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
