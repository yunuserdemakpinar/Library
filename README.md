# Kütüphane Uygulaması

Kullanıcıların kitap bilgilerini ve kapak fotoğraflarını ekleyip listeyebildiği bir kütüphane uygulamasıdır. Kullanıcılar, kitaplarını local bir veritabanında saklarken, kapak fotoğraflarını telefon hafızasında tutar. Kitap kapağı tarama özelliği sayesinde kullanıcılar, bir API aracılığıyla kitap kapaklarını taratarak hızlıca arama yapabilir. 

---

## **Proje Özellikleri**

### **1. Storage / Basic Data**
- Taranan kitap kapakları, telefon hafızasında saklanmaktadır.

### **2. Local Database**
- **Kullanıcı ve kitap bilgileri**, Async Storage ile local bir veritabanında saklanmaktadır. 

### **3. RESTFul API (CRUD)**
- Uygulama, AI tabanlı bir API ile iletişim kurarak kitap kapaklarını tarama özelliğini sağlar.
- API üzerinden kitap kapağı bilgileri alınıp, JSON formatında işlenir.

### **4. UI (Compose)**
- Uygulamanın arayüzü, kullanıcı dostu ve modern bir deneyim sunmak için **Jetpack Compose** ile tasarlanmıştır.

### **5. Background Process / Task**
- Telefonun sabit bir şekilde durması durumunda hareket sensörleri ile ekran parlaklığı arttırılarak kullanıcıya okuma konforu sağlanır.
- Bu fonksiyon, **background**'da sürekli olarak çalıştırılmaktadır.

### **6. Broadcast Receiver**
- İnternet bağlantısı kesildiğinde cihaz, bir uyarı bildirimi gönderir.

### **7. Sensor (Motion / Location / Environment)**
- Uygulamada **hareket sensörleri** kullanılarak cihazın sabit durumu algılanır ve parlaklık arttırılır.

### **8. Connectivity (Wifi)**
- Uygulama, kitap kapağı tarama API'sine ve diğer internet işlemlerine bağlanmak için **WiFi bağlantısını** kullanır.

### **9. Authorization (Session Token)**
- Kullanıcı doğrulama işlemleri için **Session Token** kullanılmıştır.

### **10. Cloud Service (AI)**
- Kullanıcılar, taranan kitap kapaklarının kapağından kitabın ismini öğrenebilir ve ona göre otomatik arama yapabilir.

---

## **Kurulum ve Kullanım**

### **APK İndirme Linki**
- Uygulamanın APK dosyasını aşağıdaki bağlantıdan indirebilirsiniz:
  [https://expo.dev/accounts/ekremk/projects/library/builds/01d8eadd-6ea8-4939-8e6e-444504bec31e](#)

### **QR Kod ile APK İndirme**
- QR kodu kullanarak APK'yi cihazınıza kolayca indirebilirsiniz:
  
  ![QR Kod](./qr.png)

### **Kullanım Videosu**
- Scan Book Cover methodunun nasıl çalıştığını detaylı bir şekilde gösteren videoyu aşağıdaki bağlantıdan izleyebilirsiniz:
  [Kullanım Videosu](./ScanBook_kullanim.mp4)

---

## **Nasıl Çalışır?**

### **Kitap Kapağı Taraması**
1. Kullanıcı, **Scan Book Cover** seçeneği ile kamera veya galeriden kitap kapağı seçer.
2. Kitap kapağı, telefon hafızasında saklanır.
3. Bir API aracılığıyla kitap kapağından metin okunur.
4. Okunan metin, kitap ismi ile eşleşir ve otomatik olarak kitap listesi sonuçları görüntülenir.

### **Yönetici Özellikleri**
- Yöneticiler, kullanıcıların aksine kitapları **düzenleyebilir** ve **silebilir**.

### **Hareket Sensörleri ile Parlaklık Kontrolü**
- Kullanıcının cihazı sabit bir şekilde durduğunda, ekran parlaklığı artırılarak okuma konforu sağlanır.

---

## **Teknolojiler**
- **Kullanılan Teknolojiler:**
  - Jetpack Compose (UI)
  - Async Storage (Local Database)
  - RESTful API
  - Motion Sensors
  - MediaLibrary (Kapak Fotoğrafı Depolama)

---

## **Geliştirme Ekibi**
- Ekrem Kırdemir
- Yunus Erdem Akpınar
- Görkem Koç
- Esra Ciba
- Ahmet Göçmen

---

**Not:** QR kodu, APK indirme bağlantısı ve kullanım videosu placeholder olarak bırakılmıştır. Gerekli içerikleri tamamladıktan sonra bu bölümleri güncelleyebilirsiniz.
