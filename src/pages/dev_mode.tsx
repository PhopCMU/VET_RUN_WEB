import { motion } from "framer-motion";

export default function DevMode() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        aria-labelledby="maintenance-title"
        className="w-full max-w-2xl border border-brand-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(50,18,71,0.12)] sm:p-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined text-4xl">build</span>
        </motion.div>

        <p className="mt-7 text-sm font-semibold text-brand-700">
          VETRUN 2026
        </p>
        <h1
          id="maintenance-title"
          className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          ระบบกำลังปิดปรับปรุง
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-gray-600">
          ขณะนี้ทีมงานกำลังปรับปรุงระบบเพื่อเตรียมความพร้อมสำหรับการลงทะเบียน
        </p>

        <div className="mt-7 border-y border-brand-100 bg-brand-50 px-4 py-5 sm:px-8">
          <p className="text-sm font-medium text-gray-600">
            ระบบจะเปิดให้ลงทะเบียนอีกครั้ง
          </p>
          <p className="mt-1 text-xl font-bold text-brand-800 sm:text-2xl">
            16 กันยายน 2569 เวลา 09:09 น.
          </p>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          ขออภัยในความไม่สะดวก และขอขอบคุณที่รอใช้บริการ
        </p>
      </motion.section>
    </main>
  );
}