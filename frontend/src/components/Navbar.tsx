import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeftStartOnRectangleIcon,
  CogIcon,
  HomeIcon
} from '@heroicons/react/16/solid'

const menu_navigation = [
  { name: 'Home', href: '/', protected: false, current: true },
  { name: 'Services', href: '#', protected: false, current: false },
  { name: 'Pricing', href: '#', protected: false, current: false },
  { name: 'Protected', href: '/protected', protected: true, current: false },
  { name: 'About', href: '/about', protected: false, current: false },
]

const profile_navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function NavBar() {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);  // Profile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  // Mobile menu state

  if (status === 'loading') {
    return null;
  }

  if (session?.error === 'RefreshFailed') {
    signOut({ callbackUrl: "/auth/signin" });
  }

  return (
    <div className="flex flex-wrap items-center justify-between mx-auto p-2 md:p-4 bg-gray-100 border-gray-200 dark:bg-gray-900">
      {/* Logo and company name */}
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image src="/skeleton.png" width={38} height={38} alt="Skeleton Logo" />
        <span className="self-center sm:text-2xl font-semibold whitespace-nowrap dark:text-white">Skeleton</span>
      </a>

      {/* menu_navigation */}
      <div id="menu-navigation"
        className={
          "absolute md:static top-16 sm:top-12 left-0 w-full md:flex md:w-auto md:order-1 " +
          (isMobileMenuOpen ? "block" : "hidden")
        }
      >
        <ul className="flex flex-col font-medium p-2 md:p-0 mt-2 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-100 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {
            menu_navigation.map((item) => (
              (item.protected && session) || (!item.protected))
              ?
              <li key={item.name}>
                <a href={item.href} aria-current={item.current ? 'page' : undefined}
                  className={
                    "block py-2 px-3 rounded md:p-0 xl:text-2xl xl:px-4 2xl:text-3xl 2xl:px-6 " +
                    (item.current
                      ? "text-white md:text-blue-700 md:dark:text-blue-500 bg-blue-700 md:bg-transparent"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:border-gray-700 md:dark:hover:bg-transparent dark:hover:text-white dark:hover:bg-gray-700"
                    )
                  }
                >
                  {item.name}
                </a>
              </li>
              : null
            )
          }
        </ul>
      </div>

      <div id="right-options" className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        {/* Button to open profile menu */}
        {session && session.user ?
          <div className='relative'>
            <button id="profile-menu-button" type="button" 
              className="flex bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-expanded={isProfileOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open user menu</span>
              <Image src={session.user.picture || "/profile.png"}
                width={32} height={32} alt='user photo' priority={false}
                className="rounded-full"
              />
            </button>
            {/* Profile Dropdown menu */}
            {isProfileOpen && (
              <div id="user-dropdown" className="absolute right-0 mt-1 z-50 text-base list-none rounded-lg shadow bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {session.user.name}
                  </span>
                  <span className="block text-sm truncate text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </span>
                </div>
                <ul aria-labelledby="profile-menu-button">
                  {profile_navigation.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        <item.icon className='size-6' />
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                  <hr />
                  <li>
                    <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                      <ArrowLeftStartOnRectangleIcon className='size-6' />
                      <span>Sign Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          :
          <div id="signup-signin" className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Link className="sm:m-2 text-green-600 hover:text-green-800 dark:text-green-400" href={"/auth/signup"}>
              Sign Up
            </Link>
            <span className="text-gray-600">|</span>
            <Link className="sm:m-2 text-blue-600 hover:text-blue-800 dark:text-blue-400" href={"/auth/signin"}>
              Sign In
            </Link>
          </div>
        }

        {/* Hamburger */}
        <button id="hamburger-button" type="button"
          className="inline-flex items-end p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          data-collapse-toggle="menu-navigation"
          aria-controls="menu-navigation" aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            // "X" icon (Close button)
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon (Open button)
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
