import { useEffect, useState } from 'react';
import {
  getCanVote,
  getElectionProgress,
  getElectionResults,
  getSelectedStudentsByElectionId,
  getUserVotesForElection,
} from '@app/client/api';
import { ElectionOptionProgressDto } from '@libs/core/dto';
import {
  BaseStudent,
  ElectionResult,
  Vote,
} from '@libs/core/database/entities';

export const useElectionSelectedStudents = (
  id: number,
): {
  students: BaseStudent[];
  loading: boolean;
  fetchOptions: () => Promise<void>;
} => {
  const [students, setStudents] = useState<BaseStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOptions = async () => {
    setLoading(true);
    setStudents(await getSelectedStudentsByElectionId(id));
    setLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, [id]);

  return { students, loading, fetchOptions };
};

export const useElectionProgress = (
  id: number,
): {
  progress: ElectionOptionProgressDto[];
  loading: boolean;
  fetchProgress: () => Promise<void>;
} => {
  const [progress, setProgress] = useState<ElectionOptionProgressDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProgress = async () => {
    setLoading(true);
    setProgress(await getElectionProgress(id));
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [id]);

  return { progress, loading, fetchProgress };
};

export const useElectionResults = (
  id: number,
): {
  results: ElectionResult[];
  loading: boolean;
  fetchProgress: () => Promise<void>;
} => {
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProgress = async () => {
    setLoading(true);
    setResults(await getElectionResults(id));
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [id]);

  return { results, loading, fetchProgress };
};

export const useCanVote = (
  electionId?: number,
): {
  canVote: boolean;
  loading: boolean;
  fetchCanVote: () => Promise<void>;
} => {
  const [canVote, setCanVote] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCanVote = async () => {
    if (!electionId) {
      return;
    }
    setLoading(true);
    setCanVote(await getCanVote(electionId));
    setLoading(false);
  };

  useEffect(() => {
    fetchCanVote();
  }, [electionId]);

  return { canVote, loading, fetchCanVote };
};

export const useUserElectionVotes = (
  electionId: number,
): {
  votes: Vote[];
  loading: boolean;
  fetchVotes: () => Promise<void>;
} => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const votes = await getUserVotesForElection(electionId);
      setVotes(votes);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [electionId]);

  return { votes, loading, fetchVotes };
};
