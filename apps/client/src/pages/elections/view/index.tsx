import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import { useSnackbar } from 'notistack';
import styles from '../styles.module.scss';
import { userStore } from '@app/client/storage';
import { useCanVote } from '@app/client/hooks/elections';
import { getElectionBySlug, isAdmin } from '@app/client/api';
import config from '@libs/configs/next';
import { Election } from '@libs/core/database/entities';
import { ElectionStatus } from '@libs/core/database/enums';
import Header from '@app/client/components/Header';
import Layout from '@app/client/components/Layout';
import ElectionInfo from '@app/client/components/ElectionInfo';
import ConfirmationDialog from '@app/client/components/ConfirmationDialog';
import { ConfirmationContext } from '@app/client/components/ConfirmationDialog/ConfirmationContext';
import ElectionPageAdminPanel from '@app/client/components/ElectionPageAdminPanel';
import ControlledPageLoader from '@app/client/components/PageLoader/ControlledPageLoader';
import ElectionResults from '@app/client/components/ElectionResults';
import ElectionVote from '@app/client/components/ElectionVote';
import VotedOptions from '@app/client/components/VotedOptions';

export default function ElectionPage() {
  const router = useRouter();
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [election, setElection] = useState<Election | undefined>();
  const { enqueueSnackbar } = useSnackbar();

  const updateElection = async (): Promise<void> => {
    setIsLoading(true);
    if (router.query.name) {
      const slug = router.query.name;
      if (typeof slug === 'string') {
        const { election, isVoted } = await getElectionBySlug(slug);
        setElection(election);
        setIsVoted(isVoted);
        setTimeout(() => {
          setIsLoading(false);
          console.log('Election updated');
          enqueueSnackbar('Голосування оновлено', {
            variant: 'success',
            autoHideDuration: 5000,
          });
        }, 200);
      }
    }
  };

  const doesElectionExist = async (): Promise<boolean> => {
    setIsLoading(true);
    if (!router.query.name) return true;
    try {
      const slug = router.query.name;
      if (typeof slug === 'string') {
        clearTimeout(timer);
        const { election, isVoted } = await getElectionBySlug(slug);
        setElection(election);
        setIsVoted(isVoted);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return !!election;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const guard = async () => {
    const exists = await doesElectionExist();
    if (!exists) {
      await router.push(config.routes['404'].path);
    }
  };

  const { canVote } = useCanVote(election?.id);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const name = router.query.name;
      if (!name) {
        await router.push(config.routes['404'].path);
      }
    }, 1000);
    setTimer(timer);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    guard();
  }, [router.query.name]);

  useEffect(() => {
    if (router.query.edit) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [router.query.edit]);

  const user = useStore(userStore);
  const confirmationDialogRef = useRef(null);

  return (
    <Layout>
      <ControlledPageLoader isLoading={isLoading} />
      <ConfirmationDialog ref={confirmationDialogRef} />
      <Header />
      <ConfirmationContext.Provider value={{ confirmationDialogRef }}>
        <main className={styles.mainContainer}>
          {!!election && <ElectionInfo election={election} isVoted={isVoted} />}
          {isAdmin(user) || process.env.NODE_ENV === 'development' ? (
            <ElectionPageAdminPanel
              election={election}
              onElectionUpdate={updateElection}
            />
          ) : null}
          {!!election && isVoted && <VotedOptions electionId={election.id} />}
          {!!election && election.status === ElectionStatus.COMPLETED && (
            <ElectionResults election={election} />
          )}
          {!!election && canVote && <ElectionVote election={election} />}
        </main>
      </ConfirmationContext.Provider>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      protected: true,
      root: false,
    },
  };
}
