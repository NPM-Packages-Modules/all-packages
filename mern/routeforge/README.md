# routeforge

Automatically generate Express routes, controllers, validators, and services from schema definitions.

## Features

- CRUD scaffolding
- request validation
- controller generation
- auto Swagger docs
- service injection

## Example

```ts
import { routeforge } from "@mr-aftab-ahmad-khan/routeforge";

routeforge.generate("users");
```

## Why

MERN developers repeatedly create the same REST boilerplate for every module.

## License

MIT
