import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FunctionGetParticipantAll } from "../routers/GetRouter";

export default function Lists_participants() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const hasParticipant = useRef(false);
  const [participants, setParticipants] = useState<any>([]);

  const fetchDataParticipant = async () => {
    const response = await FunctionGetParticipantAll();
    if (response.success) {
      setParticipants(response.data); // สมมติว่า API return เป็น { success: true, data: [...] }
    }
  };

  useEffect(() => {
    if (!hasParticipant.current) {
      fetchDataParticipant();
      hasParticipant.current = true;
    }
  }, []);

  const getCategoryFromNameBib = (nameBib: string) => {
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

  const filteredParticipants = participants.filter((participant: any) => {
    const matchesSearch =
      participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.numberBib.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.nameBib.toLowerCase().includes(searchTerm.toLowerCase());

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

    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSubCategory(""); // reset subCategory เมื่อเปลี่ยน category
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-[#a66941]"
      >
        {t("table_list.list_participants")}
      </motion.h1>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 space-y-4"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400">
              search
            </span>
          </div>
          <input
            type="text"
            placeholder={t("table_list.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-[#a66941] focus:border-[#a66941] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">
                filter_alt
              </span>
            </div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-[#a66941] focus:border-[#a66941] appearance-none bg-white"
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
                className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-[#a66941] focus:border-[#a66941] appearance-none bg-white"
              >
                <option value="">
                  -- {t("table_list.select_category.all")} --
                </option>
                {category === "FUNRUN" ? (
                  <>
                    <option value={t("table_list.select_category.funrun.fr2")}>
                      {t("table_list.select_category.funrun.fr2")}
                    </option>
                    <option value={t("table_list.select_category.funrun.fr1")}>
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
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-lg shadow-md"
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
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-[#a66941]">
                          sell
                        </span>
                        <span className="font-mono font-bold text-[#a66941] text-sm">
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
          ) : (
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
                  {t("table_list.not_found")}
                </p>
                <p className="text-sm text-gray-400">
                  {t("table_list.try_different_filter")}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#a66941]">
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-mono font-bold text-[#a66941]">
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
              ) : (
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
                          {t("table_list.not_found")}
                        </p>
                        <p className="text-sm text-gray-400">
                          {t("table_list.try_different_filter")}
                        </p>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
