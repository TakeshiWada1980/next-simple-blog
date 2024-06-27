import { GET as getCategories } from "./_handlers/get";
import { POST as postCategory } from "./_handlers/post";

// [GET] /api/admin/categories
export const GET = getCategories;

// [POST] /api/admin/categories
export const POST = postCategory;
