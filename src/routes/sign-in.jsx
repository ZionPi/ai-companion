import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from "@clerk/clerk-react"
export default function SignInPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/conversation'); // Redirect to the target page if signed in
    }
  }, [isSignedIn, navigate]);

  return <div class="flex h-screen">
    <div class="m-auto">
      <SignIn />
    </div>
  </div>;
}