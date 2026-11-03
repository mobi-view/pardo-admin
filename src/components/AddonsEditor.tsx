"use client";

import { moveListItem } from "@/lib/list";
import type { AddonDraft } from "@/types/menu";

type AddonsEditorProps = {
    addons: AddonDraft[];
    onChange: (addons: AddonDraft[]) => void;
};

export default function AddonsEditor({ addons, onChange }: AddonsEditorProps) {
    const updateAddon = (index: number, changes: Partial<AddonDraft>) => {
        onChange(
            addons.map((addon, addonIndex) =>
                addonIndex === index ? { ...addon, ...changes } : addon
            )
        );
    };

    const addAddon = () => {
        onChange([
            ...addons,
            { key: crypto.randomUUID(), name_ar: "", name_en: "", price: "0", is_active: true },
        ]);
    };

    const removeAddon = (index: number) => {
        onChange(addons.filter((_, addonIndex) => addonIndex !== index));
    };

    return (
        <div className="form-field">
            <span className="form-label">الإضافات (Extras)</span>

            <div className="addons-editor">
                {addons.length === 0 && <span className="form-hint">ما في إضافات لهذا الصنف</span>}

                {addons.map((addon, index) => (
                    <div className="addon-editor-row" key={addon.key}>
                        <input
                            className="form-input"
                            placeholder="الاسم بالعربي"
                            value={addon.name_ar}
                            onChange={(event) => updateAddon(index, { name_ar: event.target.value })}
                            required
                        />
                        <input
                            className="form-input"
                            dir="ltr"
                            placeholder="Name in English"
                            value={addon.name_en}
                            onChange={(event) => updateAddon(index, { name_en: event.target.value })}
                        />
                        <input
                            className="form-input"
                            dir="ltr"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="السعر"
                            value={addon.price}
                            onChange={(event) => updateAddon(index, { price: event.target.value })}
                            required
                        />
                        <label className="form-checkbox-row">
                            <input
                                type="checkbox"
                                checked={addon.is_active}
                                onChange={(event) =>
                                    updateAddon(index, { is_active: event.target.checked })
                                }
                            />
                            <span>ظاهرة</span>
                        </label>
                        <div className="row-actions">
                            <button
                                type="button"
                                className="icon-button"
                                disabled={index === 0}
                                onClick={() => onChange(moveListItem(addons, index, -1))}
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                className="icon-button"
                                disabled={index === addons.length - 1}
                                onClick={() => onChange(moveListItem(addons, index, 1))}
                            >
                                ↓
                            </button>
                            <button
                                type="button"
                                className="icon-button icon-button-danger"
                                onClick={() => removeAddon(index)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" className="secondary-button add-row-button" onClick={addAddon}>
                    + إضافة خيار
                </button>
            </div>
        </div>
    );
}