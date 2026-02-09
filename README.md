# Numerical Method Website 🧮

A website for learning and trying numerical methods. You can use it to solve math problems step by step.

## What is this project? 📚

This website helps you learn numerical methods. Numerical methods are ways to solve math problems using computers. You can:

- See how to solve problems step by step
- Try different math formulas
- Learn new ways to calculate numbers

## Tech Stack 🛠️

**Frontend (Client)**
- JavaScript
- CSS

**Backend (Server)**
- Node.js

**Database**
- MySQL/PostgreSQL (SQL)

**Other Tools**
- Docker (for easy setup)

## Project Structure 📁

```
NumericalMethodWebsite/
├── client/         # Frontend code
├── server/         # Backend code
├── docker-compose.yml  # Docker setup file
└── numericalmethod.sql # Database file
```

## How to Run 🚀

### Option 1: Use Docker (Easy Way)

1. Make sure you have [Docker](https://www.docker.com/) installed
2. Clone this project:
   ```bash
   git clone https://github.com/Aonsanti/NumericalMethodWebsite.git
   cd NumericalMethodWebsite
   ```
3. Start the app:
   ```bash
   docker-compose up
   ```
4. Open your browser and go to the website

### Option 2: Run Manually

**Step 1: Set up the database**
- Import `numericalmethod.sql` to your database

**Step 2: Run the server**
```bash
cd server
npm install
npm start
```

**Step 3: Run the client**
```bash
cd client
npm install
npm start
```

## Contributing 🤝

Want to help make this project better? Here's how:

1. Fork this repository
2. Create a new branch (`git checkout -b my-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to your branch (`git push origin my-feature`)
6. Open a Pull Request

## License 📝

This project is open source.

## Contact 📧

If you have questions, please open an issue on GitHub.

---

Made with ❤️ for learning math
