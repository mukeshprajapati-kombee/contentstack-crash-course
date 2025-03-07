"use client";

import { initLivePreview } from "@/app/contentstack-sdk";
import React, { useEffect } from "react";

export function ContentstackLivePreview({
  children,
}: {
  children?: React.ReactNode;
}) {
  const livePreviewEnabled =
    process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true";

  useEffect(() => {
    if (livePreviewEnabled) {
      initLivePreview();
    }
  }, []);

  return <>{children}</>;
}
