"use client";

import { actionItems } from "@/data/item";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
const Completionist = () => (
  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center space-x-1 rounded-full bg-white py-2.5 px-6 text-2xs font-medium">
    {" "}
    <span>This auction has ended</span>
  </div>
);

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <>
        {window !== undefined && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center space-x-1 rounded-full bg-white py-2.5 px-6 text-2xs font-medium">
            <span
              className="h-3.5 w-3.5 shrink-0 bg-contain bg-center"
              style={{
                backgroundImage:
                  "url(https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/23f3.png)",
              }}
            ></span>
            <span className="js-countdown-timer shrink-0 whitespace-nowrap text-jacarta-700"></span>
            <span className="js-countdown-left">
              {hours}:{minutes}:{seconds}
            </span>
          </div>
        )}
      </>
    );
  }
};

export default function Auction() {
  const [showTimer, setShowTimer] = useState(false);
  const [allItems, setAllItems] = useState(actionItems);
  const addLike = (id) => {
    const items = [...allItems];
    const item = items.filter((elm) => elm.id == id)[0];
    const indexToReplace = items.findIndex((item) => item.id === id);
    if (!item.liked) {
      item.liked = true;
      item.likesCount += 1;
      items[indexToReplace] = item;
      setAllItems(items);
    } else {
      item.liked = false;
      item.likesCount -= 1;
      items[indexToReplace] = item;
      setAllItems(items);
    }
  };
  useEffect(() => {
    setShowTimer(true);
  }, []);

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl text-jacarta-700 dark:text-white">
          <span
            className="mr-1 inline-block h-6 w-6 animate-heartBeat bg-contain bg-center text-xl"
            style={{
              backgroundImage:
                "url(https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/2764-fe0f.png)",
            }}
          ></span>
          Live Auctions
        </h2>{" "}
        <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
          {allItems.map((elm, i) => (
            <article key={i}>
              <div className="block rounded-2.5xl border border-jacarta-100 bg-white p-[1.1875rem] transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <a href="#">
                      <Image
                        width={20}
                        height={20}
                        src={elm.creatorAvatar}
                        alt="creator"
                        className="h-6 w-6 rounded-full"
                        data-tippy-content={`Creator: ${elm.cerator}`}
                      />
                    </a>
                    <a href="#">
                      <Image
                        width={20}
                        height={20}
                        src={elm.ownerAvatar}
                        alt="owner"
                        className="h-6 w-6 rounded-full"
                        data-tippy-content={`Owner: ${elm.owner}`}
                      />
                    </a>
                  </div>

                  <div className="dropdown rounded-full hover:bg-jacarta-100 dark:hover:bg-jacarta-600">
                    <a
                      href="#"
                      className="dropdown-toggle inline-flex h-8 w-8 items-center justify-center text-sm"
                      role="button"
                      id="itemActions1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        width="16"
                        height="4"
                        viewBox="0 0 16 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-jacarta-500 dark:fill-jacarta-200"
                      >
                        <circle cx="2" cy="2" r="2" />
                        <circle cx="8" cy="2" r="2" />
                        <circle cx="14" cy="2" r="2" />
                      </svg>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-end z-10 hidden min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
                      aria-labelledby="itemActions1"
                    >
                      <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                        New bid
                      </button>
                      <hr className="my-2 mx-4 h-px border-0 bg-jacarta-100 dark:bg-jacarta-600" />
                      <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                        Refresh Metadata
                      </button>
                      <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                        Share
                      </button>
                      <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
                <figure className="relative">
                  <Link href={`/item/${elm.id}`}>
                    <Image
                      width={230}
                      height={230}
                      src={elm.imageSrc}
                      alt="item 8"
                      className="w-full rounded-[0.625rem]"
                      loading="lazy"
                    />
                  </Link>
                  {showTimer && (
                    <Countdown date={elm.remainingTime} renderer={renderer} />
                  )}
                </figure>
                <div className="mt-7 flex items-center justify-between">
                  <Link href={`/item/${elm.id}`}>
                    <span className="font-display text-base text-jacarta-700 hover:text-accent dark:text-white">
                      {elm.title}
                    </span>
                  </Link>
                  <span className="flex items-center whitespace-nowrap rounded-md border border-jacarta-100 py-1 px-2 dark:border-jacarta-600">
                    <span data-tippy-content="ETH">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        viewBox="0 0 1920 1920"
                        // xml:space="preserve"
                        className="h-4 w-4"
                      >
                        <path
                          fill="#8A92B2"
                          d="M959.8 80.7L420.1 976.3 959.8 731z"
                        />
                        <path
                          fill="#62688F"
                          d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
                        />
                        <path
                          fill="#454A75"
                          d="M959.8 1295.4l539.8-319.1L959.8 731z"
                        />
                        <path
                          fill="#8A92B2"
                          d="M420.1 1078.7l539.7 760.6v-441.7z"
                        />
                        <path
                          fill="#62688F"
                          d="M959.8 1397.6v441.7l540.1-760.6z"
                        />
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="dark:text-jacarta-300">Highest Bid</span>
                  <span className="text-jacarta-700 dark:text-jacarta-100">
                    {elm.highestBid}
                  </span>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="font-display text-sm font-semibold text-accent"
                    data-bs-toggle="modal"
                    data-bs-target="#placeBidModal"
                  >
                    Place bid
                  </button>
                  <div className="flex items-center space-x-1">
                    <span
                      onClick={() => addLike(elm.id)}
                      className={`js-likes relative cursor-pointer before:absolute before:h-4 before:w-4 before:bg-[url('../img/heart-fill.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0  ${
                        elm.liked ? "js-likes--active" : ""
                      }`}
                      data-tippy-content="Favorite"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-4 w-4 fill-jacarta-500 hover:fill-red dark:fill-jacarta-200 dark:hover:fill-red"
                      >
                        <path fill="none" d="M0 0H24V24H0z" />
                        <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" />
                      </svg>
                    </span>
                    <span className="text-sm dark:text-jacarta-200">
                      {elm.likesCount}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/collections"
            className="inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
          >
            Load More
          </Link>
        </div>
      </div>
    </section>
  );
}
