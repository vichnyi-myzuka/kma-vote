export type RoutesKeys =
  | 'root'
  | 'elections'
  | '404'
  | '401'
  | '403'
  | 'createElections'
  | 'viewElection';

type Routes = Record<
  RoutesKeys,
  {
    path: string;
    props: {
      protected: boolean;
      root: boolean;
    };
  }
>;

export type Config = {
  routes: Routes;
};

const config: Config = {
  routes: {
    root: {
      path: '/',
      props: {
        protected: false,
        root: true,
      },
    },
    elections: {
      path: '/elections',
      props: {
        protected: true,
        root: false,
      },
    },
    '404': {
      path: '/404',
      props: {
        protected: false,
        root: false,
      },
    },
    '401': {
      path: '/401',
      props: {
        protected: false,
        root: false,
      },
    },
    '403': {
      path: '/403',
      props: {
        protected: false,
        root: false,
      },
    },
    createElections: {
      path: '/admin/election/create',
      props: {
        protected: true,
        root: false,
      },
    },
    viewElection: {
      path: '/elections/view',
      props: {
        protected: true,
        root: false,
      },
    },
  },
};
export default config;
