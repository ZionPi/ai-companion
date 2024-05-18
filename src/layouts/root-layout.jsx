import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { dark ,light} from '@clerk/themes';
import NavigatorComponent from '../NavigatorComponent'
import PhatomPage from '../PhatomPage';
import ConversationComponent from '../ConversationComponent'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
 
export default function RootLayout() {
  const navigate = useNavigate();
 
  return (
    <ClerkProvider  appearance={{baseTheme: light}} navigate={navigate} publishableKey={PUBLISHABLE_KEY}>
      {/* <header className="header">
        <div>
          <div>
            <p>AI Companion</p>
          </div>
          <SignedIn>
            <UserButton afterSignOutUrl='/sign-in' />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut>
        </div>
      </header> */}
      <div className="flex h-screen">
        <aside className="w-[60px]" aria-label="Sidebar"> {/* Adjust width as needed */}
          <NavigatorComponent />
        </aside>
        <main className='w-full h-full flex-1'>
         <Outlet />
        </main>
      </div>
    </ClerkProvider>
  )
}