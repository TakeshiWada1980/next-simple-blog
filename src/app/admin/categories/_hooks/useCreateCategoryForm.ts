import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoryRequest from "@/app/_types/CategoryRequest";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";

const useFormOptions = {
  // prettier-ignore
  mode: "onChange" as | "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all",
  resolver: zodResolver(CategoryRequest.clientValidationSchema),
};

const useCreateCategoryForm = (
  categoryWithPostCountList: CategoryWithPostCount[] | null | undefined
) => {
  if (categoryWithPostCountList) {
    const forbiddenNames = categoryWithPostCountList.map((c) => c.name);
    const extendedNameValidation =
      CategoryRequest.clientValidationSchema.shape.name.refine(
        (n) => !forbiddenNames.includes(n),
        { message: `この名前を持ったカテゴリは既に存在します。` }
      );
    useFormOptions.resolver = zodResolver(
      CategoryRequest.clientValidationSchema.extend({
        name: extendedNameValidation,
      })
    );
  }

  // フォーム状態管理
  const methods = useForm<CategoryRequest.Payload>(useFormOptions);

  return methods;
};

export default useCreateCategoryForm;
