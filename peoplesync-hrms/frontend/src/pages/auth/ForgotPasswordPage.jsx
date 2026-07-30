import React, { useState } from 'react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface dark:bg-surface-cardDark border border-border/80 dark:border-border-dark rounded-3xl shadow-2xl p-8">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-slate-text dark:hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-text dark:text-gray-100">Reset Email Sent!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We have sent password recovery instructions to <strong className="text-slate-text dark:text-gray-200">{email}</strong>.
            </p>
            <Button variant="outline" className="w-full mt-4" onClick={() => setSubmitted(false)}>
              Resend Link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-text dark:text-gray-100">Reset Password</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter your work email address and we'll send you a password reset token.
              </p>
            </div>

            <FormInput
              label="Work Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@company.com"
              required
            />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Send Reset Instructions
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
