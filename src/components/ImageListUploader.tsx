"use client";

import { useState, type ChangeEvent } from "react";
import { uploadImage } from "@/lib/storage";
import { moveListItem } from "@/lib/list";
import type { ImageDraft } from "@/types/menu";

type ImageListUploaderProps = {
    label: string;
    hint?: string;
    images: ImageDraft[];
    folder: string;
    onChange: (images: ImageDraft[]) => void;
};

export default function ImageListUploader({
    label,
    hint,
    images,
    folder,
    onChange,
}: ImageListUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        setIsUploading(true);
        setErrorMessage("");

        try {
            const uploadedImages: ImageDraft[] = [];

            for (const file of files) {
                uploadedImages.push({
                    key: crypto.randomUUID(),
                    image_url: await uploadImage(file, folder),
                });
            }

            onChange([...images, ...uploadedImages]);
        } catch {
            setErrorMessage("فشل رفع الصور، تأكد إن حجم كل صورة أقل من 5MB");
        }

        setIsUploading(false);
        event.target.value = "";
    };

    return (
        <div className="form-field">
            <span className="form-label">{label}</span>

            <div className="image-list">
                {images.map((image, index) => (
                    <div className="image-list-item" key={image.key}>
                        <img className="image-list-preview" src={image.image_url} alt="" />
                        {index === 0 && <span className="image-list-badge">الرئيسية</span>}

                        <div className="image-list-actions">
                            <button
                                type="button"
                                className="icon-button"
                                disabled={index === 0}
                                onClick={() => onChange(moveListItem(images, index, -1))}
                            >
                                →
                            </button>
                            <button
                                type="button"
                                className="icon-button"
                                disabled={index === images.length - 1}
                                onClick={() => onChange(moveListItem(images, index, 1))}
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                className="icon-button icon-button-danger"
                                onClick={() =>
                                    onChange(images.filter((_, imageIndex) => imageIndex !== index))
                                }
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <label className="image-list-add">
                    {isUploading ? "جاري الرفع..." : "+ إضافة صور"}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={isUploading}
                        onChange={handleFilesChange}
                    />
                </label>
            </div>

            {hint && <span className="form-hint">{hint}</span>}
            {errorMessage && <p className="form-error">{errorMessage}</p>}
        </div>
    );
}