Express Backend APIA RESTful backend API built with Express.js, NeonDB (PostgreSQL), and JWT authentication.Includes Signup, Email Verification, Login, and full CRUD for Tasks using Prisma 7.Tech StackExpress.js – Web frameworkNeonDB – Serverless PostgreSQL databasePrisma 7 – Next-generation ORMbcryptjs – Password hashingjsonwebtoken – Access & Refresh token generationnodemailer – Email verificationexpress-validator – Schema validationcookie-parser – Secure httpOnly cookie handlingGetting Started1. Clone & InstallBashgit clone <your-repo-url>
cd express-api
npm install
2. Configure EnvironmentBashcp .env.example .env
Fill in your .env:VariableDescriptionPORTServer port (default: 5000)DATABASE_URLNeonDB PostgreSQL connection stringJWT_ACCESS_SECRETSecret for signing access tokensJWT_REFRESH_SECRETSecret for signing refresh tokensJWT_ACCESS_EXPIRESAccess token expiry (e.g. 15m)JWT_REFRESH_EXPIRESRefresh token expiry (e.g. 7d)EMAIL_HOSTSMTP host (e.g. smtp.gmail.com)EMAIL_PORTSMTP port (e.g. 587)EMAIL_USERYour email addressEMAIL_PASSYour email app passwordCLIENT_URLFrontend URL for CORS & email links3. Database Setup (Prisma)Since we are using Prisma 7, ensure your database is in sync and the client is generated:Bash# Push schema to NeonDB
npx prisma db push

# Generate Prisma Client
npx prisma generate
4. RunBash# Development
npm run dev

# Production
npm start
API EndpointsAuthMethodEndpointDescriptionAuth RequiredPOST/api/auth/signupRegister a new userNoGET/api/auth/verify-email?token=Verify email addressNoPOST/api/auth/loginLogin and get tokensNoPOST/api/auth/refreshRefresh access tokenNo (cookie)POST/api/auth/logoutLogout and clear tokenNoTasks (CRUD)All task routes require Authorization: Bearer <accessToken> header.MethodEndpointDescriptionGET/api/tasksGet all user tasks (with pagination & status filter)GET/api/tasks/:idGet a single taskPOST/api/tasksCreate a new taskPUT/api/tasks/:idUpdate a taskDELETE/api/tasks/:idDelete a taskProject Structureexpress-api/
├── prisma/
│   └── schema.prisma       # Database models & schema
├── src/
│   ├── config/
│   │   └── prisma.js       # Prisma client + PG adapter config
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js         # JWT protection middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── email.js
│   │   └── jwt.js
│   └── index.js            # App entry point
├── prisma.config.ts        # Prisma 7 CLI configuration
└── .env                    # Environment variables
Security & Database NotesDatabase: Relational PostgreSQL hosted on NeonDB.Auth: Passwords hashed with bcryptjs (12 rounds).Tokens: Short-lived access tokens (15m) and secure httpOnly refresh tokens.Scoping: All task operations are scoped to req.user.userId. Users cannot access data belonging to other IDs.Prisma 7: Uses @prisma/adapter-pg for serverless-friendly PostgreSQL connections.Group Members(Add your names here)
