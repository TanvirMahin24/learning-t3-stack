import { type NextPage } from "next";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [input, setInput] = useState({
    title: "",
    website: "",
  });

  const { mutate } = trpc.card.publishCard.useMutation({
    onSuccess(card) {
      router.push(`/c/${card.slug}`);
    },
  });

  const publish = () => {
    mutate(input);
  };

  return (
    <>
      <Head>
        <title>Business Card</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-rose-500 to-purple-600">
        {!sessionData ? (
          <button
            onClick={sessionData ? () => signOut() : () => signIn("google")}
            className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
          >
            {" "}
            Sign in with Google
          </button>
        ) : (
          <>
            <div className="mx-auto max-w-7xl ">
              <h2 className="text mb-6 text-left text-3xl font-semibold text-white">
                {" "}
                Tell us about yourself
              </h2>
              <div className="mb-12 grid grid-cols-2   gap-8">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white"
                  >
                    Title
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      value={input.title}
                      onChange={(e) =>
                        setInput({ ...input, title: e.target.value })
                      }
                      type="text"
                      name="title"
                      id="title"
                      className="block w-full rounded-md border-gray-300 pl-2 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-white"
                  >
                    Website
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      value={input.website}
                      onChange={(e) =>
                        setInput({ ...input, website: e.target.value })
                      }
                      name="website"
                      id="website"
                      className="block w-full rounded-md border-gray-300 pl-2 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Your site url..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <BusinessCard inputs={input} />
            </div>

            <div className="mt-12 flex justify-center ">
              <button
                onClick={publish}
                className="rounded-full bg-black/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-black/20"
              >
                Publish
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
