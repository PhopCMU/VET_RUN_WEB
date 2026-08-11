import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FunctionGetParticipantByEmail } from "../routers/GetRouter";

interface Participant {
  participantId?: string;
  firstName?: string;
  lastName?: string;
  numberBib?: string;
  nameBib?: string;
  typeBib?: string;
  payment?: boolean;
}

export default function Lists_participants() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDataParticipant = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    setIsLoading(true);
    setHasSearched(true);
    setErrorMessage("");
    setParticipants([]);
    setCategory("");
    setSubCategory("");

    const response = await FunctionGetParticipantByEmail(normalizedEmail);
    if (response.success && response.data) {
      setParticipants(
        Array.isArray(response.data) ? response.data : [response.data],
      );
    } else if (!response.success && response.message) {
      setErrorMessage(response.message);
    }
    setIsLoading(false);
  };

  const getCategoryFromNameBib = (nameBib?: string) => {
    if (!nameBib) return { category: "", subCategory: "" };

    if (
      nameBib.startsWith("FRW") ||
      nameBib.startsWith("FRM") ||
      nameBib.startsWith("FRMD") ||
      nameBib.startsWith("FRWD")
    ) {
      // ถ้าเริ่มต้นด้วย FRW, FRMD หรือ FRWD
      const isRunWithDog = nameBib.includes("D");
      return {
        category: isRunWithDog ? "FUNRUN_WITH_DOG" : "FUNRUN",
        subCategory: isRunWithDog
          ? t("table_list.select_category.funrun.fr1")
          : t("table_list.select_category.funrun.fr2"),
      };
    } else if (nameBib.startsWith("VIP")) {
      return {
        category: "VIP",
        subCategory: "",
      };
    } else if (nameBib.startsWith("FANCY")) {
      return {
        category: "FANCY",
        subCategory: "FANCY GROUP",
      };
    } else if (
      [
        "W19",
        "W20",
        "W30",
        "W40",
        "W50",
        "M19",
        "M20",
        "M30",
        "M40",
        "M50",
      ].some((prefix) => nameBib.startsWith(prefix))
    ) {
      const ageGroups: Record<string, string> = {
        W19: t("table_list.select_category.marathon.Y19"),
        W20: t("table_list.select_category.marathon.Y20"),
        W30: t("table_list.select_category.marathon.Y30"),
        W40: t("table_list.select_category.marathon.Y40"),
        W50: t("table_list.select_category.marathon.Y50"),
        M19: t("table_list.select_category.marathon.Y19"),
        M20: t("table_list.select_category.marathon.Y20"),
        M30: t("table_list.select_category.marathon.Y30"),
        M40: t("table_list.select_category.marathon.Y40"),
        M50: t("table_list.select_category.marathon.Y50"),
      };
      return {
        category: "MARATHON",
        subCategory: ageGroups[nameBib.slice(0, 3)] || "",
      };
    }

    return { category: "", subCategory: "" };
  };

  const filteredParticipants = participants.filter((participant) => {
    const {
      category: participantCategory,
      subCategory: participantSubCategory,
    } = getCategoryFromNameBib(participant.nameBib);

    let matchesCategory = true;

    if (category === "FUNRUN") {
      matchesCategory =
        participantCategory === "FUNRUN" ||
        participantCategory === "FUNRUN_WITH_DOG";
    } else if (category === "FUNRUN_WITH_DOG") {
      matchesCategory = participantCategory === "FUNRUN_WITH_DOG";
    } else if (category === "FUNRUN_NO_DOG") {
      matchesCategory = participantCategory === "FUNRUN";
    } else if (category === "MARATHON") {
      matchesCategory = participantCategory === "MARATHON";
    } else if (category === "VIP") {
      matchesCategory = participantCategory === "VIP";
    } else if (category === "FANCY") {
      matchesCategory = participantCategory === "FANCY";
    }

    if ((category === "FUNRUN" || category === "MARATHON") && subCategory) {
      matchesCategory = participantSubCategory === subCategory;
    }

    return matchesCategory;
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSubCategory(""); // reset subCategory เมื่อเปลี่ยน category
  };

  return (
    <div className="page-frame">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center text-2xl font-extrabold text-brand-900 sm:text-3xl md:text-4xl"
      >
        {t("table_list.list_participants")}
      </motion.h1>

      {/* Email verification and filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="content-panel mb-8 space-y-4 p-4 sm:p-5"
      >
        <form onSubmit={fetchDataParticipant} className="space-y-3">
          <label
            htmlFor="participant-email"
            className="block text-sm font-semibold text-gray-800"
          >
            {t("table_list.email_label")}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400">
                  mail
                </span>
              </div>
              <input
                id="participant-email"
                type="email"
                autoComplete="email"
                required
                aria-describedby="participant-email-hint"
                placeholder={t("table_list.email_placeholder")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full p-3 pl-11"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-700 px-5 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-xl">
                {isLoading ? "progress_activity" : "search"}
              </span>
              {isLoading
                ? t("table_list.searching")
                : t("table_list.check_registration")}
            </button>
          </div>
          <p id="participant-email-hint" className="text-sm text-gray-500">
            {t("table_list.email_hint")}
          </p>
        </form>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <span className="material-symbols-outlined text-xl">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {participants.length > 1 && (
          <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-4">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">
                  filter_alt
                </span>
              </div>
              <select
                value={category}
                onChange={handleCategoryChange}
                aria-label={t("table_list.select_category.all")}
                className="w-full appearance-none bg-white p-3 pl-11"
              >
                <option value="">
                  -- {t("table_list.select_category.all")} --
                </option>
                <option value="VIP">VIP</option>
                <option value="FUNRUN">FUN RUN</option>
                <option value="MARATHON">MINI MARATHON</option>
                <option value="FANCY">FANCY</option>
              </select>
            </div>

            {(category === "FUNRUN" || category === "MARATHON") && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex-1 min-w-[200px]"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {category === "FUNRUN" ? (
                    <span className="material-symbols-outlined text-gray-400">
                      pets
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-gray-400">
                      groups
                    </span>
                  )}
                </div>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  aria-label={t("table_list.select_category.all")}
                  className="w-full appearance-none bg-white p-3 pl-11"
                >
                  <option value="">
                    -- {t("table_list.select_category.all")} --
                  </option>
                  {category === "FUNRUN" ? (
                    <>
                      <option
                        value={t("table_list.select_category.funrun.fr2")}
                      >
                        {t("table_list.select_category.funrun.fr2")}
                      </option>
                      <option
                        value={t("table_list.select_category.funrun.fr1")}
                      >
                        {t("table_list.select_category.funrun.fr1")}
                      </option>
                    </>
                  ) : (
                    <>
                      <option
                        value={t("table_list.select_category.marathon.Y19")}
                      >
                        {t("table_list.select_category.marathon.Y19")}
                      </option>
                      <option
                        value={t("table_list.select_category.marathon.Y20")}
                      >
                        {" "}
                        {t("table_list.select_category.marathon.Y20")}
                      </option>
                      <option
                        value={t("table_list.select_category.marathon.Y30")}
                      >
                        {" "}
                        {t("table_list.select_category.marathon.Y30")}
                      </option>
                      <option
                        value={t("table_list.select_category.marathon.Y40")}
                      >
                        {" "}
                        {t("table_list.select_category.marathon.Y40")}
                      </option>
                      <option
                        value={t("table_list.select_category.marathon.Y50")}
                      >
                        {" "}
                        {t("table_list.select_category.marathon.Y50")}
                      </option>
                    </>
                  )}
                </select>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-md"
      >
        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-3">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant: any, index: number) => {
              const {
                category: displayCategory,
                subCategory: displaySubCategory,
              } = getCategoryFromNameBib(participant.nameBib);

              return (
                <motion.div
                  key={participant.participantId || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-md border border-brand-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-brand-600">
                          sell
                        </span>
                        <span className="font-mono text-sm font-bold text-brand-700">
                          {participant.nameBib}
                          {participant.numberBib}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            participant.typeBib === "VIP" &&
                            displayCategory !== "VIP"
                              ? "bg-purple-100 text-purple-800"
                              : "hidden"
                          }`}
                        >
                          {participant.typeBib === "VIP" &&
                          displayCategory !== "VIP"
                            ? "VIP"
                            : null}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            displayCategory === "VIP"
                              ? "bg-purple-100 text-purple-800"
                              : displayCategory === "FUNRUN" ||
                                  displayCategory === "FUNRUN_WITH_DOG"
                                ? "bg-blue-100 text-blue-800"
                                : displayCategory === "MARATHON"
                                  ? "bg-green-100 text-green-800"
                                  : displayCategory === "FANCY"
                                    ? "bg-pink-100 text-pink-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {displayCategory === "MARATHON"
                            ? "MINI_MARATHON"
                            : displayCategory}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 gap-x-1 ${
                          participant.payment
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          local_atm
                        </span>
                        {participant.payment ? "Success" : "Pending.."}
                      </span>
                    </div>
                  </div>
                  {displaySubCategory && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-gray-500">
                        info
                      </span>
                      <span className="text-gray-500 text-sm">
                        {displaySubCategory}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : !isLoading && !errorMessage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-lg border border-gray-200 text-center"
            >
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">
                sentiment_dissatisfied
              </span>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-500">
                  {t(
                    hasSearched
                      ? "table_list.not_found"
                      : "table_list.enter_email",
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    hasSearched
                      ? "table_list.try_different_email"
                      : "table_list.email_hint",
                  )}
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-700">
              <tr>
                <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      person
                    </span>
                    <span>{t("table_list.fullname")}</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      sell
                    </span>
                    <span>{t("table_list.numberbib")}</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      category
                    </span>
                    <span>{t("table_list.category")}</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      info
                    </span>
                    <span>{t("table_list.detail")}</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      local_atm
                    </span>
                    <span>{t("table_list.status_payment")}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant: any, index: number) => {
                  const {
                    category: displayCategory,
                    subCategory: displaySubCategory,
                  } = getCategoryFromNameBib(participant.nameBib);

                  return (
                    <motion.tr
                      key={participant.participantId || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 font-mono text-sm font-bold text-brand-700">
                        {participant.nameBib}
                        {participant.numberBib}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              participant.typeBib === "VIP" &&
                              displayCategory !== "VIP"
                                ? "bg-purple-100 text-purple-800"
                                : "hidden"
                            }`}
                          >
                            {participant.typeBib === "VIP" &&
                            displayCategory !== "VIP"
                              ? "VIP"
                              : null}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              displayCategory === "VIP"
                                ? "bg-purple-100 text-purple-800"
                                : displayCategory === "FUNRUN" ||
                                    displayCategory === "FUNRUN_WITH_DOG"
                                  ? "bg-blue-100 text-blue-800"
                                  : displayCategory === "MARATHON"
                                    ? "bg-green-100 text-green-800"
                                    : displayCategory === "FANCY"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {displayCategory === "MARATHON"
                              ? "MINI_MARATHON"
                              : displayCategory}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {displaySubCategory || (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 gap-x-1 ${
                            participant.payment
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            local_atm
                          </span>
                          {participant.payment ? "Success" : "Pending.."}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : !isLoading && !errorMessage ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-5xl text-gray-300">
                        sentiment_dissatisfied
                      </span>
                      <div className="space-y-1">
                        <p className="text-lg font-medium text-gray-500">
                          {t(
                            hasSearched
                              ? "table_list.not_found"
                              : "table_list.enter_email",
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          {t(
                            hasSearched
                              ? "table_list.try_different_email"
                              : "table_list.email_hint",
                          )}
                        </p>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
