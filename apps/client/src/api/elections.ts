import {
  BaseStudent,
  Election,
  ElectionOption,
  ElectionResult,
  Vote,
} from '@libs/core/database/entities';
import axios from 'axios';
import {
  ElectionsFilterModel,
  FilterOptionsData,
} from '@libs/core/database/types';
import {
  UpdateElectionDataDto,
  ElectionOptionProgressDto,
  ElectionDataDto,
} from '@libs/core/dto';

export const getAllElections = async (
  take: number,
  skip: number,
  filter?: ElectionsFilterModel,
): Promise<{ data: Election[]; total: number }> => {
  return (
    await axios.get(`/api/election`, {
      params: {
        take,
        skip,
        filter,
      },
    })
  ).data;
};

export const hideElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/hide/${id}`)).data;
};

export const showElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/show/${id}`)).data;
};

export const deleteElection = async (id: number): Promise<void> => {
  await axios.delete(`/api/election/${id}`);
};

export const getElectionBySlug = async (
  slug: string,
): Promise<{ election: Election; isVoted: boolean }> => {
  return (await axios.get(`/api/election/slug/${slug}`)).data;
};

export const getSelectedStudentsByElectionId = async (
  id: number,
): Promise<BaseStudent[]> => {
  return (await axios.get(`/api/election/${id}/students`)).data;
};

export const updateElection = async (
  electionId: number,
  updateElectionDataDto: UpdateElectionDataDto,
): Promise<Election> => {
  return (
    await axios.patch(`/api/election/${electionId}`, updateElectionDataDto)
  ).data;
};

export const startElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/start/${id}`)).data;
};

export const cancelElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/cancel/${id}`)).data;
};

export const completeElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/complete/${id}`)).data;
};

export const pauseElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/pause/${id}`)).data;
};

export const resumeElection = async (id: number): Promise<Election> => {
  return (await axios.post(`/api/election/resume/${id}`)).data;
};

export const getAllAvailableElections = async (
  take: number,
  skip: number,
): Promise<{ data: Election[]; total: number }> => {
  return (
    await axios.get(`/api/election/available`, {
      params: {
        take,
        skip,
      },
    })
  ).data;
};

export const getVotedElections = async (
  take: number,
  skip: number,
): Promise<{ data: Election[]; total: number }> => {
  return (
    await axios.get(`/api/election/voted`, {
      params: {
        take,
        skip,
      },
    })
  ).data;
};

export const getElectionProgress = async (
  id: number,
): Promise<ElectionOptionProgressDto[]> => {
  return (await axios.get(`/api/votes/election-progress/${id}`)).data;
};

export const getElectionResults = async (
  id: number,
): Promise<ElectionResult[]> => {
  return (await axios.get(`/api/election/${id}/results`)).data;
};

export const getCanVote = async (id: number): Promise<boolean> => {
  return (await axios.get(`/api/election/${id}/can-vote`)).data;
};

export const voteForStudents = async (
  id: number,
  options: ElectionOption[],
): Promise<Vote> => {
  return (
    await axios.post(`/api/votes/vote/${id}`, {
      options,
    })
  ).data;
};

export async function loadAllFilterOptions(
  callback: (
    faculties: string[],
    specialties: Map<string, Map<string, string>>,
    degreeLevels: Map<string, string>,
    degreeYears: Map<string, string>,
  ) => void,
) {
  try {
    const {
      faculties,
      specialties,
      degreeLevels,
      degreeYears,
    }: FilterOptionsData = (await axios.get(`/api/filterOptions/`)).data;
    callback(faculties, specialties, degreeLevels, degreeYears);
  } catch (e) {
    console.log(e);
  }
}

export async function createElection(data: ElectionDataDto) {
  return axios.post(`/api/election/`, data);
}
