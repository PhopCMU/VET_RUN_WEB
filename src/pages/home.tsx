import { motion } from "framer-motion";
import { images } from "../constant";
import { useTranslation } from "react-i18next";
import { useI18nReady } from "../i18n";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useOpenProject } from "../contexts/OpenProjectContext";
import { FunctionGetSponsorAll } from "../routers/GetRouter";
import { useEffect, useRef, useState } from "react";
import type { Sponsor } from "../types/OpenProject";
import { apiUrl } from "../configs/conf";
import packageJson from "../../package.json";

export default function Home() {
  const router = useNavigate();
  const { t } = useTranslation();
  const isI18nReady = useI18nReady();
  const contactMethods = t("home.contactMethods", { returnObjects: true });

  const { openProject, isLoadings } = useOpenProject();

  console.log("openProject", openProject);

  // ตรวจสอบว่าเป็น array และมีข้อมูล
  const isArrayOfStrings = (arr: any): arr is string[] => {
    return Array.isArray(arr) && arr.every((item) => typeof item === "string");
  };

  const [sponsors, setSponsors] = useState<Sponsor[] | undefined>();
  const hasSponsor = useRef(false);

  const fetchSponsors = async () => {
    const response: any = await FunctionGetSponsorAll();
    if (response.success) {
      setSponsors(response.data);
    }
  };

  useEffect(() => {
    if (!hasSponsor.current) {
      fetchSponsors();
      hasSponsor.current = true;
    }
  }, []);

  if (isLoadings) {
    <Loading />;
  }

  if (!isI18nReady) {
    <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f1e9] to-[#f0e0d1]">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Gradient Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#a66941]/20 to-[#d79b65]/10"></div>

        {/* Animated Background Elements - Reduced motion for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
            className="absolute top-10 left-10 w-32 h-32 md:top-20 md:left-20 md:w-40 md:h-40 rounded-full bg-[#a66941]/10 blur-lg md:blur-xl"
          ></motion.div>
          <motion.div
            animate={{ x: [0, -8, 0], y: [0, -6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
              delay: 2,
              repeatType: "reverse",
            }}
            className="absolute bottom-10 right-10 w-40 h-40 md:bottom-20 md:right-20 md:w-60 md:h-60 rounded-full bg-[#d79b65]/10 blur-lg md:blur-xl"
          ></motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center w-full px-4 max-w-4xl"
        >
          {/* Logo with Responsive Floating Animation */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              },
              rotate: { duration: 0.8 },
            }}
            className="mx-auto mb-6 md:mb-8"
          >
            <img
              src={images.logovetrun}
              alt="VET CMU RUN 2025 Logo"
              className="mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-52 md:w-52 lg:h-60 lg:w-60 drop-shadow-lg rounded-full border-4 border-white/20 hover:border-white/40"
            />
          </motion.div>

          {/* Title Section */}
          <div className="mb-6 md:mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#a66941] mb-3 md:mb-4"
            >
              <span className="material-symbols-outlined align-middle mr-2 text-4xl sm:text-5xl md:text-6xl">
                directions_run
              </span>
              {t("home.title")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center"
            >
              <span className="material-symbols-outlined text-[#6d452a] mr-2 text-lg sm:text-xl">
                calendar_today
              </span>
              <p className="text-sm sm:text-base text-[#6d452a] font-medium">
                {t("home.subtitle")}
              </p>
            </motion.div>
          </div>

          {/* Action Buttons - Stacked on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col  justify-center gap-3 sm:gap-4 w-full max-w-7xl mx-auto"
          >
            <motion.button
              onClick={() =>
                openProject.status === true
                  ? router("/page/registration?id=register")
                  : ""
              }
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px -5px rgba(166, 105, 65, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 text-base sm:text-lg md:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-md  w-full ${
                openProject.status === true
                  ? "bg-gradient-to-r from-[#a66941] to-[#d79b65] hover:from-[#b5764a] hover:to-[#e0a56e] text-white"
                  : "bg-gray-400 text-white opacity-70 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                how_to_reg
              </span>
              {openProject.status === true
                ? t("home.register")
                : t("home.close_register")}
            </motion.button>

            <motion.button
              onClick={() => router("/list/participants?id=participant")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px -5px rgba(166, 105, 65, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#d79b65] to-[#a66941] hover:from-[#e0a56e] hover:to-[#b5764a] text-white text-base sm:text-lg md:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-md hover:shadow-lg  w-full"
            >
              <span className="material-symbols-outlined text-xl">search</span>
              {t("home.checkstatus")}
            </motion.button>

            <motion.button
              onClick={() =>
                openProject.status === true ? router("/sale/shirt?id=sale") : ""
              }
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px -5px rgba(166, 105, 65, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 text-base sm:text-lg md:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-md  w-full ${
                openProject.status === true
                  ? "bg-gradient-to-r from-[#a66941] to-[#d79b65] hover:from-[#b5764a] hover:to-[#e0a56e] text-white"
                  : "bg-gray-400 text-white opacity-70 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                point_of_sale
              </span>

              {openProject.status === true
                ? t("home.sale_shirt")
                : t("home.close_sale_shirt")}
            </motion.button>

            <motion.button
              onClick={() => router("/sale/shirt/tracking?id=tracking")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px -5px rgba(166, 105, 65, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#d79b65] to-[#a66941] hover:from-[#e0a56e] hover:to-[#b5764a] text-white text-base sm:text-lg md:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-md hover:shadow-lg  w-full"
            >
              <span className="material-symbols-outlined text-xl">search</span>
              {t("home.trackeing")}
            </motion.button>
          </motion.div>

          {/* Announcement */}
          {!openProject.status && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 sm:mt-10 md:mt-12"
            >
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#a66941] mb-3 sm:mb-4 flex items-center justify-center gap-1 sm:gap-2">
                  <span className="material-symbols-outlined text-[#d79b65] text-xl sm:text-2xl">
                    diamond
                  </span>
                  {t("home.announcement")}
                  <span className="material-symbols-outlined text-[#d79b65] text-xl sm:text-2xl">
                    diamond
                  </span>
                </h2>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator - Smaller on mobile */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#a66941]/70 hover:text-[#a66941] cursor-pointer">
            expand_more
          </span>
        </motion.div>
      </section>

      {/* Sponsors Section */}
      {sponsors !== undefined && sponsors.length > 0 && (
        <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Section Header */}
            <div className="text-center mb-10 md:mb-12">
              <motion.h2
                whileInView={{ scale: [0.95, 1.03, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-[#a66941] mb-3"
              >
                <span className="material-symbols-outlined text-[#d79b65] mr-2">
                  groups
                </span>
                {t("home.sponsors")}
              </motion.h2>
            </div>

            {/* Sponsors Grid */}
            <div className="space-y-10 md:space-y-12">
              {/* Diamond Sponsors */}
              {sponsors.filter((s) => s.type === "Diamond").length > 0 && (
                <div className="space-y-4 block md:flex justify-start space-x-5">
                  <motion.h3
                    whileInView={{ x: [-20, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl font-semibold text-[#a66941] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[#d79b65]">
                      diamond
                    </span>
                    Diamond
                  </motion.h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {sponsors
                      .filter((s) => s.type === "Diamond")
                      .map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white p-3 md:p-4 rounded-xl shadow-md hover:shadow-lg border border-white/20 "
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className="w-full h-auto max-h-24 md:max-h-32 object-contain mx-auto"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Platinum Sponsors */}
              {sponsors.filter((s) => s.type === "Platinum").length > 0 && (
                <div className="space-y-4 block md:flex justify-start space-x-5">
                  <motion.h3
                    whileInView={{ x: [20, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl font-semibold text-[#a66941] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[#d79b65]">
                      workspace_premium
                    </span>
                    Platinum
                  </motion.h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                    {sponsors
                      .filter((s) => s.type === "Platinum")
                      .map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md border border-white/20 "
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className="w-full h-auto max-h-20 md:max-h-28 object-contain mx-auto"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Titanium Sponsors */}
              {sponsors.filter((s) => s.type === "Titanium").length > 0 && (
                <div className="space-y-4 block md:flex justify-start space-x-5">
                  <motion.h3
                    whileInView={{ x: [20, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl font-semibold text-[#a66941] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[#d79b65]">
                      workspace_premium
                    </span>
                    Titanium
                  </motion.h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                    {sponsors
                      .filter((s) => s.type === "Titanium")
                      .map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md border border-white/20 transition-all"
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className="w-full h-auto max-h-20 md:max-h-28 object-contain mx-auto"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Gold Sponsors */}
              {sponsors.filter((s) => s.type === "Gold").length > 0 && (
                <div className="space-y-4 block md:flex justify-start space-x-5">
                  <motion.h3
                    whileInView={{ x: [-20, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl font-semibold text-[#a66941] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[#d79b65]">
                      military_tech
                    </span>
                    Gold
                  </motion.h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                    {sponsors
                      .filter((s) => s.type === "Gold")
                      .map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md border border-white/20 "
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className="w-full h-auto max-h-16 md:max-h-20 object-contain mx-auto"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Silver Sponsors */}
              {sponsors.filter((s) => s.type === "Silver").length > 0 && (
                <div className="space-y-4 block md:flex justify-start space-x-5">
                  <motion.h3
                    whileInView={{ x: [20, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl font-semibold text-[#a66941] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[#d79b65]">
                      star
                    </span>
                    Silver
                  </motion.h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
                    {sponsors
                      .filter((s) => s.type === "Silver")
                      .map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white p-2 rounded-md shadow-xs hover:shadow-sm border border-white/20 "
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className="w-full h-auto max-h-12 md:max-h-16 object-contain mx-auto"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* Map */}

      <section className="py-12 md:py-16 bg-[#f0e0d1]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2
              whileInView={{ scale: [0.95, 1.03, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-[#a66941] mb-3"
            >
              <span className="material-symbols-outlined text-[#d79b65] mr-2">
                map
              </span>
              {t("home.maps")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={images.map4km}
                alt="Map"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <img
                src={images.map11km}
                alt="Map"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-[#a66941] to-[#c6895a] py-12 md:py-16 px-4 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2
              whileInView={{
                scale: [0.95, 1.03, 1],
                y: [-10, 0],
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center"
            >
              <span className="material-symbols-outlined mr-2 text-[#f0e0d1]">
                contact_support
              </span>
              {t("home.contactTitle")}
            </motion.h2>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
            {isArrayOfStrings(contactMethods) ? (
              contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                  className="bg-white/10 p-4 md:p-5 rounded-lg md:rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 "
                >
                  <div className="flex items-center gap-3 ">
                    <span
                      className={`material-symbols-outlined p-2 rounded-full flex-shrink-0 ${
                        index === 0
                          ? "bg-[#f0e0d1]/20 text-[#f0e0d1]"
                          : index === 1
                            ? "bg-[#d79b65]/20 text-[#d79b65]"
                            : "bg-[#a66941]/20 text-[#a66941]"
                      }`}
                    >
                      {index === 0
                        ? "mail"
                        : index === 1
                          ? "call"
                          : "location_on"}
                    </span>
                    <p className="text-base md:text-lg font-medium break-words">
                      {method}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <span className="material-symbols-outlined text-4xl text-white/50 mb-2">
                  error
                </span>
                <p className="text-white/70">
                  Contact methods are not available
                </p>
              </div>
            )}
          </div>

          {/* Contact Button */}
          <div className="text-center">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#fff",
                color: "#a66941",
                boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
              }}
              onClick={() =>
                window.open(
                  "https://www.facebook.com/VetCMURun.VMCMU/",
                  "_blank",
                )
              }
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 text-[#a66941] font-bold py-2 md:py-3 px-6 md:px-8 rounded-full hover:bg-white  flex items-center gap-2 mx-auto shadow-md hover:shadow-lg text-sm md:text-base"
            >
              <span className="material-symbols-outlined text-lg">
                ads_click
              </span>
              {t("home.contactButton")}
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#f0e0d1]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#d79b65]/10 rounded-full blur-xl"></div>
        </div>
      </section>
      <div className="text-sm text-gray-500 text-center py-5">
        Version: {packageJson.version}
      </div>
    </div>
  );
}
