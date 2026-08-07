import { useTranslation } from "react-i18next";
import { useI18nReady } from "../../i18n";
import { useEffect, useRef, useState, useMemo } from "react";
import Loading from "../../components/Loading";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { FunctionGetTrackingAll } from "../../routers/GetRouter";
import { motion } from "framer-motion";

export default function Tracking() {
  const [dataTracking, setDataTracking] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // สถานะสำหรับการค้นหา
  const { t } = useTranslation();
  const isI18nReady = useI18nReady();
  const hasFetched = useRef(false);
  const { data, isLoading, error } = useVisitorData({ extendedResult: true });

  const fetchData = async () => {
    if (!data?.visitorId) {
      console.error("Visitor ID is missing");
      return;
    }

    try {
      const response = await FunctionGetTrackingAll({
        visitorId: data.visitorId,
      });
      if (response?.success && Array.isArray(response.data)) {
        setDataTracking(response.data);
      } else {
        console.log("No tracking data found or invalid format");
        setDataTracking([]);
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err);
      setDataTracking([]);
    }
  };

  // ดึงข้อมูลเมื่อ visitorId พร้อม และยังไม่เคยดึง
  useEffect(() => {
    if (data?.visitorId && !hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, [data]);

  // ใช้ useMemo เพื่อ filter ข้อมูลตามคำค้น
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return dataTracking;

    const term = searchTerm.toLowerCase().trim();

    return dataTracking.filter((item) => {
      const fullName = item.fullname?.toLowerCase() || "";
      const phone = item.phone?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";

      return (
        fullName.includes(term) || phone.includes(term) || email.includes(term)
      );
    });
  }, [dataTracking, searchTerm]);

  // แสดง loading ระหว่างรอ
  if (isLoading || !isI18nReady) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="page-frame flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-700">
            <span className="material-symbols-outlined text-xl">error</span>
            <h3 className="font-semibold">FingerprintJS Error</h3>
          </div>
          <p className="mt-2 text-red-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.visitorId) {
    return (
      <div className="page-frame flex items-center justify-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-blue-500 text-3xl mx-auto mb-2">
            fingerprint
          </span>
          <p className="text-blue-700">Unable to retrieve visitor ID</p>
        </div>
      </div>
    );
  }

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

      {/* Search Input with Gradient Background */}
      <div className="content-panel mb-8 p-4 sm:p-5">
        <label
          htmlFor="search"
          className=" text-sm font-medium text-gray-700 mb-3 ml-1 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-blue-500 text-base">
            search
          </span>
          {t("tracking.search", "ค้นหาออเดอร์ (ชื่อ, เบอร์โทร, อีเมล)")}
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
            <span className="material-symbols-outlined text-gray-400 text-lg">
              search
            </span>
          </div>

          <input
            id="search"
            type="text"
            placeholder={t(
              "tracking.searchPlaceholder",
              "พิมพ์ชื่อ, เบอร์โทร หรืออีเมล...",
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3.5 pl-12 pr-11"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 flex items-center pr-4 
                  text-gray-400 hover:text-red-400 transition-all duration-200
                  hover:scale-110"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Table or No Data */}
      {filteredData.length > 0 ? (
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
                {filteredData.map((item, index) => (
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
      ) : (
        <div className="content-panel py-16 text-center">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
            search_off
          </span>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {t("tracking.noData", "ไม่พบข้อมูลการติดตามออเดอร์")}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? `ไม่พบข้อมูลที่ตรงกับคำค้น: "${searchTerm}"` : ``}
          </p>
        </div>
      )}
    </motion.div>
  );
}
