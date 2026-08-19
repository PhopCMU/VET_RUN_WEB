import React, { useState } from "react";
import { OpenProjectProvider } from "./providers/OpenProject";
import { AlertModal } from "./components/AlertModal";
import { appEnvironment } from "./configs/conf";

interface AppProps {
  children: React.ReactNode;
}

const environmentNotices = {
  DEV: {
    title: "ระบบอยู่ระหว่างการพัฒนา (System Under Development)",
    message:
      "ขณะนี้ทีมงานกำลังพัฒนาและปรับปรุงระบบ ฟังก์ชันต่าง ๆ อาจยังทำงานไม่สมบูรณ์หรือมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า ผู้สมัครยังไม่สามารถดำเนินการลงทะเบียน ชำระเงิน หรือตรวจสอบข้อมูลผ่านระบบได้ในขณะนี้ (The system is currently under development and improvement. Some functions may not work properly or may be changed without prior notice. Applicants are currently unable to register, make payments, or verify information through the system.)",
  },
  TEST: {
    title: "ระบบอยู่ระหว่างการทดสอบ (System Under Testing)",
    message:
      "ขณะนี้ระบบอยู่ระหว่างการทดสอบการทำงานและตรวจสอบความถูกต้องของข้อมูล ฟังก์ชันบางส่วนอาจทำงานไม่สมบูรณ์ ข้อมูลที่บันทึกในช่วงนี้อาจถูกล้างหรือเปลี่ยนแปลง และยังไม่ถือเป็นการสมัครอย่างเป็นทางการ (The system is currently undergoing functional testing and data verification. Some functions may not work properly. Data recorded during this period may be cleared or changed and shall not be considered an official application.)",
  },
} as const;

const App: React.FC<AppProps> = ({ children }) => {
  const environmentNotice =
    appEnvironment === "PROD" ? undefined : environmentNotices[appEnvironment];
  const [isDevelopmentNoticeOpen, setIsDevelopmentNoticeOpen] = useState(
    environmentNotice !== undefined,
  );

  return (
    <OpenProjectProvider>
      <div className="app-shell theme-scope">{children}</div>
      <AlertModal
        isOpen={isDevelopmentNoticeOpen}
        type="warning"
        title={environmentNotice?.title}
        message={environmentNotice?.message ?? ""}
        confirmText="รับทราบ"
        dismissible={appEnvironment !== "DEV"}
        onClose={() => setIsDevelopmentNoticeOpen(false)}
      />
    </OpenProjectProvider>
  );
};

export default App;
