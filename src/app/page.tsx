"use client";
import { karma, kavoon, lato } from "@/lib/fonts";
import Link from "next/link";
import Image from "next/image";
import { Accordion } from "@mantine/core";
import { Footer } from "@/components/Footer/Footer";
import { BsArrowRightCircleFill } from "react-icons/bs";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

const faq = [
  {
    value: "Is WBook free to use?",
    description:
      "Yes! ReadShelf offers a free plan with basic features like progress tracking and quote saving. For advanced features (unlimited flashcards, detailed analytics), you can upgrade to our Premium plan.",
  },
  {
    value: "How do flashcards help with reading?",
    description:
      "Our flashcard system lets you turn key ideas, terms, or quotes into study cards. Great for students, book clubs, or anyone who wants to retain more from their reads.",
  },
  {
    value: "What if I switch phones? Will my data be lost?",
    description:
      "No worries! Your entire library and notes are stored securely in the cloud. Just install ReadShelf on your new device and sign in.",
  },
];

export default function Home() {
   const { data: session, status } = useSession();

  const items = faq.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control
        className={karma.className}
        classNames={{
          label: "text-4xl font-semibold",
        }}
      >
        {item.value}
      </Accordion.Control>
      <Accordion.Panel
        className={karma.className}
        classNames={{
          panel: "text-xl text-start", 
        }}
      >
        {item.description}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="grid items-center justify-items-center min-h-screen gap-8 sm:gap-12 lg:gap-16">
      {/* Navigation */}
      {session && status === "authenticated" ? (
        <Navbar cta={{ label: "Collection", href: "/collection" } } />
      ) : (
        <Navbar cta={{ label: "Sign In", href: "/signin" } } />
      )}
      

      {/* Hero Section */}
      <section about="Hero">
        <div className="flex flex-col items-center justify-center max-w-7xl mt-8 sm:mt-16 lg:mt-28 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-7 text-center relative">
          <h1
            className={`${kavoon.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-center text-stroke text-stroke-1-gray text-stroke-gray leading-tight text-shadow-md md:text-shadow-lg text-shadow-white`}
          >
            Transform Your Reading Journey with WBook
          </h1>
          <p className={`${karma.className} text-xs sm:text-lg md:text-xl lg:text-2xl pb-2 sm:pb-12 lg:pb-14 px-4`}>
            Track progress, capture insights, and build your personal literary legacy - all in one place
          </p>
          <Link
            href={"/signup"}
            className="group inline-flex items-center justify-center gap-x-2 sm:gap-x-3 p-1.5 sm:p-2 text-sm sm:text-md font-light text-white bg-[#212121] rounded-full focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between gap-1 sm:gap-2">
                <span className="px-3 sm:px-4 translate-x-1 sm:translate-x-2 font-medium text-sm sm:text-base">Sign Up Now</span>
                  <BsArrowRightCircleFill className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
          </Link>

          {/* Background Image */}
          <div className="absolute -z-10 -translate-y-1/6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-4xl">
            <Image
              width={1015}
              height={1015}
              src="/book.png"
              alt="Books"
              className="w-full h-full object-contain opacity-90"
              priority
            />
          </div>
        </div>
      </div>
      </section>
      

      {/* Stats Section */}
         <div className="flex flex-col w-full bg-[#1C1C1C] items-center justify-center text-white mt-8 sm:mt-16 lg:mt-24 text-center py-12 sm:py-16 lg:py-20">
        <p className={`${karma.className} text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 sm:px-6 leading-relaxed`}>
          Join 10,000+ avid readers who have organized over 250,000 books with
          WBook
        </p>
      </div>     
          
      {/* Features Section */}
      <section about="Features">
            <div className="flex flex-col items-center justify-center w-full text-black text-center px-4 sm:px-6">
        <div className="py-8 sm:py-12">
          <h1 className={`${karma.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-5xl mx-auto`}>
            Tired of Forgetting What You Read? <br className="hidden sm:block" /> We&apos;ve Got You Covered
          </h1>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8 sm:py-12">
          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-stretch max-w-screen-2xl">
            {/* Big Left Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#FFA1A1] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_#1C1C1C] sm:shadow-[12px_12px_0_#1C1C1C] h-full flex flex-col justify-between text-center">
                <div className="w-full max-w-sm mx-auto">
                  <Image
                    src="/rocket-book.png"
                    alt="Progress Reading"
                    width={650}
                    height={650}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6">
                  <h4 className={`${kavoon.className} text-2xl sm:text-3xl lg:text-4xl`}>
                    Progress Reading
                  </h4>
                  <p className={`${karma.className} text-sm sm:text-base lg:text-lg xl:text-xl text-black leading-relaxed`}>
                    Visualize your reading journey with our progress tracker.
                    Set goals, monitor pages read, and celebrate milestones.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Cards */}
            <div className="lg:col-span-2 grid grid-rows-1 lg:grid-rows-2 gap-6 sm:gap-8">
              {/* Flashcard */}
              <div className="bg-[#E0E09B] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_#1C1C1C] sm:shadow-[12px_12px_0_#1C1C1C] flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-32 sm:w-40 md:w-48 lg:w-52 flex-shrink-0">
                  <Image
                    src="/flashcard.png"
                    alt="Flashcard"
                    width={336}
                    height={336}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left">
                  <h4 className={`${kavoon.className} text-2xl sm:text-3xl lg:text-4xl xl:text-5xl`}>
                    Flashcard
                  </h4>
                  <p className={`${karma.className} text-sm sm:text-base lg:text-lg xl:text-xl text-black leading-relaxed`}>
                    Capture and organize key concepts with our built-in
                    flashcard system. Perfect for students and lifelong
                    learners.
                  </p>
                </div>
              </div>

              {/* Quotes */}
              <div className="bg-[#9BE0B6] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_#1C1C1C] sm:shadow-[12px_12px_0_#1C1C1C] flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-32 sm:w-40 md:w-48 lg:w-52 flex-shrink-0">
                  <Image
                    src="/quotes.png"
                    alt="Quotes"
                    width={336}
                    height={336}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left">
                  <h4 className={`${kavoon.className} text-2xl sm:text-3xl lg:text-4xl xl:text-5xl`}>
                    Quotes
                  </h4>
                  <p className={`${karma.className} text-sm sm:text-base lg:text-lg xl:text-xl text-black leading-relaxed`}>
                    Never lose an inspiring passage again. Save, categorize, and
                    share your favorite quotes with ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      

      {/* Testimonials */}
      <section about="Testimonials" className="w-full">
        <div className="flex flex-col w-full bg-[#45474B] items-center justify-center text-white mt-16 sm:mt-24 lg:mt-36 text-center py-16 sm:py-20 lg:py-32">
          <div className="px-4 sm:px-6 max-w-6xl mx-auto">
            <h1 className={`${karma.className} text-6xl sm:text-8xl md:text-9xl lg:text-[150px] xl:text-[200px] font-bold text-[#9BE0B6] leading-none`}>
              &ldquo;
            </h1>
            <div className="-mt-4 sm:-mt-6 lg:-mt-24 flex flex-col items-center gap-6 sm:gap-8">
              <h1 className={`${karma.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight`}>
                &ldquo;WBook helped me finally organize my reading life. I&apos;ve doubled my reading retention!&ldquo;
              </h1>
              <p className={`${lato.className} font-light text-lg sm:text-xl lg:text-2xl`}>
                - Sarah, Book Blogger
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section about="FAQ" className="w-full">
        <div className="flex flex-col items-center justify-center w-full text-black text-center mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6">
          <h1 className={`${karma.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 lg:mb-16`}>
            Frequently Ask Questions
          </h1>
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-24">
            <Accordion
              radius="md"
              disableChevronRotation
              defaultValue="Is WBook free to use?"
            >
              {items}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section about="CTA" className="w-full px-4 sm:px-6">
        <div className="flex flex-col w-full items-center justify-center text-white text-center">
          <div className="bg-[#1C1C1C] w-full max-w-7xl min-h-[300px] sm:min-h-[400px] lg:min-h-[484px] flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-12 my-12 sm:my-16 lg:my-24 rounded-2xl sm:rounded-3xl lg:rounded-4xl p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 max-w-4xl">
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <h1 className={`${karma.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-center`}>
                  Start Building Your Smarter <br/> Bookshelf Today
                </h1>
                <p className={`${karma.className} text-lg sm:text-xl lg:text-2xl font-light`}>
                  Try WBook Free for 30 Days
                </p>
              </div>
              <Link
                href={"/signup"}
                className="group inline-flex items-center border-2 justify-center gap-x-2 sm:gap-x-3 p-1 sm:p-1.5 text-sm sm:text-md font-light text-white bg-[#45474B] rounded-full focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                <span className="px-3 sm:px-4 translate-x-1 sm:translate-x-2 text-sm sm:text-base ">Try It Free Today</span>
                  <BsArrowRightCircleFill className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
