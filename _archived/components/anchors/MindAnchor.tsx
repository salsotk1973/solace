"use client";

import MindAnchor3D from "./MindAnchor3D";

type MindAnchorProps = {
  isUntangling?: boolean;
  isResolved?: boolean;
};

export default function MindAnchor({
  isUntangling = false,
  isResolved = false,
}: MindAnchorProps) {
  return <MindAnchor3D isUntangling={isUntangling} isResolved={isResolved} />;
}