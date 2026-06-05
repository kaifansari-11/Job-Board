# Job-Board 🚀

A modern, fully responsive full-stack job board application built with Node.js, Express, and MySQL. It features a custom dark-mode UI and supports three distinct user roles: Job Seekers, Employers, and Administrators.

## 🌟 Features

**For Job Seekers:**
* Browse and search for active job listings.
* Apply to jobs directly with a customized cover letter.
* Manage a personal profile including bio, location, social links, and skills.
* Upload a profile avatar and PDF resume (Powered by Cloudinary).
* Track application statuses (Pending, Reviewed, Accepted, Rejected) in a dedicated dashboard.

**For Employers:**
* Post, edit, and delete job listings.
* View a dashboard of active listings and track applicant counts.
* Review candidate applications, download resumes, and update application statuses.

**For Administrators:**
* Dedicated Admin Panel to oversee platform activity.
* View global statistics (Total Jobs, Users, Applications, Employers).
* Delete malicious or outdated jobs and users (with cascading deletion of associated data).

**General:**
* Secure authentication using `bcrypt` and `express-session`.
* Fully responsive, custom CSS dark theme.

---

## 🛠️ Tech Stack

* **Frontend:** EJS (Embedded JavaScript templates), Custom CSS, HTML5
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Hosted via TiDB Cloud)
* **File Storage:** Cloudinary (via Multer)
* **Authentication:** express-session, bcrypt

---

## ⚙️ Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* A remote MySQL database (like [TiDB Cloud](https://tidbcloud.com/)) or a local MySQL server.
* A [Cloudinary](https://cloudinary.com/) account for image and PDF hosting.

### 1. Clone the repository

git clone [https://github.com/yourusername/job-board.git](https://github.com/yourusername/job-board.git)

cd job-board