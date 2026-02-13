export interface TestimonialDto {
  _id: string;
  name: string;
  role: string;
  review: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialDto {
  name: string;
  role: string;
  review: string;
  image?: string | null;
}

export interface UpdateTestimonialDto {
  name?: string;
  role?: string;
  review?: string;
  image?: string | null;
}

export interface FilterTestimonialDto {
  page?: number;
  limit?: number;
  search?: string;
}
