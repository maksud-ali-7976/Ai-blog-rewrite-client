"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User as UserIcon,
  Pencil,
  Trash2,
  BadgeCheck,
  Send,
  Eye,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import useBlogStore, { BlogGenStatus, BlogStatus } from "../blog.service";
import useAclStore from "@/service/acl.service";

export default function BlogDetailsPage() {
  const store = useBlogStore();
  const {
    ability: { read, update, write, del, publish, review },
  } = useAclStore();

  const router = useRouter();
  const params = useParams();

  const blogId = params.id as string;

  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (blogId) {
      store.actions.detail(blogId);
    }
  }, [blogId]);

  useEffect(() => {
    if (store.detail) {
      setTitle(store.detail.rewrite_title || store.detail.original_title || "");
      setAuthor(store.detail.author || "");
      setRewritten(store.detail.rewrite_content || "");
      setNotes(store.detail.review_notes || "");
    }
  }, [store.detail]);

  useEffect(() => {
    if (!blogId) return;

    const status = store.detail?.gen_status;
    const isProcessing =
      status === BlogGenStatus.QUEUED ||
      status === BlogGenStatus.SCRAPING ||
      status === BlogGenStatus.PROCESSING;

    if (!isProcessing) return;

    const interval = setInterval(async () => {
      const res = await store.actions.detail(blogId);
      const newStatus = res?.data?.gen_status;

      if (newStatus === BlogGenStatus.COMPLETED) {
        toast.success("Blog ready ✨");
      } else if (newStatus === BlogGenStatus.FAILED) {
        toast.error("Blog generation failed");
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [blogId, store.detail?.gen_status]);

  const saveChanges = async () => {
    try {
      store.actions.select(blogId)
      await store.actions.update({
        rewrite_title: title,
        author: author,
        rewrite_content: rewritten,
        reviewer_notes: notes
      })

      setEditing(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const markReviewed = async () => {
    store.actions.select(blogId);
    store.actions.reviewed(BlogStatus.REVIEWED);
  };

  const publishBlog = async () => {
    store.actions.select(blogId);
    store.actions.publish(BlogStatus.PUBLISHED);
  };

  const handleDelete = async () => {
    const req = await store.actions.delete(blogId as any);

    if (req?.status) {
      router.push("/dashboard/blogs")
    }
  };
  if (!store.detail) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }
  const genStatus = store.detail?.gen_status;

  const isProcessing =
    genStatus === BlogGenStatus.QUEUED ||
    genStatus === BlogGenStatus.SCRAPING ||
    genStatus === BlogGenStatus.PROCESSING;

  const isFailed = genStatus === BlogGenStatus.FAILED;
  const isReady = genStatus === BlogGenStatus.COMPLETED;
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <Link href="/dashboard/blogs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back To Blogs
          </Button>
        </Link>

        <span
          className={`rounded-md px-3 py-1 text-sm font-medium
          ${store.detail.status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : store.detail.status === "REVIEWED"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {store.detail.status}
        </span>
      </div>

      {/* Hero Section */}

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative h-[320px]">
          {store.detail.cover_image ? (
            <img
              src={store.detail.cover_image}
              alt={store.detail.original_title || "Blog Cover"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted animate-pulse" />
          )}

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute bottom-0 left-0 w-full p-6">
            <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur">
              Blog Details
            </div>

            {editing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-3 border-white/20 bg-white/10 text-white"
              />
            ) : (
              <h1 className="mt-3 text-3xl font-bold text-white">
                {title || (isProcessing ? "Extracting Title..." : "Untitled Blog")}
              </h1>
            )}
          </div>
        </div>

        {/* Meta */}

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <UserIcon size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Author</p>
              {editing ? (
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1 h-8 text-sm"
                />
              ) : (
                <p className="font-medium">
                  {author || (isProcessing ? "Extracting..." : "Unknown")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Created At</p>
              <p>{new Date(store.detail.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <a
            href={store.detail.original_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-primary hover:underline"
          >
            <ExternalLink size={18} />
            Open Original Blog
          </a>
        </div>
      </div>

      {/* Actions */}

      <div className="flex flex-wrap gap-2 rounded-xl border bg-card p-4">
        {update ? (
          !editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <Button onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )
        ) : (
          <></>
        )}

        {review ? (
          <Button variant="outline" onClick={markReviewed}>
            <BadgeCheck className="mr-2 h-4 w-4" />
            Mark Reviewed
          </Button>
        ) : null}

        {publish ? (
          <Button onClick={publishBlog}>
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        ) : null}

        {del ? (
          <Button
            variant="destructive"
            className="ml-auto"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : (
          <></>
        )}
      </div>

      {/* Content */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original */}

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Original Content</h2>

            <span className="rounded-full bg-muted px-3 py-1 text-xs">
              Source
            </span>
          </div>

          <div className="max-h-[700px] overflow-y-auto">
            {isProcessing && !store.detail.original_content ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-2 border-muted animate-spin border-t-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Scraping original content...
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  Fetching data from the source URL
                </p>
              </div>
            ) : store.detail.original_content ? (
              <p className="whitespace-pre-wrap text-sm leading-7">
                {store.detail.original_content}
              </p>
            ) : (
              <div className="py-20 text-center text-muted-foreground text-sm">
                Original content not available.
              </div>
            )}
          </div>
        </div>

        {/* Rewritten */}

        <div className="rounded-xl border border-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Rewritten Content</h2>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              AI Generated
            </span>
          </div>

          {/* LOADING STATE */}
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <div className="relative">
                <div className="h-10 w-10 rounded-full border-2 border-muted animate-spin border-t-primary" />
              </div>

              <p className="mt-4 text-sm font-medium text-foreground">
                AI is rewriting your blog...
              </p>

              <p className="text-xs mt-1 text-muted-foreground">
                Please wait, this may take a few seconds
              </p>
            </div>
          )}


          {isReady && rewritten && (
            <div className="max-h-[700px] overflow-y-auto">
              {editing ? (
                <Textarea
                  className="min-h-[500px] w-full bg-transparent"
                  value={rewritten}
                  onChange={(e) => setRewritten(e.target.value)}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7">
                  {rewritten}
                </p>
              )}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isProcessing && !isReady && !isFailed && (
            <div className="py-20 text-center text-muted-foreground text-sm">
              Waiting for AI generation to start...
            </div>
          )}

          {/* ERROR STATE */}
          {isFailed && (
            <div className="py-20 text-center text-red-500 text-sm">
              Failed to generate rewritten content. Please try again.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <Label className="font-semibold">Reviewer Notes</Label>

        <Textarea
          className="mt-4"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add reviewer notes..."
          disabled={!editing}
        />
      </div>
    </div>
  );
}
