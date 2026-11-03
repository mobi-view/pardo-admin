export type Category = {
    id: string;
    slug: string;
    name_ar: string;
    name_en: string | null;
    description_ar: string | null;
    description_en: string | null;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export type CategoryFormValues = {
    slug: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export type ItemImage = {
    id: string;
    image_url: string;
    sort_order: number;
};

export type ItemAddon = {
    id: string;
    name_ar: string;
    name_en: string | null;
    price: number;
    sort_order: number;
    is_active: boolean;
};

export type Item = {
    id: string;
    category_id: string;
    name_ar: string;
    name_en: string | null;
    description_ar: string | null;
    description_en: string | null;
    price: number;
    sort_order: number;
    is_active: boolean;
    item_images: ItemImage[];
    item_addons: ItemAddon[];
};

export type ItemFormValues = {
    category_id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    price: string;
    sort_order: number;
    is_active: boolean;
};

export type ImageDraft = {
    key: string;
    id?: string;
    image_url: string;
};

export type AddonDraft = {
    key: string;
    id?: string;
    name_ar: string;
    name_en: string;
    price: string;
    is_active: boolean;
};