import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  lazy,
  useEffect,
  useState,
  useCallback,
} from "react";

const BlogPostsGrid = lazy(
  () => import("../components/BlogPostsGrid")
);

import { usePostQueryService } from "../services/PostQueryServiceContext";

import { Post } from "../types";

export default function Blog() {
  const svc = usePostQueryService();

  // undefined = loading
  const [posts, setPosts] = useState<Post[] | undefined>(
    undefined
  );

  const [error, setError] = useState<string | null>(null);

  const [hasNext, setHasNext] = useState(false);

  const [hasPrev, setHasPrev] = useState(false);

  // --- Initial load ---
  useEffect(() => {
    if (!svc) return;

    let cancelled = false;

    svc.reset();

    svc
      .getFiltered({
        pageSize: 10,
      })
      .then((res) => {
        if (cancelled) return;

        setPosts(res.data);
        setHasNext(res.hasNext);
        setHasPrev(res.hasPrev);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [svc]);

  // --- Filter ---
  const load = useCallback(
    async (params?: { tags?: string[] }) => {
      try {
        if (params?.tags) {
          svc!.reset();
        }

        const res = await svc!.getFiltered({
          pageSize: 10,
          tags: params?.tags,
        });

        setPosts(res.data);
        setHasNext(res.hasNext);
        setHasPrev(res.hasPrev);

        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      }
    },
    [svc]
  );

  // --- Next page ---
  const handleNext = useCallback(async () => {
    try {
      const res = await svc!.next({ pageSize: 10 });

      setPosts(res.data);
      setHasNext(res.hasNext);
      setHasPrev(res.hasPrev);

      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  }, [svc]);

  // --- Previous page ---
  const handlePrev = useCallback(async () => {
    try {
      const res = await svc!.prev({ pageSize: 10 });

      setPosts(res.data);
      setHasNext(res.hasNext);
      setHasPrev(res.hasPrev);

      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  }, [svc]);

  const loading = posts === undefined && error === null;

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!posts) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div data-testid="blog-page">
        <Typography variant="h1" gutterBottom>
          Posts
        </Typography>

        <Typography>
          Browse all articles posted by our contributors
        </Typography>
      </div>

      <BlogPostsGrid
        rows={posts}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onNext={handleNext}
        onPrev={handlePrev}
        onFilterChange={(tags) => {
          svc!.reset();
          load({ tags });
        }}
      />
    </Box>
  );
}