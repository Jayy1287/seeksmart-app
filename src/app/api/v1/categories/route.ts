import { apiInternalError, apiOk } from "@/server/http/responses";
import { listCategories } from "@/server/categories/queries";

export async function GET() {
  try {
    const categories = await listCategories();

    return apiOk({ categories });
  } catch (error) {
    console.error(error);
    return apiInternalError();
  }
}

