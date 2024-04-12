import { motion } from 'framer-motion';

const Layout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 100,
    }}
    style={{ overflow: 'hidden' }}
  >
    {children}
  </motion.div>
);
export default Layout;
