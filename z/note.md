



## BASIC QUESTIONS

**Q1. What is JWT?**
JWT (JSON Web Token) is a compact, URL-safe token used to securely transmit information between client and server.

**Q2. What are the parts of a JWT?**
Header, Payload, Signature.

**Q3. What is an Access Token?**
A short-lived token used to authenticate and authorize API requests.

**Q4. What is a Refresh Token?**
A long-lived token used to generate new access tokens without re-login.

**Q5. Why do we need Refresh Token?**
Because access tokens expire quickly for security; refresh tokens keep users logged in.

**Q6. Where should tokens be stored?**
In httpOnly cookies (preferred) or secure storage.

**Q7. What does httpOnly mean?**
JavaScript cannot access the cookie, protecting against XSS attacks.

---

## INTERMEDIATE QUESTIONS

**Q8. Why is Access Token short-lived?**
To limit damage if the token is stolen.

**Q9. Why is Refresh Token long-lived?**
To improve user experience and reduce frequent logins.

**Q10. Why store Refresh Token in Redis?**
For fast access, token revocation, logout support, and auto-expiry.

**Q11. What happens when Access Token expires?**
Client uses refresh token to get a new access token.

**Q12. Why use sameSite="strict" in cookies?**
To prevent CSRF attacks.

**Q13. Difference between Authentication and Authorization?**
Authentication checks who the user is; authorization checks what the user can do.

**Q14. How does logout work in JWT?**
Delete refresh token from Redis and clear cookies.

**Q15. Why not store tokens in localStorage?**
Because localStorage is vulnerable to XSS attacks.

---

## ADVANCED QUESTIONS

**Q16. What is Refresh Token Rotation?**
Issuing a new refresh token each time and invalidating the old one.

**Q17. What if Refresh Token is stolen?**
Attacker can generate access tokens; mitigated by rotation and Redis checks.

**Q18. How do you prevent CSRF in cookie-based auth?**
Use sameSite cookies, CSRF tokens, and HTTPS.

**Q19. Difference between Cookies and LocalStorage?**
Cookies can be httpOnly and auto-sent; localStorage is JS-accessible and less secure.

**Q20. Why use different secrets for Access and Refresh tokens?**
For better security isolation.

**Q21. Is JWT encrypted?**
No, JWT is signed, not encrypted.

**Q22. Can JWT be revoked?**
Access token – No (usually). Refresh token – Yes (via Redis/database).

---

## SCENARIO-BASED QUESTIONS

**Q23. User logs in on two devices – what happens?**
Either allow multiple refresh tokens or invalidate the previous one based on design.

**Q24. What happens when user changes password?**
Invalidate all refresh tokens and force re-login.

**Q25. What if Redis goes down?**
Access tokens still work until expiry; refresh flow breaks.

---

## ONE-LINE INTERVIEW SUMMARY

> Access tokens are short-lived for security, refresh tokens maintain sessions, cookies prevent XSS, and Redis enables secure token management.

---

**Tip:** Revise this sheet before interviews and be ready to explain answers with real-world examples.

}

---

# 🍪 COOKIES – INTERVIEW Q&A SHEET

---

## 1️⃣ What is a cookie?

**Answer:**
A cookie is a small piece of data stored in the browser by the server to maintain state between HTTP requests.

---

## 2️⃣ Why are cookies used?

**Answer:**
To maintain sessions, store authentication tokens, remember user preferences, and track users.

---

## 3️⃣ Where are cookies stored?

**Answer:**
In the user’s browser.

---

## 4️⃣ Who sends cookies to the server?

**Answer:**
The **browser automatically sends cookies** with every request to the same domain.

---

## 5️⃣ Are cookies client-side or server-side?

**Answer:**
Cookies are stored client-side (browser) but created and controlled by the server.

---

## 6️⃣ How does a server set a cookie?

**Answer:**
Using the `Set-Cookie` HTTP response header.

---

## 7️⃣ What is `httpOnly` cookie?

**Answer:**
A cookie that cannot be accessed by JavaScript, protecting against XSS attacks.

---

## 8️⃣ What is `secure` cookie?

**Answer:**
A cookie that is sent only over HTTPS connections.

---

## 9️⃣ What is `sameSite` in cookies?

