# Shah Jee Courier - Local & cPanel Setup Guide 🇵🇰

Aapne is project ko export kar liya hai! Ab ise local system par **VS Code + Laragon (MySQL)** me chalane aur **cPanel** par live karne ke liye niche di gayi steps ko follow karein.

Aap is guide ko direct **Blackbox AI / ChatGPT / Claude** me paste karke bhi apna saara local system setup unse karwa sakte hain!

---

## 1. Local Setup in Laragon (MySQL)

Laragon ek bohot hi powerful aur fast tool hai local PHP/MySQL environments chalane ke liye.

### Step A: Database Create Karein
1. Laragon open karein aur **"Start All"** par click karein.
2. Laragon interface me **"Database"** (HeidiSQL) button par click karein ya phpMyAdmin kholien.
3. Ek naya database banayein jiska naam rakhein: `shahjee_courier_db`.

### Step B: SQL Schema Import Karein
Humare database me tables banane ke liye niche diye gaye SQL query ko run karein:

```sql
CREATE TABLE IF NOT EXISTS `pickup_addresses` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `address_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tracking_no` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_address` TEXT NOT NULL,
  `destination_city` VARCHAR(100) NOT NULL,
  `booking_date` VARCHAR(50) NOT NULL,
  `cod_amount` INT NOT NULL,
  `delivery_charges` INT NOT NULL,
  `weight` DECIMAL(10,2) DEFAULT 0.50,
  `courier` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `remarks` TEXT DEFAULT NULL,
  `pickup_address_id` VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (`pickup_address_id`) REFERENCES `pickup_addresses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 2. VS Code me Project Kaise Chalayein?

1. Is zip file ko extract karke project folder ko **VS Code** me open karein.
2. VS Code Terminal kholien (`Ctrl + ~`) aur dependencies install karne ke liye niche di gayi command run karein:
   ```bash
   npm install
   ```
3. React application ko start karne ke liye:
   ```bash
   npm run dev
   ```
   *Ab aapka frontend `http://localhost:3000` ya standard Vite port par local run ho jayega!*

---

## 3. Blackbox AI Setup Prompt (Copy-Paste)

Agar aap custom code ya API integration automatic generate karwana chahte hain, to niche diya gaya **Prompt** direct **Blackbox AI** ko de dein. Wo aapko exact connected code de dega!

### Blackbox AI Prompt:
> **Hi Blackbox AI!** Mujhe is React (Vite + Tailwind) logistics aur courier portal ke frontend ko apne local Laragon (MySQL + PHP) se connect karna hai.
> 
> Mere pass local server me ek database `shahjee_courier_db` bana hua hai jisme do tables hain: `pickup_addresses` aur `orders`.
> 
> Mujhe ek simple standard connection chahiye:
> 1. Ek PHP API script bana do (`api.php`) jo local PHP standard database configuration se connect ho sake aur `/api.php?endpoint=orders` par GET (fetch all orders) aur POST (create order) request handle kare.
> 2. React ke `App.tsx` ke state controllers (jahan standard React `useState` hooks se arrays load ho rahi hain) ko fetch requests ke sath replace karne ka code do taake local state ke bajaye real data database se load aur save ho sake.
> 3. Laragon me direct connect hone ke liye backend standard CORS headers handle kare.

---

## 4. cPanel Par Deployment (Production)

Jab aapka local testing complete ho jaye aur aap cPanel par live karna chahein:

1. **Frontend Build**: VS Code terminal me `npm run build` run karein. Aapke paas project me `dist/` folder ban jayega. Is folder ke saare contents ko zip karke cPanel ke `public_html` directory me upload karke extract kar dein.
2. **Backend Upload**: Apni `api.php` file ko bhi `public_html` me hi rakhein.
3. **Apache Redirect (.htaccess)**: `public_html/.htaccess` file me niche di gayi rules paste karein taake refresh karne par React me routing break na ho (404 error na aaye):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```
