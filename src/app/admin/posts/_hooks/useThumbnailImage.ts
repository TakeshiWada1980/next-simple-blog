import React, { ChangeEvent, useEffect, useState } from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import { calculateMD5Hash } from "@/app/_utils/common";
import { supabase } from "@/utils/supabase";
import { bucketName } from "@/app/_utils/envConfig";

const useThumbnailImage = () => {
  const { setValue, watch } = useFormContext();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null
  );
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    const imageKey = watch("thumbnailImageKey") as string;
    if (imageKey) {
      setThumbnailImageKey(imageKey);
    }
  }, []);

  useEffect(() => {
    if (!thumbnailImageKey) return;
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [thumbnailImageKey]);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileHash = await calculateMD5Hash(file);
    const filePath = `private/${fileHash}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setValue("thumbnailImageKey", data.path);
    setThumbnailImageKey(data.path);
  };

  return {
    thumbnailImageUrl,
    handleImageChange,
  };
};

export default useThumbnailImage;