**Answer:**
Controls whether cookies are sent in cross-site requests to prevent CSRF attacks.

---

## 🔹 sameSite values:

* `strict` → only same-site requests
* `lax` → some cross-site allowed
* `none` → cross-site allowed (requires `secure`)

---

## 🔟 What is cookie expiration?

**Answer:**
The time after which a cookie is deleted from the browser.

---

## 1️⃣1️⃣ Difference between `expires` and `maxAge`?

**Answer:**

* `expires` → specific date/time
* `maxAge` → duration in milliseconds

---

## 1️⃣2️⃣ What happens when a cookie expires?

**Answer:**
The browser automatically deletes it.

---

## 1️⃣3️⃣ Are cookies sent with every request?

**Answer:**
Yes, automatically, for matching domain/path.

---

## 1️⃣4️⃣ What is a session cookie?

**Answer:**
A cookie that exists only until the browser is closed.

---

## 1️⃣5️⃣ Difference between cookies and localStorage?

| Cookies   | LocalStorage   |
| --------- | -------------- |
| Auto sent | Manual         |
| httpOnly  | No             |
| Size ~4KB | ~5MB           |
| Safer     | XSS vulnerable |

---

## 1️⃣6️⃣ Why use cookies for authentication?

**Answer:**
Because cookies support `httpOnly` and are safer than localStorage.

---

## 1️⃣7️⃣ What is CSRF?

**Answer:**
A CSRF attack tricks the browser into sending authenticated requests to another site.

---

## 1️⃣8️⃣ How do cookies help prevent CSRF?

**Answer:**
Using `sameSite` flag and CSRF tokens.

---

## 1️⃣9️⃣ What is XSS?

**Answer:**
An attack where malicious JavaScript is injected into a webpage.

---

## 2️⃣0️⃣ How do cookies prevent XSS?

**Answer:**
`httpOnly` cookies cannot be accessed via JavaScript.

---

## 2️⃣1️⃣ Can cookies be hacked?

**Answer:**
Yes, if not secured with `httpOnly`, `secure`, and HTTPS.

---

## 2️⃣2️⃣ Why not store JWT in localStorage?

**Answer:**
LocalStorage is accessible via JavaScript and vulnerable to XSS.

---

## 2️⃣3️⃣ Can cookies store JWT?

**Answer:**
Yes, cookies are commonly used to store JWT securely.

---

## 2️⃣4️⃣ What is a third-party cookie?

**Answer:**
A cookie set by a different domain than the one the user is visiting.

---

## 2️⃣5️⃣ Are third-party cookies safe?

**Answer:**
They pose privacy risks and are often blocked by modern browsers.

---

## 2️⃣6️⃣ How do you delete a cookie?

**Answer:**
Set its expiration time to the past or use `res.clearCookie()`.

---

## 2️⃣7️⃣ How does browser know which cookies to send?

**Answer:**
Based on domain, path, secure flag, and sameSite rules.

---

## 2️⃣8️⃣ What is cookie size limit?

**Answer:**
~4KB per cookie.

---

## 2️⃣9️⃣ Can cookies store sensitive data?

**Answer:**
No, only tokens or identifiers (not passwords).

---

## 3️⃣0️⃣ Cookie one-line interview answer (⭐ MUST REMEMBER)

> Cookies are small pieces of data stored in the browser, automatically sent with requests, and commonly used for secure authentication and session management.

---

## 🎯 BONUS: AUTH FLOW (1 LINE)

> Server sets cookies → browser stores them → browser sends them automatically → server verifies them.

---

If you want, I can:


Just say 👍

















Below is a **clear, interview-ready explanation** of **pre hook**, **why it is used**, **what salt is**, and **what interview questions are commonly asked** from **this exact code**.

---

# 🔐 Mongoose `pre("save")` Hook – Complete Explanation

## 1️⃣ What is a Pre Hook in Mongoose?

A **pre hook (middleware)** is a function that runs **BEFORE** a specific database operation.

In your code:

```js
userSchema.pre("save", async function (next) {
```

👉 This runs **before a user document is saved** in MongoDB.

---

## 2️⃣ Why is the Pre Hook Used Here?

### ❌ Problem Without Pre Hook

If you save user like this:

```js
password: "123456"
```

The password gets stored in **plain text** ❌
This is a **major security risk**.

