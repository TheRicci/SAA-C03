import { redirect } from "next/navigation";

type RedirectPageProps = {
  params: Promise<{ groupSlug: string }>;
};

export default async function Page({ params }: RedirectPageProps) {
  const { groupSlug } = await params;
  redirect(`/v2/sections/${groupSlug}`);
}
