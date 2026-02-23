"use client";
import dynamic from "next/dynamic";
const ProjectsFeed = dynamic(() => import("./ProjectsFeed"), { ssr: false });

export default function ProjectsFeedClient(props: any) {
  return <ProjectsFeed {...props} />;
}