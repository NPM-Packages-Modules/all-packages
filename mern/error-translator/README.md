# error-translatorx

**Topics:** errors · i18n · api · express · mern-packages · merndev · nodejs · npm-pm · typescript

Convert **backend error codes** into user-facing frontend messages without hand-written mapping tables in every screen.

## Install

```bash
npm install error-translatorx
```

## API

```typescript
import { errorTranslator } from "error-translatorx";

errorTranslator.register("USER_EXISTS", "Email already registered");
errorTranslator.translate("USER_EXISTS");
```

## License

MIT
