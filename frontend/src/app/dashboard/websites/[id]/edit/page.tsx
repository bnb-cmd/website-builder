import EditorPage from '@/pages/EditorPage'

export default async function EditWebsite({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditorPage />
}
