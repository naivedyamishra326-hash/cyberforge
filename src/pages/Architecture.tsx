import { motion } from 'framer-motion';
import './Architecture.css';

export default function Architecture() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="arch-page">
      <motion.div className="arch-canvas" variants={container} initial="hidden" animate="show">
        <motion.div className="arch-group" variants={item}>
          <div className="arch-node">USER (CLIENT)</div>
          <div className="arch-arrow" />
        </motion.div>

        <motion.div className="arch-group" variants={item}>
          <div className="arch-node">FRONTEND APP</div>
          <div className="arch-arrow" />
        </motion.div>

        <motion.div className="arch-group" variants={item}>
          <div className="arch-node arch-node--accent">API GATEWAY</div>
          <div className="arch-arrow" />
        </motion.div>

        <div className="arch-row">
          <motion.div className="arch-group" variants={item}>
            <div className="arch-node">SECURITY ENGINE</div>
            <div className="arch-arrow" />
          </motion.div>

          <motion.div className="arch-group" variants={item}>
            <div className="arch-node">AI / ML MODULE</div>
            <div className="arch-arrow" />
          </motion.div>
        </div>

        <motion.div className="arch-group" variants={item}>
          <div className="arch-node">DATABASE</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
