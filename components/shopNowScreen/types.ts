export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  mediaId: string | null;
  mediaUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  levelTitle: string;
  levelSlug: string;
  children: Category[];
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
    currentCount: number;
  };
  _links: {
    self: {
      href: string;
    };
    next: null | {
      href: string;
    };
    previous: null | {
      href: string;
    };
    collection: {
      href: string;
    };
  };
  message: string;
}
