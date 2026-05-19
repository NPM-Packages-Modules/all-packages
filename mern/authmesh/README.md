# authmesh

JWT **access + refresh rotation** (in-memory refresh store for the default — swap for Redis in production), **role guards**, **device fingerprint** helper, **brute-force counters**, and **OAuth CSRF state** helpers.

```ts
import express from "express";
import {
  authmesh,
  loginHandler,
  refreshHandler,
} from "@mr-aftab-ahmad-khan/authmesh";

const app = express();
app.use(express.json());
app.post("/login", loginHandler(opts, async (email, password) => userOrNull));
app.post("/refresh", refreshHandler(opts, getUserBySub));
app.use(authmesh({ accessSecret }));
```

## License

MIT
