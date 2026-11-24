import { del, get, head } from "@vercel/blob";

const token = () => process.env.BLOB_READ_WRITE_TOKEN;
export const blobEnabled = () => Boolean(token());

export async function headDocument(pathname) {
  return head(pathname, { token: token(), abortSignal: AbortSignal.timeout(15000) });
}

export async function readDocument(pathname) {
  return get(pathname, { token: token(), access: "private", useCache: false, abortSignal: AbortSignal.timeout(60000) });
}

export async function deleteDocument(pathname) {
  try {
    await del(pathname, { token: token() });
  } catch (error) {
    console.error("[DOCUMENTS] delete failed", pathname, error.message);
  }
}