---

### ✅ Solution Using Pre Hook

Before saving:

* Password is **hashed**
* Plain password is **never stored**

✔ This ensures **security by default**

---

## 3️⃣ How the Pre Hook Works (Line by Line)

### 🔹 Step 1: Check if Password Was Modified

```js
if (!this.isModified("password")) return next();
```

#### Why?

* Prevents **rehashing password**
* Happens when updating name/email only

📌 Example:

```js
user.name = "New Name";
user.save(); // password should not change
```

---

### 🔹 Step 2: Generate Salt

```js
const salt = await bcrypt.genSalt(10);
```

### What is Salt?

A **salt** is a **random string** added to the password **before hashing**.

Example:

```txt
password = "123456"
salt = "$2a$10$abcd..."
hashed = hash("123456" + salt)
```

---

### 🔹 Why Salt Is Important?

Without salt:

* Same passwords → same hashes
* Easy to crack using rainbow tables

With salt:

* Same passwords → **different hashes**
* Very hard to crack

---

### 🔹 What Does `10` Mean?

```js
bcrypt.genSalt(10)
```

* `10` = **salt rounds**
* Higher = more secure
* Higher = slower hashing

📌 Common values: `10–12`

---

### 🔹 Step 3: Hash the Password

```js
this.password = await bcrypt.hash(this.password, salt);
```

* Converts plain password → hashed password
* Overwrites original password

---

### 🔹 Step 4: Call `next()`

```js
next();
```

Moves to next middleware / save operation.

---

## 4️⃣ Why Not Hash Password in Controller?

| Without Pre Hook | With Pre Hook      |
| ---------------- | ------------------ |
| Repetitive code  | Centralized logic  |
| Easy to forget   | Automatic security |
| Error-prone      | Clean & safe       |

👉 **Pre hook ensures hashing always happens**

---

## 5️⃣ What is `comparePassword` Method?

```js
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
```

### Purpose:

* Compare entered password with hashed password
* Used during login

✔ bcrypt handles salt internally

---

## 6️⃣ Login Flow Using This Schema

1. User enters password
2. `comparePassword()` called
3. bcrypt hashes entered password
4. Compares with stored hash
5. Returns `true / false`

---

# 🎯 INTERVIEW QUESTIONS FROM THIS CODE

## 🟢 Basic Level

### 1️⃣ What is a pre hook in Mongoose?

👉 Function that runs before database operation.

---

### 2️⃣ Why do we use `pre("save")`?

👉 To hash password before saving.

---

### 3️⃣ Why should passwords not be stored in plain text?

👉 Security risk if DB is compromised.

---

### 4️⃣ What is bcrypt?

👉 Library for hashing passwords.

---

## 🟡 Intermediate Level

### 5️⃣ What is salt in bcrypt?

👉 Random value added before hashing to improve security.

---

### 6️⃣ What does `bcrypt.genSalt(10)` mean?

👉 10 salt rounds; balance between security and performance.

---

### 7️⃣ Why use `isModified("password")`?

👉 To avoid rehashing unchanged passwords.

---

### 8️⃣ Can two users have same password hash?

👉 No, because salt is different.

---

### 9️⃣ Where is salt stored?

👉 Inside the hashed password itself.

---

## 🔴 Advanced Level

### 🔟 Can hashed passwords be decrypted?

👉 No, hashing is one-way.

---

### 1️⃣1️⃣ What happens if we forget `isModified()`?

👉 Password gets rehashed every update → login fails.

---

### 1️⃣2️⃣ Difference between hashing and encryption?

| Hashing        | Encryption     |
| -------------- | -------------- |
| One-way        | Two-way        |
| Passwords      | Sensitive data |
| Cannot decrypt | Can decrypt    |

---

### 1️⃣3️⃣ Why bcrypt over SHA or MD5?

👉 bcrypt is slow & resistant to brute-force attacks.

---

## ⭐ One-Line Interview Answer (MEMORIZE)

> The pre save hook is used to hash user passwords automatically before storing them in the database, ensuring security. Salt adds randomness to prevent password cracking attacks.

---

## 🚀 If you want next:

* JWT login flow using this User model
* Refresh token interview questions
* Auth middleware explanation
* Full authentication system diagram

Just say 👍
