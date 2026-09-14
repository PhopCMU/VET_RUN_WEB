# แผนการแก้ไข

1. **[Critical] คีย์เข้ารหัสถูกส่งไปยัง client bundle**
   - **ไฟล์:** `src/routers/PostRouter.tsx:56-60`, `src/routers/PostRouter.tsx:167-171`
   - **ปัญหา:** `VITE_SECRET_KEY_CRYPTO_FRONTEND` ถูกใช้เป็นคีย์ AES ในโค้ดฝั่งเบราว์เซอร์ โดยตัวแปรที่ขึ้นต้นด้วย `VITE_` จะถูก Vite ฝังใน bundle ที่ผู้ใช้เข้าถึงได้
   - **ผลกระทบ:** ผู้ใช้สามารถอ่านคีย์และสร้างหรือแก้ไข payload ที่เข้ารหัสเองได้ การเข้ารหัสนี้จึงไม่ช่วยยืนยันความถูกต้องหรือรักษาความลับของข้อมูลสมัครและคำสั่งซื้อ
   - **วิธีแก้:** ส่งข้อมูลผ่าน HTTPS โดยไม่เข้ารหัสด้วยคีย์ฝั่ง client แล้วให้ backend ทำการเข้ารหัสหรือจัดการข้อมูลลับด้วยคีย์ที่ไม่ถูกส่งสู่ browser; backend ต้องตรวจสอบข้อมูลทุกฟิลด์ก่อนบันทึก

2. **[Critical] หน้าขั้นเลือกกิจกรรมอาจ crash เมื่อข้อมูลโควตาสัตว์ยังไม่พร้อม**
   - **ไฟล์:** `src/components/Step2SubOptions.tsx:121`
   - **ปัญหา:** `checkLimitAnimal` รับค่า `undefined` ได้จาก parent แต่มีการเข้าถึง `checkLimitAnimal.not_fancy.status` โดยไม่มี guard ขณะ API ยังโหลดอยู่หรือเรียกไม่สำเร็จ
   - **ผลกระทบ:** ผู้ใช้ที่ไปถึงขั้นตอนที่ 2 ก่อน request เสร็จ หรือเมื่อ request ล้มเหลว จะพบ runtime error และไม่สามารถดำเนินการสมัครต่อได้
   - **วิธีแก้:** แสดง loading/error state จนกว่าจะได้ข้อมูลที่ตรวจสอบ schema แล้ว หรือป้องกันด้วย optional chaining พร้อมกำหนดค่า disabled ที่ปลอดภัย; เปลี่ยน prop เป็น optional ที่สะท้อนกรณี loading อย่างชัดเจน

3. **[High] ยอดค่าจัดส่งรายตัวที่แสดงไม่ตรงกับยอดที่ส่งไปชำระ**
   - **ไฟล์:** `src/pages/Sale_shirts/page.tsx:120-122`, `src/pages/Sale_shirts/page.tsx:887-889`
   - **ปัญหา:** `shippingFee` คิดค่าจัดส่งเพิ่มตัวละ `5` บาท แต่ส่วนสรุปยอดแสดงเพิ่มตัวละ `10` บาท
   - **ผลกระทบ:** ผู้ใช้เห็นรายละเอียดราคาไม่ตรงกับยอดรวม อาจโอนเงินผิดยอดและทำให้การตรวจสอบการชำระเงินล้มเหลว
   - **วิธีแก้:** สร้างค่าธรรมเนียมต่อชิ้นเป็น constant เดียว แล้วใช้คำนวณทั้ง `shippingFee` และข้อความแสดงผล; เพิ่ม test สำหรับ 1 ชิ้นและหลายชิ้น

4. **[High] การยืนยันสมัครสามารถส่งคำขอซ้ำได้**
   - **ไฟล์:** `src/components/ConfirmationModal.tsx:42-46`, `src/components/ConfirmationModal.tsx:365-377`; `src/pages/page.tsx:295-342`
   - **ปัญหา:** หลัง `onConfirm()` เริ่ม `handleSubmit` ไม่มีสถานะ submitting ที่ส่งกลับมาปิดปุ่มยืนยัน และปุ่มยังเรียก handler ซ้ำได้ก่อน request แรกเสร็จ
   - **ผลกระทบ:** การคลิกซ้ำอาจสร้างรายการสมัครและการอัปโหลดหลักฐานชำระเงินซ้ำ
   - **วิธีแก้:** ส่ง `isLoading` ไปยัง `ConfirmationModal`, disable ปุ่มยืนยันและปุ่มแก้ไขระหว่าง submit, และมี guard ต้น `handleSubmit` เช่น `if (isLoading) return`; backend ควรรองรับ idempotency หรือป้องกันรายการซ้ำด้วย

