"use client";

import { useState, type ChangeEvent } from "react";
import { uploadImage } from "@/lib/storage";

type ImageUploaderProps = {
    label: string;
    value: string | null;
    folder: string;
    onChange: (imageUrl: string | null) => void;
};

export default function ImageUploader({ label, value, folder, onChange }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage("");

        try {
            onChange(await uploadImage(file, folder));
        } catch {
            setErrorMessage("فشل رفع الصورة، تأكد إن حجمها أقل من 5MB");
        }

        setIsUploading(false);
        event.target.value = "";
    };

    return (
        <div className="form-field">
            <span className="form-label">{label}</span>

            <div className="image-uploader">
                {value ? (
                    <img className="image-uploader-preview" src={value} alt="" />
                ) : (
                    <div className="image-uploader-empty">لا توجد صورة</div>
                )}

                <div className="image-uploader-actions">
                    <label className="secondary-button">
                        {isUploading ? "جاري الرفع..." : value ? "تغيير الصورة" : "اختيار صورة"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            disabled={isUploading}
                            onChange={handleFileChange}
                        />
                    </label>

                    {value && (
                        <button type="button" className="danger-button" onClick={() => onChange(null)}>
                            إزالة
                        </button>
                    )}
                </div>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}
        </div>
    );
}