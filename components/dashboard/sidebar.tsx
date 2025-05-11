/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Logo from "../logo/Logo";
import { Button } from "../ui/button";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { Session, useSidebarStore } from "@/store/store";

const Sidebar = () => {
  const {
    isOpen,
    isLargeScreen,
    setIsOpen,
    setIsLargeScreen,
    setSelectedSession,
    setSessions,
    sessions,
    selectedSession,
  } = useSidebarStore();
  const [isUpcoming, setIsUpcoming] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      setIsOpen(largeScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const formData = await response.json();
        setSessions(formData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [setSessions]);

  const handleToggleSidebar = () => {
    if (!isLargeScreen) {
      setIsOpen(!isOpen);
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsOpen(!isOpen);
  };

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    sessionDate.setHours(0, 0, 0, 0);

    return isUpcoming ? sessionDate >= today : sessionDate < today;
  });

  return (
    <motion.div
      className={`fixed lg:static top-0 left-0 h-full bg-slate-950 text-white overflow-y-auto h-screen`}
      initial={{ width: 0, filter: "blur(10px)" }}
      animate={{
        width: isLargeScreen ? "500px" : isOpen ? "100%" : "0",
        filter: "blur(0px)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="p-8 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="mb-10 flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <X
            className="text-white cursor-pointer lg:hidden"
            onClick={handleToggleSidebar}
          />
        </div>

        <div className="flex mb-5 items-center justify-between">
          <h3 className="text-xl font-medium">My Sessions</h3>
          <Link href="/create">
            <Button className="rounded-full flex gap-1 items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:bg-gradient-to-l transition-all duration-300">
              <Plus className="w-4 h-4" /> Create
            </Button>
          </Link>
        </div>

        <div className="mb-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full p-2 pl-10 border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <Search className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-between mb-5 text-sm">
          <button
            className={`flex-1 rounded-full py-3 ${
              isUpcoming ? "bg-white/75 text-black" : ""
            }`}
            onClick={() => setIsUpcoming(true)}
          >
            Upcoming
            <span className="ml-2 rounded-full border px-2 py-1 bg-yellow-200 shadow-inner">
              {
                sessions.filter((session) => {
                  const sessionDate = new Date(session.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Ignore the time part
                  sessionDate.setHours(0, 0, 0, 0); // Ignore the time part
                  return sessionDate >= today; // Upcoming sessions are today or in the future
                }).length
              }
            </span>
          </button>
          <button
            className={`flex-1 rounded-full py-3 ${
              !isUpcoming ? "bg-white/75 text-black" : ""
            }`}
            onClick={() => setIsUpcoming(false)}
          >
            Past
            <span className="ml-2 rounded-full border px-2 py-1 bg-green-200 shadow-inner">
              {
                sessions.filter((session) => {
                  const sessionDate = new Date(session.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Ignore the time part
                  sessionDate.setHours(0, 0, 0, 0); // Ignore the time part
                  return sessionDate < today; // Past sessions are before today
                }).length
              }
            </span>
          </button>
        </div>

        <div className="mt-5">
          <div className="text-sm text-gray-500 mb-2">Select a session</div>
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center p-2 rounded-full mb-2 cursor-pointer ${
                selectedSession && selectedSession.id === session.id
                  ? "bg-white/20 "
                  : "hover:bg-white/10 "
              } transition-all`}
              onClick={() => handleSessionClick(session)}
            >
              <div className="text-lg   bg-gradient-to-r from-cyan-400 to-purple-600 font-medium mr-3 rounded-full border px-3 py-2">
                {String(new Date(session.date).getDate()).padStart(2, "0")}
              </div>
              <div>
                <div className="font-medium text-gray-200">
                  {session.organizationName}
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {session.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
