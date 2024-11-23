// components/Layout.js
import Head from "next/head";
import ThemeToggle from "./ThemeToggle";

const Layout = ({ children, title = "Leonardo Flores" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        {/* Meta tags */}
      </Head>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="flex justify-end items-center p-4">
          <div className="flex space-x-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-grow max-w-4xl mx-auto p-4">{children}</main>
        <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center py-4">
          <p>&copy; {new Date().getFullYear()} Leonardo Flores</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
