import type { PaginatedResponseDto, ApiResponse } from "../dto";
import type { FilterTestimonialDto, TestimonialDto, CreateTestimonialDto, UpdateTestimonialDto } from "../dto/testimonial.dto";
import axiosInstance from "./axiosInstance";


export const testimonialApi = {
  /**
   * Get testimonials (paginated)
   */
  getTestimonials: async (
    filters?: FilterTestimonialDto,
  ): Promise<PaginatedResponseDto<TestimonialDto>> => {
    const response = await axiosInstance.get<ApiResponse<
      PaginatedResponseDto<TestimonialDto>>
    >('/admin/testimonials', {
      params: filters,
    });

    return response.data.data;
  },

  /**
   * Create testimonial
   */
  createTestimonial: async (
    data: CreateTestimonialDto,
  ): Promise<ApiResponse<TestimonialDto>> => {
    const response = await axiosInstance.post<
      ApiResponse<TestimonialDto>
    >('/admin/testimonials', data);

    return response.data;
  },

  /**
   * Update testimonial
   */
  updateTestimonial: async (
    id: string,
    data: UpdateTestimonialDto,
  ): Promise<ApiResponse<TestimonialDto>> => {
    const response = await axiosInstance.patch<
      ApiResponse<TestimonialDto>
    >(`/admin/testimonials/${id}`, data);

    return response.data;
  },

  /**
   * Delete testimonial
   */
  deleteTestimonial: async (
    id: string,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<
      ApiResponse<void>
    >(`/admin/testimonials/${id}`);

    return response.data;
  },

  //UPLOAD IMAGE
uploadImage: async (file: File): Promise<{ data: {url: string} }> => {
  const formData = new FormData();

  formData.append('image', file); // MUST match FileInterceptor('image')

  const response = await axiosInstance.post(
    '/admin/upload/testimonial-image',
    formData,{
        headers:{
            'Content-Type':'multipart/form-data',
        },
    }
    
  );

  return response.data;
},


};
