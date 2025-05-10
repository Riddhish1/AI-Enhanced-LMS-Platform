import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signUp, isLoading, error } = useAuthStore();
  
  const validateForm = () => {
    let valid = true;
    
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      valid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await signUp(email, password);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Create your account
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          leftIcon={<Mail size={16} className="text-gray-400" />}
          error={emailError}
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock size={16} className="text-gray-400" />}
          error={passwordError}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock size={16} className="text-gray-400" />}
          error={confirmPasswordError}
        />
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<UserPlus size={16} />}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;