/**
 * PAGE 1: AUTH PAGE
 * Split screen 50/50 layout.
 * AUTH handled by frontier_consult API Gateway
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';

export default function AuthPage() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-svh bg-background">
      {/* LEFT: Registration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col justify-center px-8 py-20 md:w-1/2 md:px-12"
        style={{ boxShadow: '1px 0 0 0 rgba(0,0,0,0.05)' }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <span className="text-xl font-bold tracking-tighter text-foreground">FRONTIER</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Join the distributed network.</p>
          <RegisterForm onSuccess={handleAuthSuccess} />
        </div>
      </motion.div>

      {/* RIGHT: Login */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden w-1/2 flex-col justify-center bg-surface px-12 py-20 md:flex"
      >
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your services.</p>
          <LoginForm onSuccess={handleAuthSuccess} />
        </div>
      </motion.div>
    </div>
  );
}
