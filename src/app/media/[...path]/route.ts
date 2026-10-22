// src/app/media/[...path]/route.ts
// Serves WordPress images and videos from our own domain, so the backend host never appears in page HTML.

import { MEDIA_EXTENSIONS, proxyUpload } from "@/lib/uploadProxy";

interface Props {
  params: Promise<{ path: string[] }>;
}

export async function GET(req: Request, { params }: Props) {
  const { path } = await params;
  return proxyUpload(path, MEDIA_EXTENSIONS, req.headers.get("range"));
}
