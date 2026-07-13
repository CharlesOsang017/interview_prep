import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { APP_FEATURES } from "../utils/data";
import HERO_IMG from "../assets/hero_image.jpg";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal";
import Register from "./Auth/Register";
import Login from "./Auth/Login";

const LandingPage = () => {
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {

  }

  return (
    <>
      <div className="w-full min-h-full bg-[#FFFCEF] overflow-x-hidden">
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0 pointer-events-none" />

        <div className="container mx-auto px-4 pt-6 relative z-10 pb-[200px]">
          {/* Header */}
          <header className="flex justify-between items-center -mb-40">
            <div className="text-xl font-bold text-black">
              Interview Prep
            </div>
            <button
              className="bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
              onClick={() => {
                setOpenAuthModal(true);
              }}
            >
              Login / Register
            </button>
          </header>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col px-4 md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <div className="flex items-center justify-left mb-2">
              <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                <LuSparkles /> AI Powered
              </div>
            </div>
            <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
              Ace Interview with <br />
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                AI-Powered
              </span>{" "}
              Learning
            </h1>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-[17px] text-gray-900 mr-0 md:mr-10 mb-6">
              Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparations to mastery - your ultimate interview toolkit is here.
            </p>
            <button
              className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
        </div>


        {/* Features Section */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APP_FEATURES.slice(0, 6).map((feature) => (
              <div
                key={feature.id}
                className="bg-white/60 border border-amber-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-bold text-amber-500 mb-2">#{feature.id}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full min-h-full relative z-10 mb-56">
        <img src={HERO_IMG} className="w-[88vw] rounded-lg" alt="hero image" />
      </div>

      <div className="w-full min-h-full bg-[#FFFCEF] mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20">
          <section className="mt-5">
            <h2 className="text-2xl font-medium text-center mb-12">
              Features That Make You Shine
            </h2>
            <div className="flex flex-col items-center gap-8">
              {/* First 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >

                    <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Remaining 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {APP_FEATURES.slice(3, 5).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >

                    <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
        Made with ❤️ by Charles
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false)
          setCurrentPage("login")
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login setCurrentPage={setCurrentPage} />
          )}

          {currentPage === "register" && (
            <Register setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  )
}

export default LandingPage