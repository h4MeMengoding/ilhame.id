/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';

type BlogParamsProps = {
  page?: number;
  per_page?: number;
  search?: string;
};

interface BlogDetailResponseProps {
  status: number;
  data: any;
}

const handleAxiosError = (
  error: AxiosError<any>,
): { status: number; data: any } => {
  if (error?.response) {
    return { status: error?.response?.status, data: error?.response?.data };
  } else {
    return { status: 500, data: { message: 'Internal Server Error' } };
  }
};

export const getBlogList = async ({
  page = 1,
  per_page = 6,
  search,
}: BlogParamsProps): Promise<{ status: number; data: any }> => {
  try {
    const params = { page, per_page, search };
    const response = await axios.get(`/api/blog`, { params });
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};

export const getBlogDetail = async (
  id: number,
): Promise<BlogDetailResponseProps> => {
  try {
    const response = await axios.get(`/api/blog/${id}`);
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};
