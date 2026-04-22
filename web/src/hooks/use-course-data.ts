import { useState, useEffect } from "react";
import type { CourseData, CourseIndexEntry } from "../types";

export function useCourseData(slug: string): CourseData | null {
  const [data, setData] = useState<CourseData | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      return;
    }
    import(`../data/${slug}.json`)
      .then((mod) => {
        setData(mod.default as CourseData);
      })
      .catch(() => {
        setData(null);
      });
  }, [slug]);

  return data;
}

export function useCourseIndex(): CourseIndexEntry[] {
  const [index, setIndex] = useState<CourseIndexEntry[]>([]);

  useEffect(() => {
    import("../data/courses.json").then((mod) => {
      setIndex(mod.default as CourseIndexEntry[]);
    });
  }, []);

  return index;
}
