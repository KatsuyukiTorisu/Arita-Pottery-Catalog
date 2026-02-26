export type Role = 'MEMBER' | 'COMPANY' | 'ADMIN';
export type VisibilityMode = 'PUBLIC' | 'MEMBERS_ONLY' | 'WHITELIST';

export interface SessionPayload {
  userId: string;
  role: Role;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: string;
  membershipId: string;
  name: string;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  phone: string;
  email: string;
  occupation?: string | null;
  role: Role;
  emailVerifiedAt?: Date | null;
  createdAt: Date;
}

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  images: string[];
  ownerUserId: string;
  createdAt: Date;
}

export interface ProductData {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  images: string[];
  price?: number | null;
  category?: string | null;
  tags: string[];
  isPublished: boolean;
  visibilityMode: VisibilityMode;
  createdAt: Date;
  company?: CompanyData;
}
