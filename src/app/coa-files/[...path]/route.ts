// src/app/coa-files/[...path]/route.ts
// Serves COA PDFs from our own domain, so the WordPress address never shows in the browser bar.

import { PDF_EXTENSIONS, proxyUpload } from "@/lib/uploadProxy";

interface Props {
  params: Promise<{ path: string[] }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { path } = await params;
  const response = await proxyUpload(path, PDF_EXTENSIONS);
  if (!response.ok) return response;

  const headers = new Headers(response.headers);
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", `inline; filename="${path[path.length - 1].replace(/"/g, "")}"`);
  return new Response(response.body, { headers });
}
