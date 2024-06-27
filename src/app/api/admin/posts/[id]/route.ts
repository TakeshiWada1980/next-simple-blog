import { GET as getPost } from "@/app/api/posts/[id]/route";

// [GET] /api/admin/post/:id
// NOTE: 現状で /apy/posts/route.ts と同じ内容
export const GET = getPost;
