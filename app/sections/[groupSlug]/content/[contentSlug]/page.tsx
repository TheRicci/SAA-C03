import { redirect } from "next/navigation";

type RedirectPageProps = {
  params: Promise<{ groupSlug: string; contentSlug: string }>;
};

export default async function Page({ params }: RedirectPageProps) {
  const { groupSlug, contentSlug } = await params;
  redirect(`/v2/sections/${groupSlug}/content/${contentSlug}`);
}
