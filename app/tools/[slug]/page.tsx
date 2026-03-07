import { notFound } from "next/navigation"

import ToolShell from "@/components/ToolShell"
import { TOOLS } from "@/lib/tools"

import ClarityTool from "@/components/tools/ClarityTool"
import OverthinkingBreakerTool from "@/components/tools/OverthinkingBreakerTool"
import PriorityResetTool from "@/components/tools/PriorityResetTool"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params

  const tool = TOOLS.find((t) => t.slug === slug)

  if (!tool) {
    notFound()
  }

  let content = null

  if (slug === "clarity") {
    content = <ClarityTool />
  } else if (slug === "overthinking-breaker") {
    content = <OverthinkingBreakerTool />
  } else if (slug === "priority-reset") {
    content = <PriorityResetTool />
  } else {
    notFound()
  }

  return (
    <ToolShell title={tool.name} subtitle={tool.tagline}>
      {content}
    </ToolShell>
  )
}