"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Session, useSidebarStore } from "@/store/store";
import { ArrowUpRight, CheckCircle, ChevronsRight, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";

interface Buyer {
  _id: string;
  timeslot: string;
  name: string;
  email: string;
  publicKey: string;
  buyername: string;
}

const Containers = () => {
  const { isOpen, isLargeScreen, setIsOpen, selectedSession, sessions } =
    useSidebarStore();
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [buyer, setBuyer] = useState<Buyer[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/buyer");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        setBuyer([]);
        const formData = await response.json();

        const completeBuyers: Buyer[] = formData
          .filter(
            (data: { creatorId: string; id: string }) =>
              data.creatorId === selectedSession?.id
          )
          .map((data: { creatorId: string; _id: string }) => ({
            _id: data._id,
            timeslot: (data as any).timeslot || "Unknown timeslot",
            name: (data as any).name || "Unknown name",
            email: (data as any).email || "Unknown email",
            publicKey: (data as any).publicKey || "Unknown key",
            buyername: (data as any).buyername || "Unknown buyer",
          }));

        setBuyer((prev) => [...prev, ...completeBuyers]);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    if (selectedSession) {
      fetchSessions();
    }
  }, [selectedSession]);

  const handleToggleSidebar = () => {
    if (!isLargeScreen) {
      setIsOpen(!isOpen);
    }
    controls.start({ x: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    controls.start({ x: 5 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start({ x: 0 });
  };

  useEffect(() => {
    let bookedCount = 0;

    if (selectedSession?.time1 === "booked") bookedCount++;
    if (selectedSession?.time2 === "booked") bookedCount++;
    if (selectedSession?.time3 === "booked") bookedCount++;

    setTime(bookedCount);
  }, [selectedSession]);

  return (
    <div className="p-8 h-screen md:w-full bg-gray-900 text-white">
      <nav className="flex gap-10 mb-10 py-2">
        <Link href="#" className="hover:text-blue-400 transition">
          {/* Sessions */}
        </Link>
        <Link href="#" className="hover:text-blue-400 transition">
          {/* Calendar */}
        </Link>
        <Link href="#" className="hover:text-blue-400 transition">
          {/* Clients */}
        </Link>
      </nav>

      {!selectedSession && (
        <h3
          className="text-5xl mb-3 text-gray-300 flex gap-1 items-center cursor-pointer text-center"
          onClick={handleToggleSidebar}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          All Sessions
          {!isOpen && (
            <motion.div animate={controls}>
              <ChevronsRight className="text-gray-500" />
            </motion.div>
          )}
        </h3>
      )}

      {selectedSession ? (
        <div className="xl:flex justify-between">
          <div className="xl:w-[500px] 2xl:w-[900px]">
            <h3
              className="text-lg mb-3 text-gray-300 flex gap-1 items-center cursor-pointer text-center"
              onClick={handleToggleSidebar}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              All Sessions
              {!isOpen && (
                <motion.div animate={controls}>
                  <ChevronsRight className="text-gray-500" />
                </motion.div>
              )}
            </h3>

            <div className="flex flex-col mb-5">
              <h3 className="text-2xl font-medium">
                {selectedSession.organizationName || "Build"}
              </h3>
              <div className="flex items-center gap-1">
                <div className="rounded-full border p-[2px]">
                  <div className="w-[9px] h-[9px] bg-yellow-500 rounded-full" />
                </div>
                <h4 className="text-gray-400">mini sessions</h4>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <h1 className="text-lg md:text-2xl">Earnings</h1>
                <h1 className="text-xl">{selectedSession.earnings} SOL</h1>
              </div>
              <div className="flex flex-col gap-2 bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                <h1 className="text-lg md:text-2xl">Booking</h1>
                <h1 className="text-xl">
                  <span>{time}</span>/3
                </h1>
              </div>
              <div className="flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                <h1 className="text-lg md:text-2xl">Views</h1>
                <h1 className="text-xl">{time}</h1>
              </div>
            </div>

            <div className="mt-10">
              <h1 className="text-xl">
                {new Date(selectedSession.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h1>
              <p className="text-gray-400">30 min @zoom</p>
              <div className="mt-5">
                {buyer.map((b: Buyer) => (
                  <div
                    key={b._id}
                    className="px-2 border-b py-3 hover:bg-gray-800 cursor-pointer rounded-lg flex gap-2 items-center"
                  >
                    <p className="text-lg">{b.timeslot}</p>
                    <div className="px-3 rounded-full shadow-inner bg-gray-700 border">
                      <CheckCircle className="w-3" />
                    </div>
                    <p className="text-gray-400">{b.buyername}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session Details Section */}
          <div className="xl:mt-0 mt-10">
            <h3 className="text-lg mb-3 text-gray-300 flex gap-1 items-center cursor-pointer text-center">
              Session details
            </h3>
            <div className="mt-5">
              <div className="md:w-[400px] h-fit rounded-lg border overflow-hidden">
                <Image
                  src={selectedSession.image || ""}
                  alt={selectedSession.title || "session image"}
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-5 flex flex-col gap-1">
                <h1>
                  {new Date(selectedSession.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h1>
                <h1 className="font-bold">{selectedSession.amount} SOL</h1>
                <h1>{selectedSession.title || "No title"}</h1>
                <p>{selectedSession.description || "No Description"}</p>
                <Link
                  href={selectedSession.meetlink || ""}
                  className="w-fit font-medium underline line-clamp-1 flex items-center text-blue-400 hover:text-blue-600 transition"
                >
                  {selectedSession.meetlink ? "Meet Link" : "No Link Provided"}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Create New Button */}
              <div>
                <Link href="/create">
                  <Button className="mt-2 rounded-full flex gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:bg-gradient-to-l transition-all duration-300">
                    <Plus className="w-5" /> Create new
                  </Button>
                </Link>
              </div>
              {/* Spacer */}
              <div className="h-[20px]" />
            </div>
          </div>
        </div>
      ) : (
        // No Session Selected State
        <>
          {/* Content when no session is selected */}
          {/* ... */}
        </>
      )}
    </div>
  );
};

export default Containers;
