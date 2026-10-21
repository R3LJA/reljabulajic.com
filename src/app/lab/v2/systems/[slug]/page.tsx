import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseOrder, getCase, nextCase } from "../cases";
import CaseStudyView from "./CaseStudyView";

export function generateStaticParams() {
  return caseOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `${c.name} | Relja Bulajić`,
    description: c.headline,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  return <CaseStudyView study={c} next={nextCase(slug)} index={caseOrder.indexOf(slug)} total={caseOrder.length} />;
}
