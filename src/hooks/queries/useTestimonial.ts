import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponseDto } from '../../dto';
import { testimonialApi } from '../../api/testimonialApi';
import type {
  CreateTestimonialDto,
  FilterTestimonialDto,
  TestimonialDto,
  UpdateTestimonialDto,
} from '../../dto/testimonial.dto';
import { showToast } from '../../utils';

/**
 * Get Testimonials (Paginated)
 */
export const useTestimonials = (filters?: FilterTestimonialDto) => {
  return useQuery<PaginatedResponseDto<TestimonialDto>>({
    queryKey: ['testimonials', filters],
    queryFn: async () => {
      return testimonialApi.getTestimonials(filters);
    },
  });
};

/** CREATE TESTIMONIAL
 *
 */
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestimonialDto) => {
      const response = testimonialApi.createTestimonial(data);

      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to create testimonial');
      // }

      return response;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      showToast.success('Testimonial Created Successfully');
    },
  });
};

//UPDATE TESTIMONIAL
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialDto }) => {
      const response = testimonialApi.updateTestimonial(id, data);

      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to update testimonial');
      // }
      return response;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      showToast.success('Testimonial Updated Successfully');
    },
  });
};

//DELETE TESTIMONIAL
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const response = testimonialApi.deleteTestimonial(id);

      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to Delete');
      // }
      return response;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      showToast.success('Testimonial Deleted Successfully');
    },
  });
};
