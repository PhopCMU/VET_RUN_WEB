import { useTranslation } from "react-i18next";
import { useState, type FormEvent } from "react";

import { FunctionGetTrackingAll } from "../../routers/GetRouter";
import { motion } from "framer-motion";

export default function Tracking() {
  const [dataTracking, setDataTracking] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  const fetchData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    setIsLoading(true);
    setHasSearched(true);
    setErrorMessage("");
    setDataTracking([]);

    try {
      const response = await FunctionGetTrackingAll(normalizedEmail);
      if (response.success && response.data) {
        setDataTracking(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      } else {
        setErrorMessage(
          response.message || t("tracking.notFound", "ไม่พบข้อมูลออเดอร์"),
        );
      }
    } catch {
      setErrorMessage(
        t("tracking.error", "ไม่สามารถค้นหาข้อมูลได้ กรุณาลองอีกครั้ง"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-frame max-w-7xl"
    >
      {/* Header */}
      <div className="mb-8 rounded-md bg-brand-700 p-5 text-white shadow-md sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">local_shipping</span>
            <h3 className="font-semibold">
              {t("tracking.title", "Order Tracking")}
            </h3>
          </div>
        </div>

        <button
          onClick={() =>
            window.open("https://track.thailandpost.com/", "_blank")
          }
          className="flex min-h-12 w-full items-center justify-between rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/20"
        >
          <span>ตรวจสอบพัสดุ Thailand Post</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>

      <div className="content-panel mb-8 p-4 sm:p-5">
        <form onSubmit={fetchData} className="space-y-3">
          <label
            htmlFor="tracking-email"
            className="ml-1 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <span className="material-symbols-outlined text-base text-blue-500">
              mail
            </span>
            {t("tracking.emailLabel", "อีเมลที่ใช้สั่งซื้อ")}
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                <span className="material-symbols-outlined text-lg text-gray-400">
                  mail
                </span>
              </div>

              <input
                id="tracking-email"
                type="email"
                autoComplete="email"
                required
                aria-describedby="tracking-email-hint"
                placeholder={t(
                  "tracking.searchPlaceholder",
                  "name@example.com",
                )}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full py-3.5 pl-12 pr-4"
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
                ? t("tracking.searching", "กำลังค้นหา...")
                : t("tracking.searchButton", "ค้นหาออเดอร์")}
            </button>
          </div>

          <p id="tracking-email-hint" className="text-sm text-gray-500">
            {t(
              "tracking.emailHint",
              "กรอกอีเมลเดียวกับที่ใช้สั่งซื้อเพื่อตรวจสอบสถานะ",
            )}
          </p>
        </form>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <span className="material-symbols-outlined text-xl">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Table or No Data */}
      {dataTracking.length > 0 ? (
        <div className="content-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-brand-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        person
                      </span>
                      {t("tracking.fullname", "ข้อมูลผู้สั่งซื้อ")}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        payments
                      </span>
                      {t("tracking.payment", "สถานะการชําระเงิน")}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        local_shipping
                      </span>
                      {t("tracking.collection", "วิธีจัดส่ง")}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        qr_code
                      </span>
                      {t("tracking.tracking", "เลขพัสดุ")}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        list_alt
                      </span>
                      {t("tracking.items", "จำนวนรายการ")}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        event
                      </span>
                      {t("tracking.date", "สั่งซื้อวันที่")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataTracking.map((item, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-brand-50 even:bg-gray-50/60"
                  >
                    <td className="py-4 px-6 border-b border-gray-100">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-medium text-gray-900">
                          {item.fullname || "-"}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="material-symbols-outlined text-base">
                            mail
                          </span>
                          {item.email || "-"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="material-symbols-outlined text-base">
                            call
                          </span>
                          {item.phone || "-"}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-100">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          item.payment
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {item.payment ? "check_circle" : "schedule"}
                        </span>
                        {t(
                          item.payment ? "ชำระเงินสำเร็จ" : "รอตรวจสอบสลิป",
                          item.payment ? "ชำระเงินสำเร็จ" : "รอตรวจสอบสลิป",
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-600">
                          {item.sh_collection_method === "pickup"
                            ? "store"
                            : "local_shipping"}
                        </span>
                        {t(
                          `collection.${item.sh_collection_method}`,
                          item.sh_collection_method === "pickup"
                            ? "รับเอง"
                            : "จัดส่ง",
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-100">
                      {item.ems_tracking && item.ems_tracking !== "-" ? (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-500">
                            qr_code_scanner
                          </span>
                          <span className="font-mono text-blue-600">
                            {item.ems_tracking}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="py-4 px-6 border-b border-gray-100 text-center">
                      <div className="bg-blue-50 text-blue-700 rounded-lg py-1 px-3 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          shopping_bag
                        </span>
                        <span className="font-medium">
                          {item.orderItemCount || 0}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="material-symbols-outlined text-base">
                          calendar_today
                        </span>
                        <span className="text-sm">
                          {new Date(item.createdAt)
                            .toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            .replace(/ /g, " ") || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : hasSearched && !isLoading && !errorMessage ? (
        <div className="content-panel py-16 text-center">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
            search_off
          </span>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {t("tracking.noData", "ไม่พบข้อมูลการติดตามออเดอร์")}
          </h3>
        </div>
      ) : null}
    </motion.div>
  );
}
