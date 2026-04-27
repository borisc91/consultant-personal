"use client";

import ReactDOM from "react-dom";

type PreloadResourcesProps = {
  heroPosterSrc?: string;
};

export function PreloadResources({ heroPosterSrc }: PreloadResourcesProps) {
  if (heroPosterSrc) {
    ReactDOM.preload(heroPosterSrc, {
      as: "image",
      fetchPriority: "high",
    });
  }

  return null;
}
