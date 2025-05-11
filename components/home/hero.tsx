"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // Ensure you import motion

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="md:mt-20 p-4 lg:grid lg:grid-cols-2 flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex gap-3 flex-col items-center justify-center lg:items-start p-4">
        <h1 className="md:text-6xl text-2xl font-bold tracking-tight text-center lg:text-start bg-gradient-to-r from-[#9945FF]  to-[#14F195] bg-clip-text text-transparent">
          Monetize Your Time, Connect with Your Audience
        </h1>
        <p className="text-2xl text-white/65 md:text-base text-muted-foreground text-center lg:text-start">
          Create Solana-powered Blinks to sell your time,
          <br /> engage directly with your fans, and grow your community
          effortlessly.
        </p>
        <div className="flex items-center gap-5 mt-8">
          <Link href="/auth/signin">
            <Button className="rounded-full px-10 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-transform transform hover:scale-105 shadow-lg">
              Get started now
            </Button>
          </Link>

          <Button
            className="rounded-full px-10 py-4 text-xl border border-white bg-transparent text-white transition-transform transform hover:scale-105 shadow-lg"
            variant="outline"
          >
            Learn more
          </Button>
        </div>
      </div>
      <motion.div
        className="relative h-[400px] md:min-h-[600px] mt-5 md:mt-10 lg:mt-0 bg-black/65 rounded-2xl flex items-center justify-center w-[360px] md:w-[850px]"
        animate={{ y: [0, -10, 0] }} // Float effect
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }} // Smooth transition
      >
        {/* First image */}
        <Image
          src="/kash(1).png"
          alt="kash"
          width={270}
          height={200}
          className="absolute object-contain z-20 left-0 transform drop-shadow-md translate-x-[1rem] md:translate-x-[3rem] top-1/2 -translate-y-1/2  w-[160px] md:w-[270px] "
        />
        {/* Second image */}
        <Image
          src="/shek.png"
          alt="shek"
          width={300}
          height={300}
          className="absolute drop-shadow-lg object-contain z-30 w-[180px] md:w-[300px] top-1/2 -translate-y-1/2 "
        />
        {/* Third image */}
        <Image
          src="/irfan.png"
          alt="irfan"
          width={270}
          height={200}
          className="absolute object-contain z-10 right-0 transform drop-shadow-md -translate-x-[1rem] md:-translate-x-[3rem] top-1/2 -translate-y-1/2  w-[160px] md:w-[270px] "
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
