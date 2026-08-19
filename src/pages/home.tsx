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

const sponsorTiers = [
  {
    type: "Diamond",
    icon: "diamond",
    accent: "#efc75e",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
    card: "min-h-44 p-6 sm:min-h-52 sm:p-8",
    logo: "max-h-28 sm:max-h-32",
    featured: true,
  },
  {
    type: "Platinum",
    icon: "workspace_premium",
    accent: "#b7a6c1",
    grid: "sm:grid-cols-2 lg:grid-cols-4",
    card: "min-h-36 p-5",
    logo: "max-h-24",
    featured: false,
  },
  {
    type: "Titanium",
    icon: "verified",
    accent: "#73828c",
    grid: "sm:grid-cols-2 lg:grid-cols-4",
    card: "min-h-36 p-5",
    logo: "max-h-24",
    featured: false,
  },
  {
    type: "Gold",
    icon: "military_tech",
    accent: "#c6972f",
    grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    card: "min-h-28 p-4",
    logo: "max-h-16",
    featured: false,
  },
  {
    type: "Silver",
    icon: "stars",
    accent: "#98a0a6",
    grid: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6",
    card: "min-h-24 p-3",
    logo: "max-h-12",
    featured: false,
  },
] as const;

export default function Home() {
  const router = useNavigate();
  const { t } = useTranslation();
  const isI18nReady = useI18nReady();
  const contactMethods = t("home.contactMethods", { returnObjects: true });

  const shirtGallery = [
    {
      image: images.miniMarathonShirt,
      label: "Mini Marathon",
      distance: "9 KM",
      accent: "#",
    },
    {
      image: images.funRunShirt,
      label: "Fun Run",
      distance: "4 KM",
      accent: "#",
    },
    {
      image: images.familyShirtsBlue,
      label: "Commemorative Shirt",
      distance: t("home.ex_shirt.RB"),
      accent: "#",
    },
    {
      image: images.familyShirtsGreen,
      label: "Commemorative Shirt",
      distance: t("home.ex_shirt.PG"),
      accent: "#",
    },
    {
      image: images.familyShirtsAlternate,
      label: "Commemorative Shirt",
      distance: t("home.ex_shirt.CF"),
      accent: "#",
    },
    {
      image: images.finisherShirt,
      label: "2nd VIP Shirt",
      distance: t("home.ex_shirt.VIP"),
      accent: "#",
    },
  ];

  const { openProject, isLoadings } = useOpenProject();

  // ตรวจสอบว่าเป็น array และมีข้อมูล
  const isArrayOfStrings = (arr: any): arr is string[] => {
    return Array.isArray(arr) && arr.every((item) => typeof item === "string");
  };

  const [sponsors, setSponsors] = useState<Sponsor[] | undefined>();
  const [activeShirt, setActiveShirt] = useState(0);
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
    return <Loading />;
  }

  if (!isI18nReady) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100svh-68px)] flex-col justify-center overflow-hidden bg-brand-900 px-4 py-12 text-white sm:px-6 lg:py-16">
        <img
          src={images.miniMarathonShirt}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-20 lg:left-[42%] lg:w-[66%] lg:opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#321247_0%,rgba(50,18,71,0.97)_38%,rgba(50,18,71,0.45)_70%,rgba(50,18,71,0.72)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40"></div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 mx-auto w-full max-w-7xl text-left"
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
            className="mb-7 w-fit"
          >
            <img
              src={images.logovetrun}
              alt="VET CMU RUN 2026 Logo"
              className="h-20 w-20 rounded-full border-2 border-white/50 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:h-24 sm:w-24"
            />
          </motion.div>

          {/* Title Section */}
          <div className="mb-7 max-w-2xl md:mb-9">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-5xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="material-symbols-outlined mr-3 align-middle text-4xl text-[#efc75e] sm:text-5xl md:text-6xl">
                directions_run
              </span>
              {t("home.title")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-start border-l-2 border-[#efc75e] pl-4"
            >
              <span className="material-symbols-outlined mr-2 mt-1 text-lg text-brand-200 sm:text-xl">
                calendar_today
              </span>
              <p className="max-w-xl text-sm font-medium text-white/75 sm:text-base">
                {t("home.subtitle")}
              </p>
            </motion.div>
          </div>

          {/* Action Buttons - Stacked on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
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
              className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-bold shadow-sm transition-colors sm:text-lg ${
                openProject.status === true
                  ? "bg-[#efc75e] text-brand-900 hover:bg-white"
                  : "cursor-not-allowed bg-white/10 text-white/45"
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
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-base font-bold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-900 sm:text-lg"
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
              className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-bold shadow-sm transition-colors sm:text-lg ${
                openProject.status === true
                  ? "bg-[#efc75e] text-brand-900 hover:bg-white"
                  : "cursor-not-allowed bg-white/10 text-white/45"
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
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-base font-bold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-900 sm:text-lg"
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
              className="mt-7 max-w-2xl"
            >
              <div>
                <h2 className="mb-3 flex items-center gap-1 text-xl font-bold text-[#efc75e] sm:mb-4 sm:gap-2 sm:text-2xl md:text-3xl">
                  <span className="material-symbols-outlined text-xl text-[#efc75e] sm:text-2xl">
                    diamond
                  </span>
                  {t("home.announcement")}
                  <span className="material-symbols-outlined text-xl text-[#efc75e] sm:text-2xl">
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
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 sm:bottom-6"
        >
          <span className="material-symbols-outlined cursor-pointer text-3xl text-white/60 hover:text-white sm:text-4xl">
            expand_more
          </span>
        </motion.div>
      </section>

      <section
        id="shirts"
        className="overflow-hidden bg-[#f3f0f5] py-14 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                2026 Collection
              </p>
              <h2 className="text-3xl font-black text-brand-900 sm:text-4xl md:text-5xl">
                VET CMU RUN 2026
              </h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <motion.div
              key={activeShirt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative min-h-[330px] overflow-hidden rounded-md bg-[#242424] sm:min-h-[500px]"
            >
              <img
                src={shirtGallery[activeShirt].image}
                alt={`${shirtGallery[activeShirt].label} ${shirtGallery[activeShirt].distance}`}
                className="absolute inset-0 h-full w-full object-contain object-center"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-20 text-white sm:px-7 sm:pb-7">
                <div>
                  <p className="text-sm font-semibold text-white/70">
                    {shirtGallery[activeShirt].label}
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {shirtGallery[activeShirt].distance}
                  </p>
                </div>
                <span
                  className="h-3 w-16"
                  style={{ backgroundColor: shirtGallery[activeShirt].accent }}
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
              {shirtGallery.map((shirt, index) => (
                <button
                  key={shirt.image}
                  onClick={() => setActiveShirt(index)}
                  aria-label={`ดูแบบเสื้อ ${shirt.label} ${shirt.distance}`}
                  aria-pressed={activeShirt === index}
                  className={`relative min-h-24 overflow-hidden rounded-md border-2 bg-[#242424] transition-all sm:min-h-32 lg:min-h-0 ${
                    activeShirt === index
                      ? "border-brand-600 shadow-[0_8px_24px_rgba(73,24,107,0.18)]"
                      : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                >
                  <img
                    src={shirt.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    {shirt.distance}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {sponsors !== undefined && sponsors.length > 0 && (
        <section className="relative overflow-hidden bg-white py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="mb-10 grid gap-5 border-b border-brand-100 pb-8 md:grid-cols-[1fr_auto] md:items-end md:pb-10">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                  Official Partners · 2026
                </p>
                <h2 className="text-3xl font-black text-brand-900 sm:text-4xl md:text-5xl">
                  {t("home.sponsors")}
                </h2>
              </div>
            </div>

            <div className="space-y-12 md:space-y-16">
              {sponsorTiers.map((tier) => {
                const tierSponsors = sponsors.filter(
                  (sponsor) => sponsor.type === tier.type,
                );

                return tierSponsors.length > 0 ? (
                  <div
                    key={tier.type}
                    className={
                      tier.featured
                        ? "relative overflow-hidden rounded-md bg-brand-900 p-5 sm:p-8"
                        : "border-t border-brand-100 pt-7"
                    }
                  >
                    {tier.featured && (
                      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
                    )}
                    <div className="relative mb-5 flex items-center justify-between gap-4">
                      <h3
                        className={`flex items-center gap-3 text-lg font-black sm:text-xl ${
                          tier.featured ? "text-white" : "text-brand-900"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{ color: tier.accent }}
                        >
                          {tier.icon}
                        </span>
                        {tier.type}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold ${
                            tier.featured ? "text-white/60" : "text-gray-500"
                          }`}
                        >
                          {tierSponsors.length} ราย
                        </span>
                        <span
                          className="h-1 w-10"
                          style={{ backgroundColor: tier.accent }}
                        />
                      </div>
                    </div>

                    <div
                      className={`relative grid gap-3 sm:gap-4 ${tier.grid}`}
                    >
                      {tierSponsors.map((sponsor, index) => (
                        <motion.a
                          key={sponsor.sponsorId}
                          href={sponsor.link || undefined}
                          target={sponsor.link ? "_blank" : undefined}
                          rel={sponsor.link ? "noreferrer" : undefined}
                          aria-label={
                            sponsor.link
                              ? `เยี่ยมชมเว็บไซต์ ${sponsor.name}`
                              : sponsor.name
                          }
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.07 }}
                          whileHover={{ y: -4 }}
                          className={`group flex flex-col items-center justify-center rounded-md border border-brand-100 bg-white text-center shadow-[0_8px_30px_rgba(50,18,71,0.08)] transition-shadow hover:shadow-[0_14px_38px_rgba(50,18,71,0.15)] ${tier.card}`}
                        >
                          <img
                            src={
                              sponsor.image
                                ? `${apiUrl.URL_API}/uploads/dataVetRun/logo_sponsors/${sponsor.image}`
                                : images.logovetrun
                            }
                            alt={sponsor.name}
                            className={`w-full object-contain ${tier.logo}`}
                            loading="lazy"
                          />
                          <span className="mt-3 line-clamp-2 text-xs font-semibold text-gray-500 transition-colors group-hover:text-brand-700">
                            {sponsor.name}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Map */}

      <section className="border-y border-brand-100 bg-brand-50 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4"
        >
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2
              whileInView={{ scale: [0.95, 1.03, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-3 text-3xl font-bold text-brand-900 md:text-4xl"
            >
              <span className="material-symbols-outlined mr-2 text-brand-500">
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
      <section className="relative overflow-hidden bg-brand-900 px-4 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px] opacity-60" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#efc75e]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />
        <span
          aria-hidden
          className="material-symbols-outlined pointer-events-none absolute -right-6 top-6 select-none text-[220px] leading-none text-white/[0.04] sm:text-[280px]"
        >
          forum
        </span>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Single Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-10 shadow-2xl">
            {/* Section Header */}
            <div className="mb-8 flex items-end gap-4 border-b border-white/10 pb-6">
              <span className="text-5xl font-black leading-none text-white/10 sm:text-6xl md:text-7xl">
                03
              </span>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-[#efc75e]">
                  Stay Connected
                </p>
                <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">
                  {t("home.contactTitle")}
                </h2>
              </div>
            </div>

            {/* Contact Methods — inline grid inside card */}
            <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
              {isArrayOfStrings(contactMethods) ? (
                contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative flex flex-col justify-between bg-brand-900/80 p-5 transition-colors hover:bg-white/[0.08] md:p-6"
                  >
                    <span className="material-symbols-outlined absolute right-3 top-3 text-3xl text-white/[0.06] transition-colors group-hover:text-[#efc75e]/20">
                      {index === 0
                        ? "mail"
                        : index === 1
                          ? "call"
                          : "location_on"}
                    </span>
                    <p className="relative mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      {index === 0
                        ? "Email"
                        : index === 1
                          ? "Phone"
                          : "Location"}
                    </p>
                    <p className="relative break-words text-base font-bold text-white md:text-lg">
                      {method}
                    </p>
                    <span className="relative mt-4 block h-[3px] w-8 bg-[#efc75e] transition-all duration-300 group-hover:w-14" />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <span className="material-symbols-outlined mb-2 text-4xl text-white/50">
                    error
                  </span>
                  <p className="text-white/70">
                    Contact methods are not available
                  </p>
                </div>
              )}
            </div>

            {/* Contact CTA — inside card */}
            <div className="flex flex-col items-center justify-between gap-5 rounded-xl bg-[#efc75e] px-5 py-6 text-center sm:flex-row sm:text-left md:px-8 md:py-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-900/60">
                  Follow our page
                </p>
                <p className="mt-1 text-lg font-black text-brand-900 md:text-xl">
                  VET CMU RUN 2026
                </p>
              </div>
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 10px 30px -8px rgba(50,18,71,0.5)",
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/VetCMURun.VMCMU/",
                    "_blank",
                  )
                }
                className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-shadow md:px-7 md:text-base"
              >
                {t("home.contactButton")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
      <div className="text-sm text-gray-500 text-center py-5">
        Version: {packageJson.version}
      </div>
    </div>
  );
}
