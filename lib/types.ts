export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar: string;
  slug: string;
  content: string;
  content_ar: string;
  excerpt: string;
  excerpt_ar: string;
  category: string;
  cover_image: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
  published_at: string;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  client_name: string;
  client_name_ar: string;
  images: string[];
  project_url: string;
  tech_stack: string[];
  category: string;
  metric: string;
  color: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
  due_date: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  logo_url: string;
  website_url: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface PartnershipSigningVideo {
  id: string;
  partner_name: string;
  partner_name_ar: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  video_url: string;
  thumbnail_url: string;
  recorded_at: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  product_name: string;
  product_name_ar: string;
  short_description: string;
  short_description_ar: string;
  full_description: string;
  full_description_ar: string;
  product_image_url: string;
  product_url: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface CompanyService {
  id: string;
  title: string;
  title_ar: string;
  short_description: string;
  short_description_ar: string;
  description: string;
  description_ar: string;
  slug: string;
  icon: string;
  color: string;
  category: string;
  category_ar: string;
  benefits: string[];
  benefits_ar: string[];
  process: string[];
  process_ar: string[];
  ecosystem_angle: number;
  show_on_homepage: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface TeamMember {
  name: string;
  name_ar: string;
  role: string;
  role_ar: string;
  bio: string;
  bio_ar: string;
  image?: string;
}
