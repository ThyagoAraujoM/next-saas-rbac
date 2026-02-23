import { api } from './api-client';

interface getProjectsResponse {
  projects: {
    id: string;
    name: string;
    description: string;
    slug: string;
    ownerId: string | null;
    avatarUrl: string | null;
    organizationId: string;
    createdAt: string;
    owner: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
  }[];
}

export function getProjects(org: string) {
  const result = api.get(`organizations/${org}/projects`).json<getProjectsResponse>();
  return result;
}
