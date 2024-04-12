import { Box } from '@mui/system';
import CreateElectionForm from '@app/client/components/CreateElectionForm';
import Header from '@app/client/components/Header';
import Layout from '@app/client/components/Layout';
import { Role } from '@libs/core/database/enums';

function NewVotePage() {
  return (
    <Layout>
      <Header />
      <Box
        component={'main'}
        marginLeft={'auto'}
        marginRight={'auto'}
        mt={2}
        padding={'32px'}
        maxWidth={1100}
      >
        <CreateElectionForm />
      </Box>
    </Layout>
  );
}

export default NewVotePage;
export async function getStaticProps() {
  return {
    props: {
      protected: true,
      userTypes: [Role.Admin],
    },
  };
}