5. **[High] ยอดเงินและรายการเสื้อถูกกำหนดจากข้อมูลที่ผู้ใช้แก้ไขได้**
   - **ไฟล์:** `src/pages/Sale_shirts/page.tsx:218-227`
   - **ปัญหา:** client ส่ง `total_amount` และ `orderItems` ที่ประกอบจาก state ของ browser โดยตรง และการเข้ารหัสที่ใช้ป้องกันการแก้ไขไม่ได้ตามข้อ 1
   - **ผลกระทบ:** ผู้โจมตีสามารถปรับราคา, จำนวน, รุ่น, สี หรือไซส์ใน request ได้ หาก backend บันทึกค่าที่รับมาโดยไม่คำนวณและตรวจสอบซ้ำ จะเกิดยอดขายหรือสต็อกที่ไม่ถูกต้อง
   - **วิธีแก้:** ส่งเฉพาะ identifier และจำนวนที่จำเป็น; backend ต้องตรวจสอบสินค้า/สต็อกและคำนวณราคากับค่าจัดส่งจากข้อมูลฝั่ง server ก่อนสร้าง order โดยไม่เชื่อ `total_amount` จาก client

6. **[Medium] การโหลดคำแปลล้มเหลวแล้วหน้าแอปค้างที่ loading**
   - **ไฟล์:** `src/i18n.ts:5-8`, `src/i18n.ts:31-39`; `src/providers/I18nProvider.tsx:11-13`
   - **ปัญหา:** `loadLocale()` ไม่ตรวจ `response.ok` และ `Promise.all()` ไม่มี `catch` หรือ `finally`; หากไฟล์ locale ใดโหลดไม่สำเร็จ `readyPromise` จะไม่ resolve
   - **ผลกระทบ:** `I18nProvider` คงแสดง `Loading` ตลอดไปและเกิด unhandled promise rejection เมื่อเครือข่ายหรือไฟล์ locale ผิดพลาด
   - **วิธีแก้:** ตรวจ HTTP status, handle failure ของแต่ละ locale และ resolve readiness ใน `finally` โดยมี fallback resource ภาษาอังกฤษที่ใช้งานได้; แสดงข้อความ retry เมื่อ fallback ใช้ไม่ได้

7. **[Medium] เปิดลิงก์ภายนอกโดยยังให้หน้าใหม่เข้าถึง `window.opener`**
   - **ไฟล์:** `src/pages/Sale_shirts/tracking.tsx:55-57`
   - **ปัญหา:** `window.open()` เปิดแท็บใหม่โดยไม่มี `noopener,noreferrer`
   - **ผลกระทบ:** หน้าปลายทางสามารถเปลี่ยน location ของหน้าเดิมผ่าน `window.opener` ได้ หากปลายทางถูก compromise หรือ redirect ไปยังเว็บอันตราย
   - **วิธีแก้:** ใช้ `window.open("https://track.thailandpost.com/", "_blank", "noopener,noreferrer")` และตรวจสอบว่าคืนค่า `null` ได้ตามปกติ

8. **[Low] ฟอร์มขายเสื้อมี label ที่ไม่เชื่อมกับ input/select**
   - **ไฟล์:** `src/pages/Sale_shirts/page.tsx:286-366`, `src/pages/Sale_shirts/page.tsx:518-612`, `src/pages/Sale_shirts/page.tsx:748-758`
   - **ปัญหา:** label หลายตัวไม่มี `htmlFor` และ input/select ปลายทางไม่มี `id` หรือ accessible name ที่สัมพันธ์กัน
   - **ผลกระทบ:** ผู้ใช้ screen reader ไม่ทราบวัตถุประสงค์ของช่องกรอก และการกด label ไม่ย้าย focus ไปยัง control
   - **วิธีแก้:** กำหนด `id` ที่คงที่ต่อบรรทัดสินค้า เช่น `shirt-model-${index}` และจับคู่ผ่าน `htmlFor`; เพิ่ม `aria-describedby` ให้ข้อความช่วยเหลือหรือ error ที่เกี่ยวข้อง

9. **[Low] ตรวจสอบ lint ไม่ผ่านเพราะ `any` และ dependency ของ Hook ไม่ครบ**
   - **ไฟล์:** `src/routers/GetRouter.tsx:9-142`, `src/routers/PostRouter.tsx:9-294`, `src/components/Step3Form.tsx:18-20,169-178`, `src/components/Navbar.tsx:26`
   - **ปัญหา:** `npm run lint` พบ 39 errors และ 5 warnings รวมถึง `@typescript-eslint/no-explicit-any` และ `react-hooks/exhaustive-deps`
   - **ผลกระทบ:** CI lint ใช้งานไม่ได้, type safety ของข้อมูล API หายไป และ Hook อาจใช้ค่า route/query ที่ค้างอยู่
   - **วิธีแก้:** สร้าง type สำหรับ API response และ error ของ Axios แทน `any`; ปรับ dependency array ตาม lint หรือย้ายค่าที่ใช้เข้า effect อย่างถูกต้อง แล้วตั้งให้ `npm run lint` ผ่านก่อน merge