import { useUserElectionVotes } from '@app/client/hooks/elections';
import { Box } from '@mui/material';

export default function VotedOptions({ electionId }: { electionId: number }) {
  const { votes } = useUserElectionVotes(electionId);

  return (
    <Box
      component={'main'}
      marginLeft={'auto'}
      marginRight={'auto'}
      mt={2}
      padding={'32px'}
      maxWidth={1100}
    >
      <Box
        component={'h2'}
        fontSize={20}
        fontWeight={600}
        textAlign={'center'}
        marginBottom={4}
      >
        Ваші вибори
      </Box>
      {votes.map((vote) => (
        <Box
          key={vote.id}
          display={'flex'}
          flexDirection={'column'}
          padding={2}
          border={'1px solid #E0E0E0'}
          borderRadius={'var(--border-radius)'}
          marginBottom={2}
        >
          {vote.options.map((option, index) => (
            <Box
              key={index}
              component={'h3'}
              fontSize={16}
              fontWeight={600}
              marginBottom={2}
            >
              {option.student.name}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
