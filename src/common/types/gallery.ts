export interface GalleryItemProps {
  id?: number;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryResponse {
  data: GalleryItemProps[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateGalleryRequest {
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured?: boolean;
  is_published?: boolean;
}

export interface UpdateGalleryRequest extends CreateGalleryRequest {
  id: number;
}
