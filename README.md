#########Required Endpoints###########
User/Auth Routes
POST /auth/register

POST /auth/login

User Routes
POST /wallet/deposit

POST /wallet/withdraw

POST /wallet/send

GET /wallet/me

GET /transactions/me

Agent Routes
POST /wallet/cash-in

POST /wallet/cash-out

GET /transactions/commission

Admin Routes
GET /admin/users

GET /admin/agents

GET /admin/wallets

GET /admin/transactions

PATCH /admin/wallets/block/:id

PATCH /admin/agents/approve/:id

❌ Not Required (But Bonus if You Add)
Google OAuth (passport.js, Google Console) ❌ Not required

Password reset/change ❌ Not required

Commission system ✅ optional

Daily/monthly limits ✅ optional

Notification/webhook system ✅ optional





GET /api/v1/admin/users-agents — list all users/agents

PATCH /api/v1/admin/wallets/:id/block — block/unblock wallet

PATCH /api/v1/admin/agents/:id/status — approve/suspend agent


1. Get All Users and Agents
Postman
Method: GET

URL: http://localhost:5000/api/v1/admin/users-agents

Headers:

Authorization: Bearer <your-access-token>

Response: List of users and agents without passwords


2. Block / Unblock Wallet
Postman
Method: PATCH

URL: http://localhost:5000/api/v1/admin/wallets/{walletId}/block

Headers:

Authorization: Bearer <your-access-token>

Content-Type: application/json

Body:

json
Copy
Edit
{
  "block": true  // or false to unblock
}
Response: Updated wallet info

3. Approve / Suspend Agent
Postman
Method: PATCH

URL: http://localhost:5000/api/v1/admin/agents/{agentId}/approve

Headers:

Authorization: Bearer <your-access-token>

Content-Type: application/json

Body:

json
Copy
Edit
{
  "approve": true  // or false to suspend
}
Response: Updated agent info (without password)