# convert-relative-to-alias-import

Simple utility to convert relative to aliased imports.

## Usage

`npx convert-relative-to-alias-import <alias> <rootDirectory>`;

or use command line flags:

- `alias` (or `a`)
- `rootDir` (or `r`)

## Example

Given a project in which the code is in the ./src directory.

Add the following to your tsconfig.json:

```json
{
    "compilerOptions":{
        "baseUrl": "src",
        "paths": {
          "@/*": ["./*"],
        }
    }
}
```

Then run the following command to update all import statements in your project:
`npx convert-relative-to-alias-import @ src`;

Your imports will now look like this:

```typescript
import example from '@/utils/example';
```

Instead of:

```typescript
import example from '../utils/example';
```
